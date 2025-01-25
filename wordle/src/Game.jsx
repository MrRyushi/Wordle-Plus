import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GameUtil from './lib/Game/GameUtil';
import APICaller from "./lib/API/APICaller";
import DBHelper from "./lib/Data/DBHelper";
import GameInterface from "./lib/UI/GameInterface";

export default function Game() {
  const inputsRef = useRef([]);

  const [currentRow, setCurrentRow] = useState(0);
  const [words, setWords] = useState(Array(6).fill(""));
  const [wordToGuess, setWordToGuess] = useState("");
  const [wordsLibrary, setWordsLibrary] = useState([])

  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const [userCurrentWins, setUserCurrentWins] = useState(0);
  const [userCurrentLoss, setUserCurrentLoss] = useState(0);
  const [userCurrentStreak, setUserCurrentStreak] = useState(0);

  const [uid, setUID] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await DBHelper.getUserData(
          setUID,
          setUserCurrentWins,
          setUserCurrentLoss,
          setUserCurrentStreak
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const words = await APICaller.fetchWords();
        setWordsLibrary(words);
        const word = await APICaller.fetchWordToGuess();
        setWordToGuess(word);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleGameComplete = async () => {
    try {
      await DBHelper.updateUserStats(
        userCurrentWins,
        userCurrentLoss,
        userCurrentStreak,
        showWinModal,
        showLoseModal
      );
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  useEffect(() => {
    if (gameComplete) {
      handleGameComplete();
    }
  }, [gameComplete]);

  const resetGame = () => {

    GameUtil.resetClearWordleInputs(inputsRef.current);
    GameUtil.resetOnScreenKeyboardButtons();

    // Reset game states
    setWords(Array(6).fill(""));
    setCurrentRow(0);
    setShowWinModal(false);
    setShowLoseModal(false);
    setGameComplete(false);

    // Fetch a new word to guess
    APICaller.fetchWordToGuess()
      .then((word) => {
        setWordToGuess(word);
      })
      .catch((error) => {
        console.error("Error fetching word to guess:", error);
      });
  };

  const handleButtonClick = (letter) => {
    if (letter === "Enter") {
      handleEnter(currentRow);
    } else if (letter === "Erase") {
      GameUtil.backspaceLetterInput(currentRow, words[currentRow].length, inputsRef.current, setWords);
    } else {
      GameUtil.inputLetter(currentRow, words[currentRow].length, inputsRef.current, letter, setWords)
    }
  };

  // TODO: Abstract into GameCore
  const handleEnter = (row) => {
    let word = inputsRef.current[row];
    let formattedWord = GameUtil.toUpperCaseWordleInput(word);
    
    if (wordsLibrary.includes(formattedWord.toLowerCase())) {

      setWords(prevWords => {
        const updatedWords = [...prevWords];
        updatedWords[row] = formattedWord;
        return updatedWords;
      });


      let allCorrect = GameUtil.checkWordleLetters(formattedWord, wordToGuess, word);

      GameUtil.updateWordleGameState()
      GameUtil.updateWordleGameState(allCorrect, formattedWord, wordToGuess,
        setShowLoseModal, setGameComplete, setShowWinModal,
        inputsRef, row, setCurrentRow);

    } else {
      alert("Word is not in the library");
    }
  };

  // TODO: Consolidate into GameCore [This is duplicated with Handle Enter]
  const handleKeyDown = (e, row, col) => {

    if (
      e.key === "Backspace" &&
      col > 0 &&
      inputsRef.current[row][col].value === ""
    ) {
      inputsRef.current[row][col - 1].focus();
    }

    if (e.key === "Enter" && col === 4) {
      handleEnter(row);
    }
  };


  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-slate-950 to-slate-900 md:h-auto py-20 md:py-12 overflow-x-hidden">
      {showWinModal && (
        <div className="md:w-1/2 bg-slate-50 mx-10 md:mx-auto p-12 rounded-xl space-y-6 absolute poppins">
          <h1 className="text-xl md:text-3xl text-center">
            Congrats! You guessed the word! The word is <span className="text-yellow-800 font-bold">{wordToGuess}</span>
          </h1>
          <div className="flex justify-center gap-x-3">
            <h2>Wins: {userCurrentWins}</h2>
            <h2>Loss: {userCurrentLoss}</h2>
            <h2>Streak: {userCurrentStreak}</h2>
          </div>
          <div className="flex justify-center space-x-4 poppins">
            <button
              onClick={resetGame}
              className="px-4 py-2 text-sm md:text-base bg-green-400 rounded-xl"
            >
              Reset
            </button>
            <button
              onClick={() => setShowWinModal(false)}
              className="px-4 py-2 text-sm md:text-base bg-red-400 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showLoseModal && (
        <div className="md:w-1/2 bg-slate-50 mx-10 md:mx-auto p-12 rounded-xl space-y-6 absolute poppins">
          <h1 className="text-xl md:text-3xl text-center">
            Aww, You failed to guess the word! The word is <span className="text-yellow-800 font-bold">{wordToGuess}</span>
          </h1>
          <div className="flex justify-center gap-x-3">
            <h2>Wins: {userCurrentWins}</h2>
            <h2>Loss: {userCurrentLoss}</h2>
            <h2>Streak: 0</h2>
          </div>
          <div className="flex justify-center space-x-4 poppins">
            <button
              onClick={resetGame}
              className="px-4 py-2 text-sm md:text-base bg-green-400 rounded-xl"
            >
              Reset
            </button>
            <button
              onClick={() => setShowLoseModal(false)}
              className="px-4 py-2 text-sm md:text-base bg-red-400 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="w-11/12 xs:w-10/12 sm:w-9/12 space-y-10">
        <div className="grid grid-rows-6 gap-3 mx-auto w-11/12 xs:w-10/12 sm:w-9/12 md:w-2/3 lg:w-1/2 xl:w-2/5">
          {[...Array(6)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  className="text-2xl h-16 md:h-20 text-slate-50 border bg-transparent p-1 block text-center uppercase"
                  maxLength="1"
                  onInput={() => GameUtil.moveInputIndex(rowIndex, colIndex, inputsRef.current)}
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
        <div className="space-y-3">
          <GameInterface.KeyboardUI handleButtonClick={handleButtonClick} />
        </div>
        <div className="flex justify-center md:justify-end px-3 space-x-3 poppins">
          <button
            className="bg-slate-200 px-4 py-2 rounded-xl text-sm md:text-base"
            onClick={resetGame}
          >
            Reset
          </button>
          <button
            className="bg-yellow-500 px-4 py-2 rounded-xl text-sm md:text-base"
            onClick={() => navigate('/leaderboards')}
          >
            Leaderboards
          </button>
        </div>
        <button className="text-sm md:text-xl py-2 px-6 mx-auto sm:mx-0 block bg-slate-900 text-slate-50 rounded-xl poppins border hover:bg-slate-800" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}
