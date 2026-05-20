const db = require('../config/db');

const getAllCars = async (req, res) => {
    try {
        const { fuel_type, branch_id, category_id, status, search, sort } = req.query;

        let sql = `
            SELECT c.*, b.city AS branch_city, b.name AS branch_name, cat.category_name 
            FROM cars c
            LEFT JOIN branches b ON c.branch_id = b.id
            LEFT JOIN categories cat ON c.category_id = cat.id
            WHERE 1=1
        `;
        
        const queryParams = [];

        if (fuel_type) {
            sql += " AND c.fuel_type = ?";
            queryParams.push(fuel_type);
        }
        // Sayı kontrolünü ve eşleşmeyi sağlama alıyoruz
        if (branch_id && !isNaN(branch_id)) {
            sql += " AND c.branch_id = ?";
            queryParams.push(parseInt(branch_id));
        }
        if (category_id && !isNaN(category_id)) {
            sql += " AND c.category_id = ?";
            queryParams.push(parseInt(category_id));
        }
        if (status) {
            sql += " AND c.status = ?";
            queryParams.push(status);
        }
        if (search) {
            sql += " AND (c.brand LIKE ? OR c.model LIKE ?)";
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Sıralama Koşulları
        if (sort) {
            switch (sort) {
                case 'price_asc':  sql += " ORDER BY c.price_per_day ASC"; break;
                case 'price_desc': sql += " ORDER BY c.price_per_day DESC"; break;
                case 'km_asc':     sql += " ORDER BY c.km ASC"; break;
                case 'km_desc':    sql += " ORDER BY c.km DESC"; break;
                case 'year_desc':  sql += " ORDER BY c.year DESC"; break;
                case 'year_asc':   sql += " ORDER BY c.year ASC"; break;
                default:           sql += " ORDER BY c.id DESC";
            }
        } else {
            sql += " ORDER BY c.id DESC";
        }

        const [rows] = await db.query(sql, queryParams);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. KRİTİK EKSİK: ID'ye Göre Tek Bir Araç Getirme (Hatanın Çözümü)
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT c.*, b.city AS branch_city, b.name AS branch_name, cat.category_name 
             FROM cars c
             LEFT JOIN branches b ON c.branch_id = b.id
             LEFT JOIN categories cat ON c.category_id = cat.id
             WHERE c.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Yeni Araç Ekleme
const createCar = async (req, res) => {
    try {
        const { category_id, branch_id, brand, model, year, price_per_day, fuel_type, km } = req.body;
        const [result] = await db.query(
            `INSERT INTO cars (category_id, branch_id, brand, model, year, price_per_day, fuel_type, km) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [category_id, branch_id, brand, model, year, price_per_day, fuel_type, km]
        );
        res.status(201).json({ id: result.insertId, message: 'Car created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        // HÜNKARIM, KONTROL NOKTASI 1: status verisi gelen istekten eksiksiz yakalanıyor
        const { category_id, branch_id, brand, model, year, price_per_day, fuel_type, km, status } = req.body;

        // KONTROL NOKTASI 2: SQL sorgusuna status = ? eklendi ve diziye paslandı
        const [result] = await db.query(
            `UPDATE cars 
             SET category_id = ?, branch_id = ?, brand = ?, model = ?, year = ?, price_per_day = ?, fuel_type = ?, km = ?, status = ? 
             WHERE id = ?`,
            [category_id, branch_id, brand, model, year, price_per_day, fuel_type, km, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Güncellenen veriyi anında frontend'e taze isimleriyle fırlatıyoruz
        const [updatedCar] = await db.query(
            `SELECT c.*, b.city AS branch_city, b.name AS branch_name, cat.category_name 
             FROM cars c
             LEFT JOIN branches b ON c.branch_id = b.id
             LEFT JOIN categories cat ON c.category_id = cat.id
             WHERE c.id = ?`,
            [id]
        );

        res.status(200).json(updatedCar[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Araç Silme
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM cars WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tüm fonksiyonları rota dosyasının (carRoutes.js) eksiksiz tanıyacağı şekilde dışarı aktarıyoruz
module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};