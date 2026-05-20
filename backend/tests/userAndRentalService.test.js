const { validateRegister } = require('../services/userService');
const { getAllRentals } = require('../services/rentalService');

describe('userService — Password Validation', () => {
    test('should return an error when password length is less than 6 characters', () => {
        const invalidUser = {
            name: 'Huseyin Can Polat',
            email: 'huseyincan@example.com',
            password: '123'
        };
        const errors = validateRegister(invalidUser);
        expect(errors).toContain('Password must be at least 6 characters');
    });
});

describe('rentalService — Component Integration', () => {
    test('should ensure getAllRentals function is correctly defined', () => {
        expect(getAllRentals).toBeDefined();
    });
});