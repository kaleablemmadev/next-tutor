const ETHIOPIAN_LOCAL_PHONE_REGEX = /^09(?:[ -]?\d{3})(?:[ -]?\d{3})(?:[ -]?\d{2})$/;
const ETHIOPIAN_INTERNATIONAL_PHONE_REGEX = /^\+251(?:[ -]?9\d{2})(?:[ -]?\d{3})(?:[ -]?\d{3})$/;

export function normalizeEthiopianPhoneNumber(phoneNumber: string): string {
    const cleanedPhoneNumber = phoneNumber.replace(/[ -]/g, '');

    if (ETHIOPIAN_LOCAL_PHONE_REGEX.test(phoneNumber)) {
        return `+251${cleanedPhoneNumber.slice(1)}`;
    }

    if (ETHIOPIAN_INTERNATIONAL_PHONE_REGEX.test(phoneNumber)) {
        return cleanedPhoneNumber;
    }

    throw new Error('Invalid Ethiopian mobile phone number.');
}