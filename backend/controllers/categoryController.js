const db = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const [result] = await db.query('INSERT INTO categories (category_name) VALUES (?)', [category_name]);
        res.status(201).json({ id: result.insertId, category_name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllCategories, addCategory };