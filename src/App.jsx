import { useEffect, useState } from "react";
import './index.css'


export function Questions() {
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((jsondata) => {
        console.log("data", jsondata);
        setData(jsondata);
      })
      .catch((error) => {
        console.error("Error al cargar la data", error);
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
    setShowResults(true);
  };

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
        <p>error</p>
      ) : (
        dataActive.map((item) => (
          <div className="m-5 bg-blue-300 p-2 rounded-md" key={item.id}>
            <form>
              <fieldset>
                <legend className="p-4">SELECCIONE LA RESPUESTA CORRECTA</legend>
                <h3 className="text-xl font-bold">{item.question}</h3>

                <div className="bg-gray-700 text-white p-0.5 rounded-md m-4" >{[item.a1, item.a2, item.a3, item.a4].map((answer, index) => {
                  const inputId = `q${item.id}-${index}`;
                  const color = getColor(item.id, answer);
                  return (
                    
                    <div className="bg-gray-700 text-white px-3 rounded-md w-full" key={inputId}>
                      <input className="m-3 "
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
                          fontWeight: showResults && color ? "bold" : "normal",
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
      <button className="m-2 border-2 p-2 rounded-md bg-green-300 font-semibold hover:bg-amber-300" onClick={handleCheckAnswers}>Comprobar respuestas</button>
    </div>
  );
}
