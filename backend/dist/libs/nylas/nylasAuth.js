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
exports.getAuthUrl = getAuthUrl;
exports.exchangeCodeForToken = exchangeCodeForToken;
const nylasClient_1 = require("./nylasClient");
function getAuthUrl(email) {
    return nylasClient_1.nylas.auth.urlForOAuth2({
        clientId: nylasClient_1.nylasConfig.clientId,
        provider: 'google',
        redirectUri: nylasClient_1.nylasConfig.callbackUri,
        loginHint: email,
        accessType: 'offline',
    });
}
function exchangeCodeForToken(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield nylasClient_1.nylas.auth.exchangeCodeForToken({
            clientId: nylasClient_1.nylasConfig.clientId,
            redirectUri: nylasClient_1.nylasConfig.callbackUri,
            code,
        });
    });
}
