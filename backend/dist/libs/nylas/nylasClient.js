"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nylas = exports.nylasConfig = void 0;
const nylas_1 = __importDefault(require("nylas"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Nylas with your client ID and secret (ensure these are set in your environment)
exports.nylasConfig = {
    clientId: process.env.NYLAS_CLIENT_ID,
    callbackUri: 'http://localhost:3001/oauth/exchange',
    apiKey: process.env.NYLAS_API_KEY,
    apiUri: process.env.NYLAS_API_URI,
    grantId: process.env.NYLAS_GRANT_ID,
};
exports.nylas = new nylas_1.default(exports.nylasConfig);
