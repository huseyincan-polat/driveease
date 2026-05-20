const rentalService = require('../services/rentalService');

const getAllRentals = async (req, res) => {
    try {
        const rentals = await rentalService.getAllRentals(req.userId, req.userRole);
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createRental = async (req, res) => {
    try {
        const rentalData = { ...req.body, customer_id: req.userId };
        const rental = await rentalService.createRental(rentalData);
        res.status(201).json({ message: 'Rental successful', rental });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRentalById = async (req, res) => {
    try {
        res.status(200).json({ message: 'Get rental by ID endpoint' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const completeRental = async (req, res) => {
    try {
        res.status(200).json({ message: 'Complete rental endpoint' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelRental = async (req, res) => {
    try {
        res.status(200).json({ message: 'Cancel rental endpoint' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllRentals, createRental, getRentalById, completeRental, cancelRental };