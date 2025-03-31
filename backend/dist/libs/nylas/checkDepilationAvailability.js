"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDepilationAvailability = checkDepilationAvailability;
const nylasClient_1 = require("./nylasClient");
function checkDepilationAvailability(meetingDate_1) {
    return __awaiter(this, arguments, void 0, function* (meetingDate, duration = 60) {
        const startDate = new Date(meetingDate);
        if (isNaN(startDate.getTime())) {
            throw new Error('Niepoprawny format daty spotkania');
        }
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
        try {
            const events = yield nylasClient_1.nylas.events.list({
                identifier: process.env.NYLAS_GRANT_ID,
                queryParams: {
                    calendarId: process.env.NYLAS_CALENDAR_ID || 'primary',
                    start: Math.floor(startDate.getTime() / 1000).toString(),
                    end: Math.floor(endDate.getTime() / 1000).toString(),
                },
            });
            if (events.data && Array.isArray(events.data) && events.data.length > 0) {
                return { available: false, conflicts: events.data };
            }
            else {
                return { available: true };
            }
        }
        catch (error) {
            console.error('Błąd podczas pobierania wydarzeń z Nylas:', error);
            throw error;
        }
    });
}
