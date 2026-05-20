const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRegister = (userData) => {
    const errors = [];
    if (!userData.name || userData.name.trim() === '') {
        errors.push('Name is required');
    }
    if (!userData.email || userData.email.trim() === '') {
        errors.push('Email is required');
    }
    if (!userData.password || userData.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    return errors;
};

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'customer';
    
    const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, userRole]
    );
    return { id: result.insertId, name, email, role: userRole };
};

const loginUser = async (email, password) => {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) throw new Error('User not found');

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Invalid password');

    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'mysecretkey', 
        { expiresIn: '24h' }
    );
    
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { registerUser, loginUser, validateRegister };