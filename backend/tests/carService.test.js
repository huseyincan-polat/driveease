const { validateCar } = require('../services/carService');

describe('carService — validateCar()', () => {

    const validCar = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        price_per_day: 150,
        category_id: 1,
        branch_id: 1,
        transmission_type: 'Automatic'
    };

    describe('Valid data', () => {
        test('should not return any errors when all fields are valid', () => {
            const errors = validateCar(validCar);
            expect(errors).toHaveLength(0);
        });

        test('should accept minimum valid year 1900', () => {
            const errors = validateCar({ ...validCar, year: 1900 });
            expect(errors).toHaveLength(0);
        });

        test('should accept maximum valid year 2026', () => {
            const errors = validateCar({ ...validCar, year: 2026 });
            expect(errors).toHaveLength(0);
        });

        test('should accept decimal price', () => {
            const errors = validateCar({ ...validCar, price_per_day: 299.99 });
            expect(errors).toHaveLength(0);
        });
    });

    describe('Brand validation', () => {
        test('should return an error when brand is an empty string', () => {
            const errors = validateCar({ ...validCar, brand: '' });
            expect(errors).toContain('Marka boş olamaz');
        });

        test('should return an error when brand contains only whitespace', () => {
            const errors = validateCar({ ...validCar, brand: '   ' });
            expect(errors).toContain('Marka boş olamaz');
        });
    });

    describe('Model validation', () => {
        test('should return an error when model is an empty string', () => {
            const errors = validateCar({ ...validCar, model: '' });
            expect(errors).toContain('Model boş olamaz');
        });
    });

    describe('Year validation', () => {
        test('should return an error for year 1899', () => {
            const errors = validateCar({ ...validCar, year: 1899 });
            expect(errors).toContain('Yıl 1900-2026 arasında olmalı');
        });

        test('should return an error for year 2027', () => {
            const errors = validateCar({ ...validCar, year: 2027 });
            expect(errors).toContain('Yıl 1900-2026 arasında olmalı');
        });
    });

    describe('Price validation', () => {
        test('should return an error for negative price', () => {
            const errors = validateCar({ ...validCar, price_per_day: -10 });
            expect(errors).toContain('Günlük fiyat pozitif bir sayı olmalı');
        });
    });

    describe('Category and Branch validation', () => {
        test('should return an error when category ID is missing', () => {
            const { category_id, ...rest } = validCar;
            const errors = validateCar(rest);
            expect(errors).toContain('Kategori ID boş olamaz');
        });

        test('should return an error when branch ID is missing', () => {
            const { branch_id, ...rest } = validCar;
            const errors = validateCar(rest);
            expect(errors).toContain('Şube ID boş olamaz');
        });
    });

    describe('Multiple error scenarios', () => {
        test('should return 6 errors when object is completely empty', () => {
            const errors = validateCar({});
            expect(errors).toHaveLength(6);
        });
    });
});