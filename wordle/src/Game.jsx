import React, { useRef, useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { app, auth, db } from "../firebase/firebase"; // Ensure the correct path to your firebase.ts fileimport { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const inputsRef = useRef([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [words, setWords] = useState(Array(6).fill(""));
  const [wordToGuess, setWordToGuess] = useState("");
  // modals
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  // firebase / stats
  const [userCurrentWins, setUserCurrentWins] = useState(0);
  const [userCurrentLoss, setUserCurrentLoss] = useState(0);
  const [userCurrentStreak, setUserCurrentStreak] = useState(0);

  const [uid, setUID] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setUID(uid);
        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
          const userData = doc.data();
          setUserCurrentWins(userData.wins);
          setUserCurrentLoss(userData.loss);
          setUserCurrentStreak(userData.streak);
        });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  });

  useEffect(() => {
    fetch("https://backend-eosin-two.vercel.app/api/word")
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
    console.log(userCurrentLoss);
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
          inputsRef.current[row][i].classList.remove("bg-transparent");
          inputsRef.current[row][i].classList.add("bg-green-800");
        } else if (wordToGuess.includes(formedWord[i])) {
          inputsRef.current[row][i].classList.remove("bg-transparent");
          inputsRef.current[row][i].classList.add("bg-yellow-800");
          allCorrect = false;
        } else {
          inputsRef.current[row][i].classList.remove("bg-transparent");
          inputsRef.current[row][i].classList.add("bg-gray-500");
          allCorrect = false;
        }
      }

      if (allCorrect && formedWord === wordToGuess) {
        setShowWinModal(true);
        setGameComplete(true);
      } else if (row === 5 && formedWord !== wordToGuess) {
        setShowLoseModal(true);
        setGameComplete(true);
      } else if (row < 5) {
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

  useEffect(() => {
    if (gameComplete) {
      handleGameComplete();
    }
  }, [gameComplete]);

  const handleGameComplete = () => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // Add a new document in collection "cities"
        try {
          const statsRef = doc(db, "users", uid);

          if (showWinModal) {
            setDoc(
              statsRef,
              {
                wins: userCurrentWins + 1,
                loss: userCurrentLoss,
                streak: userCurrentStreak + 1,
              },
              { merge: true }
            );
          } else if (showLoseModal) {
            setDoc(
              statsRef,
              {
                wins: userCurrentWins,
                loss: userCurrentLoss + 1,
                streak: 0,
              },
              { merge: true }
            );
          }
        } catch (error) {
          console.log(error);
        }
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  };

  const resetGame = () => {
    // Clear all inputs and set the first row to be editable
    inputsRef.current.forEach((row, rowIndex) => {
      row.forEach((input) => {
        input.value = "";
        input.classList.remove("bg-green-800", "bg-yellow-800", "bg-gray-500");
        input.classList.add("bg-transparent");
        input.disabled = rowIndex !== 0; // Disable all rows except the first one
      });
    });

    // Set focus on the first input of the first row
    inputsRef.current[0][0].focus();

    // Reset game states
    setWords(Array(6).fill(""));
    setCurrentRow(0);
    setShowWinModal(false);
    setShowLoseModal(false);
    setGameComplete(false);

    // Fetch a new word to guess
    fetch("https://backend-eosin-two.vercel.app/api/word")
      .then((response) => response.json())
      .then((data) => {
        setWordToGuess(data.word);
      });
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Logout successful");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-slate-900 to-slate-700 w-screen h-screen">
      {showWinModal && (
        <div className="w-1/2 bg-slate-50 mx-auto p-12 rounded-xl space-y-6 absolute">
          <h1 className="text-3xl text-center">
            Congrats! You guessed the word! The word is {wordToGuess}
          </h1>
          <div className="flex justify-center gap-x-3">
            <h2>Wins: {userCurrentWins}</h2>
            <h2>Loss: {userCurrentLoss}</h2>
            <h2>Streak: {userCurrentStreak}</h2>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-green-500 rounded-xl"
            >
              Reset
            </button>
            <button
              onClick={() => setShowWinModal(false)}
              className="px-4 py-2 bg-red-500 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showLoseModal && (
        <div className="w-1/2 bg-slate-50 mx-auto p-12 rounded-xl space-y-6 absolute">
          <h1 className="text-3xl text-center">
            Aww, You failed to guess the word! The word is {wordToGuess}
          </h1>
          <div className="flex justify-center gap-x-3">
            <h2>Wins: {userCurrentWins}</h2>
            <h2>Loss: {userCurrentLoss}</h2>
            <h2>Streak: 0</h2>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-green-500 rounded-xl"
            >
              Reset
            </button>
            <button
              onClick={() => setShowLoseModal(false)}
              className="px-4 py-2 bg-red-500 rounded-xl"
            >
              Close
            </button>
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
                  className="text-2xl h-20 text-slate-50 border bg-transparent p-1 block text-center uppercase"
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
        <div className="flex justify-end px-3 space-x-3">
          <button
            className="bg-slate-200 px-4 py-2 rounded-xl"
            onClick={resetGame}
          >
            Reset
          </button>
          {uid && (
            <button
              className="bg-red-300 px-4 py-2 rounded-xl"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
