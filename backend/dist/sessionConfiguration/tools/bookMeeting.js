"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookMeetingTool = void 0;
const types_1 = require("../../types");
exports.bookMeetingTool = {
    type: 'function',
    name: types_1.ToolFunctionName.BookMeeting,
    description: 'Finalizuje proces rezerwacji wizyty na zabieg depilacji.',
    parameters: {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
                description: 'Imię klienta',
            },
            lastName: {
                type: 'string',
                description: 'Nazwisko klienta',
            },
            meetingDate: {
                type: 'string',
                description: 'Data spotkania (format ISO)',
            },
            typZabiegu: {
                type: 'string',
                description: 'Rodzaj zabiegu depilacji',
            },
            phone: {
                type: 'string',
                description: 'Numer telefonu klienta. Musi składać się **dokładnie** z 9 cyfr, bez spacji ani znaków specjalnych.',
                pattern: '^[0-9]{9}$',
            },
            email: {
                type: 'string',
                description: 'Adres email klienta. Musi być w poprawnym formacie (np. użytkownik@domena.com).',
                pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/gm',
            },
        },
        required: [
            'firstName',
            'lastName',
            'meetingDate',
            'typZabiegu',
            'phone',
            'email',
        ],
    },
};
