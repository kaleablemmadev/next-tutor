import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { loginSchema } from '../src/schemas/auth.schema.js';

describe('loginSchema', () => {
    it('should normalize a local phone number', () => {
        const result = loginSchema.safeParse({
            identifier: '0912345678',
            password: 'password123'
        });

        assert.ok(result.success);

        if (result.success) {
            assert.equal(result.data.identifier, '+251912345678');
        }
    });

    it('should preserve a username', () => {
        const result = loginSchema.safeParse({
            identifier: 'testuser',
            password: 'password123'
        });

        assert.ok(result.success);

        if (result.success) {
            assert.equal(result.data?.identifier, 'testuser');
        }
    });

    it('should preserve an email address', () => {
        const result = loginSchema.safeParse({
            identifier: 'test@example.com',
            password: 'password123'
        });

        assert.ok(result.success);

        if (result.success) {
            assert.equal(result.data?.identifier, 'test@example.com');
        }
    });
});
