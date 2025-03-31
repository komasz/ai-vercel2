"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneNumberTool = void 0;
const types_1 = require("../../types");
exports.phoneNumberTool = {
    type: 'function',
    name: types_1.ToolFunctionName.PhoneNumber,
    description: 'Zawsze korzystaj z tego narzędzia jeśli wykryjesz numer telefonu. To narzędzie konwertuje numery telefonów na odpowiadające im słowne reprezentacje w języku polskim. Jego głównym celem jest zwiększenie poprawności powtarzania i rozumienia numerów. Narzędzie obsługuje różne formaty numerów i przekształca je na formę słowną',
    parameters: {
        type: 'object',
        properties: {
            phone_number: {
                type: 'string',
                description: 'Numer telefonu.',
            },
        },
    },
};
