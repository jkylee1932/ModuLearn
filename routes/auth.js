const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    console.log("Registration request received:", req.body); 
    const { name, email, password, role_type, section_id } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role_type, section_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
            [name, email, hashedPassword, role_type, section_id]
        );

        console.log("User saved successfully:", newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);

    } catch (err) {
        console.error("Database Error (Register):", err.message);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            console.log("Login failed: User not found");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = userResult.rows[0];

        // I-compare ang password sa database (column: password)
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.log("Login failed: Password mismatch");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Siguraduhing may fallback kung walang JWT_SECRET sa Render
        const secret = process.env.JWT_SECRET || 'modulearn_super_secret_key';

        const token = jwt.sign(
            { id: user.id, role_type: user.role_type },
            secret,
            { expiresIn: '1d' }
        );

        console.log("Login successful for:", user.name);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role_type: user.role_type
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
