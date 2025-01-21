// Utility Classes for Core Game Mechanics

class GameUtil {

    static toUpperCaseWordleInput(word) {
        let formedWord = "";    
        for (let i = 0; i < 5; i++) {
            formedWord += word[i].value.toUpperCase();
        }
        return formedWord;
    }
    
    static updateLetterIsCorrect(letter){
        letter.classList.remove("bg-transparent");
        letter.classList.add("bg-green-800");
        const letterValue = letter.value.toUpperCase();
        const button = document.getElementById(letterValue);
        button.classList.remove("bg-yellow-800");
        button.classList.remove("bg-gray-900");
        button.classList.add("bg-green-800");
    }

    static updateLetterIsFound(letter){
        letter.classList.remove("bg-transparent");
        letter.classList.add("bg-yellow-800");
        const letterValue = letter.value.toUpperCase();
        const button = document.getElementById(letterValue);
        button.classList.remove("bg-gray-900");
        button.classList.add("bg-yellow-800");
    }

    static updateLetterIsNotFound(letter){
        letter.classList.remove("bg-transparent");
        letter.classList.add("bg-gray-500");
        const letterValue = letter.value.toUpperCase();
        const button = document.getElementById(letterValue);
        button.classList.add("bg-gray-900");
        button.disabled = true;
    }

    static useNextWordleRow(wordleRow, currentRow, setCurrentRow){
        const currentWordleRow = wordleRow[currentRow]
        const nextWordleRow = wordleRow[currentRow + 1]
        for (let i = 0; i < 5; i++) {
            currentWordleRow[i].disabled = true;
        }
        for (let i = 0; i < 5; i++) {
            nextWordleRow[i].disabled = false;
        }
        nextWordleRow[0].focus();
        setCurrentRow(currentRow + 1);
    }

    static backspaceLetterInput(row, currentIndex, word, setWords){
        if (currentIndex > 0) {
            setWords(prevWords =>
                prevWords.map((word, index) =>
                    index === row ? word.slice(0, -1) : word
                )
            );
            word[row][currentIndex - 1].value = "";
            word[row][currentIndex - 1].focus();
        }
    }

    static inputLetter(row, col, words, letter, setWords){
        if (col < 5) {
            words[row][col].value = letter;
            setWords(prevWords =>
                prevWords.map((word, index) =>
                    index === row ? word + letter : word
                )
            );
            this.moveInputIndex(row, col, words);
        }
    }

    static moveInputIndex(row, col, words){
        if (words[row][col].value.length === 1 && col < 4) {
            words[row][col + 1].focus();
        }
    }

    static resetClearWordleInputs(words){
        // Clear all inputs and set the first row to be editable
        words.forEach((row, rowIndex) => {
            row.forEach((input) => {
                input.value = "";
                input.classList.remove("bg-green-800", "bg-yellow-800", "bg-gray-500");
                input.classList.add("bg-transparent");
                input.disabled = rowIndex !== 0; // Disable all rows except the first one
            });
        });
        // Set focus on the first input of the first row
        words[0][0].focus();
    }

    static resetOnScreenKeyboardButtons(){
        // reset buttons
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            const button = document.getElementById(letter);

            if (button) {
                button.classList.add('bg-gray-500');
                button.classList.remove('bg-green-800', 'bg-gray-900');
            }
        }
    }
}

export default GameUtil;