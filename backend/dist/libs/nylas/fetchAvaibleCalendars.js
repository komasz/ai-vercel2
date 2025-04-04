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
require("dotenv/config");
const nylasClient_1 = require("./nylasClient");
function fetchFiveAvailableCalendars() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const calendars = yield nylasClient_1.nylas.calendars.list({
                identifier: process.env.NYLAS_GRANT_ID,
                limit: 5,
            });
            console.log('Available Calendars:', calendars);
        }
        catch (error) {
            console.error('Error fetching calendars:', error);
        }
    });
}
fetchFiveAvailableCalendars();
