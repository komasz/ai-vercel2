"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salonSearchTool = void 0;
const types_1 = require("../../types");
exports.salonSearchTool = {
    type: 'function',
    name: types_1.ToolFunctionName.SalonSearch,
    description: 'Główne źródło wiedzy o salonach depilacji. Używaj tej funkcji zawsze, gdy użytkownik zadaje pytania dotyczące lokalizacji salonów depilacji oraz godzin, dni ich otwarcia.',
    parameters: {
        type: 'object',
        properties: {
            pytanie: {
                type: 'string',
                description: 'Dokładne zapytanie użytkownika, które zostanie użyte do przeszukania bazy wiedzy o salonach depilacji.',
            },
        },
    },
};
