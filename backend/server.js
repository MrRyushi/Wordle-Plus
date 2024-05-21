const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL server.');

    db.query('CREATE DATABASE IF NOT EXISTS wordle', (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database "wordle" created or already exists.');
    });

    db.query('USE wordle');

    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL PRIMARY KEY,
            password VARCHAR(255) NOT NULL
        )
    `;

    db.query(createUserTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Table "users" created or already exists.');
    });
});

// Routes
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, email, password], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user' });
            }
            console.log('User registered successfully');
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(403).json({ error: 'All fields are required' });
    }

    const findUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        if (user.password !== password) {  // This is a simple check; in production, use hashing
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If password matches
        res.status(200).json({ message: 'Login successful' });
    });
});



app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
