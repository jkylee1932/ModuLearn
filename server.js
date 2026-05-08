const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('❌ DB ERROR:', err.message);
    } else {
        console.log(`✅ DB Status: Connected to ${process.env.DB_NAME}`);
    }
});

// Auth (Login/Register) 
app.use('/api/auth', authRoutes);

// API: Get All Modules
app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM modules ORDER BY id DESC');
        res.json({ modules: result.rows });
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: "Failed to fetch modules" });
    }
});

// API: Publish Module
app.post('/publish', async (req, res) => {
    const { title, video_url, content } = req.body;
    try {
        await pool.query(
            'INSERT INTO modules (title, video_url, content) VALUES ($1, $2, $3)',
            [title, video_url, content]
        );
        res.redirect('/dashboard.html');
    } catch (err) {
        console.error("Publish Error:", err.message);
        res.status(500).send("Error publishing module. Make sure your database table 'modules' exists.");
    }
});

// API: Delete Module
app.delete('/api/delete-module/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM modules WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ success: true, message: "Deleted" });
        } else {
            res.status(404).json({ success: false, message: "Module not found" });
        }
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// API: Get Module by ID
app.get('/api/module/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM modules WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Module not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Single Module Fetch Error:", err.message);
        res.status(500).json({ error: "Failed to fetch module details" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 ModuLearn Server is ACTIVE`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
});
