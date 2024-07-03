import React, { useRef, useState, useEffect } from "react";

export default function Game() {
  const inputsRef = useRef([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [words, setWords] = useState(Array(6).fill(""));
  const [wordToGuess, setWordToGuess] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/word")
      .then((response) => response.json())
      .then((data) => {
        setWordToGuess(data.word);
      });
  }, []);

  const handleInput = (row, col) => {
    if (inputsRef.current[row][col].value.length === 1 && col < 4) {
      inputsRef.current[row][col + 1].focus();
    }
  };

  const handleKeyDown = (e, row, col) => {
    if (
      e.key === "Backspace" &&
      col > 0 &&
      inputsRef.current[row][col].value === ""
    ) {
      inputsRef.current[row][col - 1].focus();
    }

    if (e.key === "Enter" && col === 4) {
      let formedWord = "";
      for (let i = 0; i < 5; i++) {
        formedWord += inputsRef.current[row][i].value.toUpperCase();
      }

      const newWords = [...words];
      newWords[row] = formedWord;
      setWords(newWords);

      // Check the formed word against the pre-defined word
      let allCorrect = true;
      for (let i = 0; i < 5; i++) {
        if (formedWord[i] === wordToGuess[i]) {
          inputsRef.current[row][i].classList.add("bg-blue-800");
        } else if (wordToGuess.includes(formedWord[i])) {
          inputsRef.current[row][i].classList.add("bg-yellow-800");
          allCorrect = false;
        } else {
          inputsRef.current[row][i].classList.add("bg-slate-800");
          allCorrect = false;
        }
      }

      if (allCorrect && formedWord === wordToGuess) {
        setShowModal(true);
      }

      if (row < 5) {
        // Disable the current row
        for (let i = 0; i < 5; i++) {
          inputsRef.current[row][i].disabled = true;
        }
        // Enable the next row and focus on the first input of the next row
        for (let i = 0; i < 5; i++) {
          inputsRef.current[row + 1][i].disabled = false;
        }
        inputsRef.current[row + 1][0].focus();
        setCurrentRow(row + 1);
      }
    }
  };

  const resetGame = () => {
    // Clear all inputs
    inputsRef.current.forEach((row) => {
      row.forEach((input) => {
        input.value = "";
        input.classList.remove("bg-green-800", "bg-yellow-800", "bg-gray-800");
        input.disabled = false;
      });
    });

    // Reset game states
    setWords(Array(6).fill(""));
    setCurrentRow(0);
    setShowModal(false);

    // Fetch a new word to guess
    fetch("http://localhost:3000/api/word")
      .then((response) => response.json())
      .then((data) => {
        setWordToGuess(data.word);
      });
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-slate-900 to-slate-700 w-screen h-screen">
      {showModal && (
        <div className="w-1/2 bg-slate-50 mx-auto p-12 rounded-xl space-y-6 absolute">
          <h1 className="text-3xl text-center">Congrats! You guessed the word!</h1>
          <div className="flex justify-end space-x-4">
            <button button onClick={resetGame} className="px-4 py-2 bg-green-500 rounded-xl">Reset</button>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-500 rounded-xl">Close</button>
          </div>
        </div>
      )}
      <div className="w-11/12 xs:w-10/12 sm:w-9/12 space-y-10">
        <h1 className="text-center text-4xl md:text-6xl text-slate-50 poppins">
          Wordle Plus
        </h1>
        <div className="grid grid-rows-6 gap-3 mx-auto w-11/12 xs:w-10/12 sm:w-9/12">
          {[...Array(6)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  className="text-2xl h-20 text-slate-50 border p-1 block bg-transparent text-center uppercase"
                  maxLength="1"
                  onInput={() => handleInput(rowIndex, colIndex)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  ref={(el) => {
                    if (!inputsRef.current[rowIndex]) {
                      inputsRef.current[rowIndex] = [];
                    }
                    inputsRef.current[rowIndex][colIndex] = el;
                  }}
                  disabled={rowIndex !== currentRow}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-end px-3">
          <button className="bg-slate-200 px-4 py-2 rounded-xl" onClick={resetGame}>Reset</button>
        </div>
      </div>
    </div>
  );
}
