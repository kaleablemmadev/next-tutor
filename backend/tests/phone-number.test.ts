import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalizeEthiopianPhoneNumber } from "../src/utils/phone-number.js";

describe('normalizeEthiopianPhoneNumber', () => {
    describe('valid phone numbers', () => {
        const validNumbers = [
            '0912345678',
            '+251912345678',
            '09 123 456 78',
            '+251 912 345 678',
            '09-123-456-78',
            '+251-912-345-678',
        ];

        validNumbers.forEach((number) => {
            it(`should normalize ${number} to +251912345678`, () => {
                assert.equal(normalizeEthiopianPhoneNumber(number), '+251912345678');
            })
        });
    })

    describe('invalid phone numbers', () => {
        const invalidNumbers = [
            '091234567',
            '09123456789',
            '+251812345678',
            '+12025550123',
            '912345678',
            '251912345678',
            '0-9-1-2-3-4-5-6-7-8',
            '09/123/456/78',
            '09ABC45678',
            '',
        ];

        invalidNumbers.forEach((number) => {
            it(`should throw an error for ${number}`, () => {
                assert.throws(() => normalizeEthiopianPhoneNumber(number), Error);
            })
        });
    })
});