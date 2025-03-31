import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketConnection } from './socketEvents';
import { nylasAuthHandler } from './routes/nylasAuthRoute';
import { oauthExchangeHandler } from './routes/oauthExchangeRoute';

dotenv.config();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: corsOrigin, methods: ['GET', 'POST'] 
  }
});
io.on('connection', handleSocketConnection);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/nylas/auth', nylasAuthHandler);

app.get('/oauth/exchange', oauthExchangeHandler);