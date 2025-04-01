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
exports.oauthExchangeHandler = void 0;
const nylasAuth_1 = require("../libs/nylas/nylasAuth");
const oauthExchangeHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    if (typeof code !== 'string') {
        res.status(400).send('No authorization code returned from Nylas');
        return;
    }
    try {
        const response = yield (0, nylasAuth_1.exchangeCodeForToken)(code);
        const { grantId } = response;
        console.log('Grant ID', grantId);
        res.status(200);
    }
    catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Failed to exchange authorization code for token');
    }
});
exports.oauthExchangeHandler = oauthExchangeHandler;
