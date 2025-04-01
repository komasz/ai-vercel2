"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragSearchTool = void 0;
const types_1 = require("../../types");
exports.ragSearchTool = {
    type: 'function',
    name: types_1.ToolFunctionName.RagSearch,
    description: 'Główne źródło wiedzy o depilacji. Używaj tej funkcji zawsze, gdy użytkownik zadaje pytania dotyczące metod, skuteczności, pielęgnacji, zaleceń po zabiegu lub innych szczegółów dotyczących depilacji.',
    parameters: {
        type: 'object',
        properties: {
            pytanie: {
                type: 'string',
                description: 'Dokładne zapytanie użytkownika, które zostanie użyte do przeszukania bazy wiedzy o depilacji.',
            },
        },
    },
};
