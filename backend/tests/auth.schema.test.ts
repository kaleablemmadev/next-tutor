import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { registerSchema } from '../src/schemas/auth.schema.js';

describe('registerSchema', () => {
    describe('valid input', () => {
        it('should pass validation for valid input', () => {
            const validInput = {
                userName: 'testuser',
                fullName: 'Test User',
                email: 'Vx9hC@example.com',
                phoneNumber: '09-123-456-78',
                password: 'password123',
                confirmPassword: 'password123',
                gender: 'MALE',
                educationStatus: 'NONGRADUATE'
            };

            const result = registerSchema.safeParse(validInput);
            assert.ok(result.success);

            if (result.success) {
                assert.equal(result.data.phoneNumber, '+251912345678');
            }
        });
    });

    describe('invalid input', () => {
        it('should fail validation for invalid input', () => {
            const invalidInput = {
                userName: 'tu',
                fullName: 'Te',
                email: 'invalid-email',
                phoneNumber: '12345',
                password: 'pass',
                confirmPassword: 'differentpass',
                gender: 'INVALID_GENDER',
                educationStatus: 'INVALID_EDUCATION_STATUS'
            };

            const result = registerSchema.safeParse(invalidInput);
            assert.ok(!result.success);
        });
    });
});