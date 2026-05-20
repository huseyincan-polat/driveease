const db = require('../config/db');

const getAllBranches = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM branches');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addBranch = async (req, res) => {
    try {
        const { name, city } = req.body;
        const [result] = await db.query('INSERT INTO branches (name, city) VALUES (?, ?)', [name, city]);
        res.status(201).json({ id: result.insertId, name, city });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllBranches, addBranch };