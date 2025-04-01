"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPhoneNumberToWords = convertPhoneNumberToWords;
const digitToWord = {
    '0': 'zero',
    '1': 'jeden',
    '2': 'dwa',
    '3': 'trzy',
    '4': 'cztery',
    '5': 'pięć',
    '6': 'sześć',
    '7': 'siedem',
    '8': 'osiem',
    '9': 'dziewięć'
};
function convertPhoneNumberToWords(phoneNumber) {
    return phoneNumber
        .split('')
        .map((char) => digitToWord[char] || char)
        .join(' ');
}
