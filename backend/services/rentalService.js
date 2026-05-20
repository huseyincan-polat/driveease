const db = require('../config/db');

const createRental = async (rentalData) => {
    const { car_id, customer_id, pickup_branch_id, return_branch_id, start_date, end_date } = rentalData;
    
    // Calculate total days
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) throw new Error('End date must be after start date');

    // Fetch car daily price
    const [cars] = await db.query('SELECT price_per_day FROM cars WHERE id = ?', [car_id]);
    if (cars.length === 0) throw new Error('Car not found');
    
    const totalPrice = days * cars[0].price_per_day;

    // Insert rental record
    const [result] = await db.query(
        'INSERT INTO rentals (car_id, customer_id, pickup_branch_id, return_branch_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [car_id, customer_id, pickup_branch_id, return_branch_id, start_date, end_date, totalPrice]
    );

    // Update car status to 'rented' and move it to the return branch
    await db.query(
        'UPDATE cars SET status = ?, branch_id = ? WHERE id = ?', 
        ['rented', return_branch_id, car_id]
    );

    return { id: result.insertId, totalPrice, days };
};

const getAllRentals = async (userId, userRole) => {
    let query, params;

    if (userRole === 'admin') {
        // Admin tüm kiralamaları görür
        query = `
            SELECT r.*, c.brand, c.model, u.name AS customer_name 
            FROM rentals r
            JOIN cars c ON r.car_id = c.id
            JOIN users u ON r.customer_id = u.id
            ORDER BY r.created_at DESC
        `;
        params = [];
    } else {
        // Customer sadece kendi kiralıklarını görür
        query = `
            SELECT r.*, c.brand, c.model, u.name AS customer_name 
            FROM rentals r
            JOIN cars c ON r.car_id = c.id
            JOIN users u ON r.customer_id = u.id
            WHERE r.customer_id = ?
            ORDER BY r.created_at DESC
        `;
        params = [userId];
    }

    const [rows] = await db.query(query, params);
    return rows;
};

module.exports = { createRental, getAllRentals };