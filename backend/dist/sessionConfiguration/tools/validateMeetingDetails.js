"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMeetingDetailsTool = void 0;
const types_1 = require("../../types");
exports.validateMeetingDetailsTool = {
    type: 'function',
    name: types_1.ToolFunctionName.ValidateMeetingDetails,
    description: 'Wstępna walidacja danych przed finalnym potwierdzeniem rezerwacji. Jeśli użytkownik podał błędne dane (np. niepoprawny numer telefonu, email), poproś go o poprawienie. **Jeśli AI wielokrotnie nie rozumie podawanych danych, zaproponuj użytkownikowi skorzystanie z formularza do ich ręcznej edycji.** Po przejściu tej walidacji użytkownik musi jeszcze potwierdzić wizytę poprzez istniejący formularz końcowy.',
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
                description: 'Data i godzina spotkania (format ISO)',
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
                description: 'Adres email klienta. Musi być w poprawnym formacie (np. użytkownik@domena.com). AI zawsze powtarza email użytkownikowi i pyta o potwierdzenie poprawności. **Nie poprawiaj literówek automatycznie – zamiast tego pozwól użytkownikowi na edycję w formularzu końcowym.**"',
                pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/gm',
            },
            "isPreValidationPassed": {
                "type": "boolean",
                "description": "Flaga oznaczająca, że wstępna walidacja została zakończona pomyślnie. **Po przejściu tej walidacji użytkownik musi jeszcze potwierdzić wizytę w istniejącym formularzu końcowym.**",
                "default": false
            }
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
