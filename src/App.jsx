import { useEffect, useState } from "react";
import "./App.css";
import { GiPartyPopper } from "react-icons/gi";
import { ImCross } from "react-icons/im";

function App() {
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [solution, setSolution] = useState([]);
  const [resultMessage, setResultMessage] = useState(null);

  async function fetchSudokuSolution() {
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v1/sudokugenerate?difficulty=easy",
        {
          method: "GET",
          headers: {
            "X-Api-Key": "eNNGhjeghOiwSXT27DT4oQ==zQA18cLfYn2Ptick",
          },
        }
      );

      const result = await response.json();
      console.log(result);
      if (result && result.solution) {
        setSolvedBoard(result.puzzle);
        setSolution(result.solution);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  useEffect(() => {
    if (solvedBoard.length > 0) {
      setUserValue(
        solvedBoard.map((row) => row.map((cell) => (cell === null ? "" : cell)))
      );
    }
  }, [solvedBoard]);

  function handleInputChange(rowIndex, Index, updatevalue) {
    setUserValue((previtems) => {
      const userUpdateValue = previtems.map((row) => [...row]);
      userUpdateValue[rowIndex][Index] = updatevalue;
      return userUpdateValue;
    });
  }
  let Condition = true;

  function Submitsudoku() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solvedBoard[i][j] == null) {
          if (userValue[i][j] !== solution[i][j].toString()) {
            Condition = false;
            break;
          }
        }
      }
    }
    if (Condition) {
      setResultMessage(
        <span className="text-green-600 flex items-center gap-2 text-lg sm:text-xl">
          <GiPartyPopper /> Well Done!
        </span>
      );
    } else {
      setResultMessage(
        <span className="text-red-600 flex items-center gap-2 text-lg sm:text-xl">
          <ImCross /> Incorrect, try again.
        </span>
      );
    }
  }

  useEffect(() => {
    fetchSudokuSolution();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 ">
        <div>
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
            <h1 className="text-center text-3xl sm:text-4xl font-bold mb-6">
              Sudoku
            </h1>
          </div>
          <div className="overflow-auto ">
            {solvedBoard.length > 0 ? (
              <table className="table-fixed border border-collapse rounder">
                <tbody>
                  {solvedBoard.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((item, Index) => (
                        <td
                          key={Index}
                          className={`border-2 border-black w-10 h-10 sm:w-14 sm:h-14 text-center align-middle ${
                            item === null
                              ? "bg-white"
                              : "bg-fuchsia-500 text-2xl"
                          }`}
                        >
                          {item !== null ? (
                            item
                          ) : (
                            <input type="number"
                              className="w-full h-full text-center text-lg outline-none"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  Index,
                                  e.target.value
                                )
                              }
                              min={1}
                              max={9}
                            ></input>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <button
            onClick={Submitsudoku}
            className="px-6 py-3 text-white bg-blue-700 rounded-lg mt-0.5 hover:bg-blue-800 text-lg sm:text-xl"
          >
            Submit
          </button>

          {resultMessage && (
            <div className="mt-4 text-center">{resultMessage}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
