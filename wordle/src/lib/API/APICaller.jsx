class APICaller {
    static async fetchWords() {
        try {
            const response = await fetch("https://backend-eosin-two.vercel.app/api/words");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.words;
        } catch (error) {
            console.error('Error fetching words:', error);
            throw error;
        }
    }

    static async fetchWordToGuess() {
        try {
            const response = await fetch("https://backend-eosin-two.vercel.app/api/word");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.word;
        } catch (error) {
            console.error('Error fetching word to guess:', error);
            throw error;
        }
    }
}

export default APICaller;
