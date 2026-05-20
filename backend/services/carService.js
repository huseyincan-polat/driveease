const db = require('../config/db');

/**
 * Validates car input data.
 * Returns an array of error strings (empty if valid).
 */
const validateCar = (data) => {
    const errors = [];
    if (!data.brand || String(data.brand).trim() === '')
        errors.push('Marka boş olamaz');
    if (!data.model || String(data.model).trim() === '')
        errors.push('Model boş olamaz');

    const year = Number(data.year);
    if (!data.year || isNaN(year) || year < 1900 || year > 2026)
        errors.push('Yıl 1900-2026 arasında olmalı');

    const price = Number(data.price_per_day);
    if (!data.price_per_day || isNaN(price) || price <= 0)
        errors.push('Günlük fiyat pozitif bir sayı olmalı');

    // Validate the new transmission_type field
    //if (!data.transmission_type || String(data.transmission_type).trim() === '')
      //  errors.push('Vites türü (transmission_type) boş olamaz');

    if (!data.category_id) errors.push('Kategori ID boş olamaz');
    if (!data.branch_id) errors.push('Şube ID boş olamaz');

    return errors;
};

const fetchAllCars = async (search = '') => {
    if (search && search.trim() !== '') {
        const [rows] = await db.execute(
            'SELECT * FROM cars WHERE brand LIKE ? OR model LIKE ? ORDER BY id DESC',
            [`%${search}%`, `%${search}%`]
        );
        return rows;
    }
    // SELECT * automatically fetches the new transmission_type column
    const [rows] = await db.execute('SELECT * FROM cars ORDER BY id DESC');
    return rows;
};

const fetchCarById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [id]);
    return rows[0] || null;
};

const addCar = async (data) => {
    const errors = validateCar(data);
    if (errors.length > 0) throw new Error(errors.join(', '));

    // Extract all required fields to match the database and Swagger schema
    const { category_id, branch_id, brand, model, year, price_per_day, fuel_type, transmission_type, km, status } = data;
    
    // Insert ALL fields into the database
    const [result] = await db.execute(
        'INSERT INTO cars (category_id, branch_id, brand, model, year, price_per_day, fuel_type, transmission_type, km, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [category_id, branch_id, brand.trim(), model.trim(), Number(year), Number(price_per_day), fuel_type || 'Gasoline', transmission_type.trim(), km || 0, status || 'available']
    );
    
    return { id: result.insertId, ...data };
};

const updateCar = async (id, data) => {
    const errors = validateCar(data);
    if (errors.length > 0) throw new Error(errors.join(', '));

    const existing = await fetchCarById(id);
    if (!existing) throw new Error('Araç bulunamadı');

    // Extract all required fields
    const { category_id, branch_id, brand, model, year, price_per_day, fuel_type, transmission_type, km, status } = data;
    
    // Update ALL fields in the database
    await db.execute(
        'UPDATE cars SET category_id = ?, branch_id = ?, brand = ?, model = ?, year = ?, price_per_day = ?, fuel_type = ?, transmission_type = ?, km = ?, status = ? WHERE id = ?',
        [category_id, branch_id, brand.trim(), model.trim(), Number(year), Number(price_per_day), fuel_type, transmission_type.trim(), km, status, id]
    );
    
    return { id: Number(id), ...data };
};

const deleteCar = async (id) => {
    const existing = await fetchCarById(id);
    if (!existing) throw new Error('Araç bulunamadı');
    await db.execute('DELETE FROM cars WHERE id = ?', [id]);
    return { message: 'Araç başarıyla silindi' };
};

module.exports = { validateCar, fetchAllCars, fetchCarById, addCar, updateCar, deleteCar };