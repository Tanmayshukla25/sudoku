
import { useEffect, useState } from "react";
import "./App.css";
import { GiPartyPopper } from "react-icons/gi";
import { ImCross } from "react-icons/im";

function App() {
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [solution, setSolution] = useState([]);
  const [resultMessage, setResultMessage] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);

async function fetchSudokuSolution(selectedDifficulty) {
  try {
    setLoading(true); 
    const response = await fetch(
      `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${selectedDifficulty}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": "eNNGhjeghOiwSXT27DT4oQ==zQA18cLfYn2Ptick",
        },
      }
    );

    const result = await response.json();
    if (result && result.solution) {
      setSolvedBoard(result.puzzle);
      setSolution(result.solution);
      setResultMessage(null);
      setIsFirstLoad(false);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false); 
  }
}


  useEffect(() => {
    if (solvedBoard.length > 0) {
      setUserValue(
        solvedBoard.map((row) => row.map((items) => (items === null ? "" : items)))
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

  function Submitsudoku() {
    let Condition = true;
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

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-300 p-4">
        <div>
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
            <h1 className="text-center text-3xl sm:text-4xl font-bold mb-6">
              Sudoku
            </h1>
            <div className="mb-4">
              <label className="mr-2 font-semibold">Select Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  const selectedDifficulty = e.target.value;
                  setDifficulty(selectedDifficulty);
                  fetchSudokuSolution(selectedDifficulty);
                }}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Choose </option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {loading && (
  <div className="text-center mt-4 text-lg font-semibold text-emerald-900">
  <h1 class="text-2xl font-bold text-center flex items-center gap-2 justify-center">
  <svg class="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
  </svg>
  Loading Sudoku
</h1>

  </div>
)}
            </div>
          </div>

          {solvedBoard.length > 0 && (
            <>
              <div className="overflow-auto mt-4">
                <table className="table-fixed border border-collapse rounded">
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
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[1-9]{1}"
                                maxLength={1}
                                className="w-full h-full text-center text-lg outline-none"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^[1-9]?$/.test(value)) {
                                    handleInputChange(rowIndex, Index, value);
                                  }
                                }}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={Submitsudoku}
                className="px-6 py-3 text-white bg-blue-700 rounded-lg mt-4 hover:bg-blue-800 text-lg sm:text-xl"
              >
                Submit
              </button>
            </>
          )}

          {resultMessage && (
            <div className="mt-4 text-center">{resultMessage}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

