const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());

// Function to get a random word from the text file
function getRandomWord() {
  const filePath = path.join(__dirname, '../wordle/src/assets/library.txt'); // Update with the correct path to your text file
  const words = fs.readFileSync(filePath, 'utf8').split('\n');
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].trim().toUpperCase();
}


// Route to get a random word
app.get('/api/word', (req, res) => {
  const word = getRandomWord();
  console.log("Word:" + word)
  res.json({ word });
});

app.get('/api/words', (req, res) => {
  const filePath = path.join(__dirname, '../wordle/src/assets/library.txt'); // Update with the correct path to your text file
  const words = fs.readFileSync(filePath, 'utf8').split('\n');
  res.json({words})
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
