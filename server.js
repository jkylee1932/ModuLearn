const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err) => {
    if (err) console.error('❌ DB ERROR:', err.message);
    else console.log(`✅ DB Status: Connected to ${process.env.DB_NAME}`);
});

// Registration Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, section_id } = req.body;
        await pool.query(
            "INSERT INTO users (name, email, password_hash, role_type, section_id) VALUES ($1, $2, $3, $4, $5)",
            [name, email, password, 'student', section_id || 1]
        );
        res.status(201).json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            if (user.password_hash === password) {
                res.status(200).json({ message: "Login successful", user: user });
            } else {
                res.status(401).json({ error: "Invalid password" });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));