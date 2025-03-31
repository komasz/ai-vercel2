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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = handleSocketConnection;
const websocket_1 = require("./websocket");
const ws_1 = __importDefault(require("ws"));
const bookMeeting_1 = require("./sessionConfiguration/tools/bookMeeting");
/**
 * @function handleSocketConnection
 * @description Handles user connection events via Socket.io.
 *              - Listens for audio and text inputs, and relays them to the OpenAI realtime API.
 *              - Manages the cancellation (stop) of responses if requested.
 *              - Closes the OpenAI WebSocket upon user disconnection.
 *
 * @param {Socket} socket - The client socket connection.
 */
function handleSocketConnection(socket) {
    console.log('User connected');
    const { openAiWs } = (0, websocket_1.createOpenAiWebSocket)(socket);
    // Forward incoming audio data to OpenAI after converting the data from base64 encoding.
    socket.on('audioInput', (audioData) => {
        if (openAiWs.readyState === ws_1.default.OPEN) {
            const audioAppend = {
                type: 'input_audio_buffer.append',
                audio: Buffer.from(audioData, 'base64').toString('base64'),
            };
            openAiWs.send(JSON.stringify(audioAppend));
        }
        else {
            console.error('WebSocket is not open. Cannot send audio data.');
        }
    });
    // Send text input from the user to the conversation item handler.
    socket.on('textInput', (text) => {
        if (openAiWs.readyState === ws_1.default.OPEN) {
            const textAppend = {
                type: 'conversation.item.create',
                item: {
                    type: 'message',
                    role: 'user',
                    status: 'completed',
                    content: [
                        {
                            type: 'input_text',
                            text: text,
                        },
                    ],
                },
            };
            openAiWs.send(JSON.stringify(textAppend));
        }
        else {
            console.error('WebSocket is not open. Cannot send text data.');
        }
    });
    // Confirm data for bookMeeting.
    socket.on('confirmData', (parsedArgs) => __awaiter(this, void 0, void 0, function* () {
        if (openAiWs.readyState === ws_1.default.OPEN) {
            console.log('wyslane', parsedArgs);
            const objectAppend = {
                type: 'response.create',
                response: {
                    instructions: `Wywołaj funckje bookMeeting z tymi danymi: ${JSON.stringify(parsedArgs)}`,
                    tools: [bookMeeting_1.bookMeetingTool],
                    tool_choice: 'required',
                    temperature: 1.2,
                },
            };
            openAiWs.send(JSON.stringify(objectAppend));
        }
        else {
            console.error('WebSocket is not open. Cannot confirm Data.');
        }
    }));
    // Stop any ongoing response by sending a cancel command.
    socket.on('stop', (responseId) => {
        if (openAiWs.readyState === ws_1.default.OPEN) {
            const cancelEvent = {
                type: 'response.cancel',
                response_id: responseId,
            };
            openAiWs.send(JSON.stringify(cancelEvent));
        }
        else {
            console.error('WebSocket is not open. Cannot cancel respone.');
        }
    });
    // On disconnect, ensure that the connection to OpenAI is closed.
    socket.on('disconnect', () => {
        console.log('User disconnected');
        openAiWs.close();
    });
}
