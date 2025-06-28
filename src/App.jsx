import { useEffect, useState } from "react";
import "./index.css";


export function Questions() {
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((jsondata) => {
        console.log("data", jsondata);
        setData(jsondata);
      })
      .catch((error) => {
        console.error("Error al cargar la informacion desde el servidor", error);
      });
  }, []);

  const dataActive = data.filter((item) => item.clase === "true");

  const handleChange = (questionId, selectedAnswer) => {
    setAnswers({
      ...answers,
      [questionId]: selectedAnswer,
    });
  };

  const handleCheckAnswers = () => {
    let correctCount = 0;

    dataActive.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correct) {
        correctCount += 1;
      }
    });

    setScore(correctCount);
    setShowResults(true);
  };
  const handleScore = () => {};

  const getColor = (questionId, option) => {
    if (!showResults) return "";
    const correctAnswer = data.find((q) => q.id === questionId)?.correct;
    const selectedAnswer = answers[questionId];
    if (option === correctAnswer) return "green";
    if (option === selectedAnswer && option !== correctAnswer) return "red";
    return "";
  };

  return (
    <div>
      {dataActive.length === 0 ? (
        <p className="font-bold p-3 text-xl">Refresque la pagina</p>
      ) : (
        dataActive.map((item) => (
          <div className="m-5 bg-blue-300 p-2 rounded-md" key={item.id}>
            <form>
              <fieldset>
                <legend className="p-4">
                  SELECCIONE LA RESPUESTA CORRECTA
                </legend>
                <h3 className="text-xl font-bold px-4">
                  {" "}
                  {item.id}.-{item.question}
                </h3>

                <div className="bg-gray-700 text-white p-0.5 rounded-md m-4">
                  {[item.a1, item.a2, item.a3, item.a4].map((answer, index) => {
                    const inputId = `q${item.id}-${index}`;
                    const color = getColor(item.id, answer);
                    return (
                      <div
                        className="bg-gray-700 text-white px-3 rounded-md w-full"
                        key={inputId}
                      >
                        <input
                          className="m-3 "
                          type="radio"
                          id={inputId}
                          name={`questionary-${item.id}`}
                          value={answer}
                          checked={answers[item.id] === answer}
                          onChange={() => handleChange(item.id, answer)}
                        />
                        <label
                          htmlFor={inputId}
                          style={{
                            color: color,
                            fontWeight:
                              showResults && color ? "bold" : "normal",
                          }}
                        >
                          {answer}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <br></br>
              </fieldset>
            </form>
          </div>
        ))
      )}
      <div className="flex flex-col items-center">
        <button
          className="mx-5 my-2.5 border-2 p-2 rounded-md bg-green-300 font-semibold hover:bg-amber-300"
          onClick={handleCheckAnswers}
        >
          Comprobar respuestas
        </button>
        {showResults && (
          <div
            className={`mt-4 rounded-md px-3 py-1 border-1 text-xl bg-amber-100 font-bold text-center ${
              score >= 7 ? "text-green-700" : "text-red-600"
            }`}
          >
            Has obtenido: {score} / {dataActive.length}
          </div>
        )}
      </div>
    </div>
  );
}
