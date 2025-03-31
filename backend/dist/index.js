"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketEvents_1 = require("./socketEvents");
const nylasAuthRoute_1 = require("./routes/nylasAuthRoute");
const oauthExchangeRoute_1 = require("./routes/oauthExchangeRoute");
dotenv_1.default.config();
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: corsOrigin, methods: ['GET', 'POST']
    }
});
io.on('connection', socketEvents_1.handleSocketConnection);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/nylas/auth', nylasAuthRoute_1.nylasAuthHandler);
app.get('/oauth/exchange', oauthExchangeRoute_1.oauthExchangeHandler);
