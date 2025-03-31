import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL as string;

export const socket: Socket = io(SOCKET_URL, { autoConnect: false });