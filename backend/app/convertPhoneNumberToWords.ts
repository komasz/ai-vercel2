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
  
  export function convertPhoneNumberToWords(phoneNumber: string) {
    return phoneNumber
      .split('')
      .map((char: string) => digitToWord[char as keyof typeof digitToWord] || char)
      .join(' ');
  }