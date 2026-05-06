const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Ensure this points to your db.js

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    console.log("Registration request received:", req.body); 
    const { name, email, password, role_type, section_id } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 2. Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into PostgreSQL
        // Note: Using the section_id provided by the frontend
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, role_type, section_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
            [name, email, hashedPassword, role_type, section_id]
        );

        console.log("User saved successfully:", newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);

    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role_type: user.role_type },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role_type: user.role_type
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;