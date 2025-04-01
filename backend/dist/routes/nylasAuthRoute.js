"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nylasAuthHandler = void 0;
const nylasAuth_1 = require("../libs/nylas/nylasAuth");
const nylasAuthHandler = (req, res) => {
    const email = typeof req.query.email !== 'string'
        ? 'chatai@performance-media.pl'
        : req.query.email;
    const authUrl = (0, nylasAuth_1.getAuthUrl)(email);
    res.redirect(authUrl);
};
exports.nylasAuthHandler = nylasAuthHandler;
