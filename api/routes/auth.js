const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../prisma/client");
const { authenticate } = require('../auth-middleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secrete_key';

router.get("/welcome", authenticate, (req, res) => {
    res.json({ msg: "welcome" });
})

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already Taken. Try to Sign in" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role_id: 3,
            }
        });
        res.status(201).json({ message: "User Created Successfully", data: newUser })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalide email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid Password. Try again." })
        }
        const token = jwt.sign({ userId: user.id, role_id: user.role_id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login Successful', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
