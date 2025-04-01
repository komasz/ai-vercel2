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
exports.createOpenAiWebSocket = createOpenAiWebSocket;
const ws_1 = __importDefault(require("ws"));
const types_1 = require("./types");
const config_1 = require("./sessionConfiguration/config");
const pinecone_1 = require("@pinecone-database/pinecone");
const openai_1 = __importDefault(require("openai"));
const types_2 = require("./types");
const checkAvailability_1 = require("./checkAvailability");
const ragSearch_1 = require("./ragSearch");
const meetingHandler_1 = require("./libs/nylas/meetingHandler");
const salonSearch_1 = require("./salonSearch");
const convertPhoneNumberToWords_1 = require("./convertPhoneNumberToWords");
/**
 * @function createOpenAiWebSocket
 * @description This function establishes a WebSocket connection to the OpenAI Realtime API, enabling real-time communication between the client and the AI.
 *              It handles various types of messages and events, facilitating a two-step booking process and other interactions.
 *
 *              Key functionalities include:
 *              - Establishing a WebSocket connection and sending initial session configuration.
 *              - Handling different message types from the OpenAI API, such as audio transcription completion, speech start, content part completion, and function call arguments.
 *              - Implementing a two-step booking flow:
 *                1. When booking data is received, it is stored, and a confirmation request is sent to the AI.
 *                2. Upon user confirmation, the booking is finalized by sending a request to Nylas, with the result communicated back to the AI.
 *              - Emitting events to the client socket based on message types, such as audio input transcription, speech start, text transcript, and audio response.
 *              - Handling errors and unknown function calls gracefully, ensuring robust communication.
 *
 * @param {Socket} socket - The client's socket connection.
 * @returns {WebSocket} - Returns the open WebSocket connection as `openAiWs`.
 */
function createOpenAiWebSocket(socket) {
    const pc = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    const openAiWs = new ws_1.default('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview', {
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1',
        },
    });
    openAiWs.on('open', () => {
        console.log('Connected to OpenAI Realtime API');
        openAiWs.send(JSON.stringify(config_1.sessionUpdate));
    });
    openAiWs.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = JSON.parse(data);
        // console.log(message) //For debugging
        if (message.type ===
            types_1.OpenAIMessageEventType.ConversationItemInputAudioTranscriptionCompleted &&
            message.transcript) {
            console.log('USER (audio transcription completed):', message.transcript);
            socket.emit('audioInputTranscript', message);
        }
        if (message.type === types_1.OpenAIMessageEventType.InputAudioBufferSpeechStarted) {
            console.log('USER (speech started) transcript:', message.event_id);
            socket.emit('speechStarted', message.event_id);
        }
        if (message.type === types_1.OpenAIMessageEventType.ResponseContentPartDone &&
            message.part) {
            console.log('Wojtek AI (content_part.done):', message.part.transcript);
            socket.emit('textTranscript', message);
        }
        if (message.type === types_1.OpenAIMessageEventType.ResponseAudioDelta &&
            message.delta) {
            console.log('Wojtek AI (audio delta) - response_id:', message.response_id);
            socket.emit('audioResponse', message);
        }
        if (message.type === types_1.OpenAIMessageEventType.ResponseFunctionCallArgumentsDone) {
            console.log('Received function call:', message);
            const parsedArgs = JSON.parse(message.arguments || '{}');
            const functionName = (message === null || message === void 0 ? void 0 : message.name) || '';
            console.log(`Received function call arguments for function [${functionName}]:`, parsedArgs);
            switch (functionName) {
                case types_2.ToolFunctionName.CheckAvailability: {
                    yield (0, checkAvailability_1.handleCheckAvailability)(message, parsedArgs, openAiWs);
                    return;
                }
                case types_2.ToolFunctionName.RagSearch: {
                    yield (0, ragSearch_1.handleRagSearch)(message, parsedArgs, openAiWs, openai, pc);
                    return;
                }
                case types_2.ToolFunctionName.SalonSearch: {
                    yield (0, salonSearch_1.handleSalonSearch)(message, parsedArgs, openAiWs);
                    return;
                }
                case types_2.ToolFunctionName.ValidateMeetingDetails: {
                    console.log('Received booking details, awaiting confirmation for:', parsedArgs.firstName, parsedArgs.lastName);
                    const objectAppend = {
                        type: 'response.create',
                        response: {
                            instructions: 'Napisz uzytkownikowi dokładnie taką wiadomość: Poniżej wyświetlił się formularz. Proszę sprawdź, czy wszystkie dane są poprawne, a następnie potwierdź wizytę.',
                        },
                    };
                    openAiWs.send(JSON.stringify(objectAppend));
                    socket.emit('confirmationMessage', parsedArgs);
                    return;
                }
                case types_2.ToolFunctionName.BookMeeting: {
                    const result = yield (0, meetingHandler_1.handleBookMeeting)(parsedArgs, message, socket);
                    openAiWs.send(JSON.stringify(result));
                    return;
                }
                case types_2.ToolFunctionName.PhoneNumber: {
                    const phoneNumber = parsedArgs.phone_number;
                    console.log("PHONE NUMBER", phoneNumber);
                    const outputSuccess = {
                        type: 'conversation.item.create',
                        item: {
                            type: 'function_call_output',
                            call_id: message.call_id,
                            output: JSON.stringify({
                                phone_number: (0, convertPhoneNumberToWords_1.convertPhoneNumberToWords)(phoneNumber),
                                success: true
                            }),
                        },
                    };
                    openAiWs.send(JSON.stringify(outputSuccess));
                    return;
                }
                default: {
                    console.error('Unknown function call:', functionName);
                    break;
                }
            }
        }
        if (message.type === types_1.OpenAIMessageEventType.ConversationItemCreated &&
            ((_a = message.item) === null || _a === void 0 ? void 0 : _a.type) === 'function_call_output' &&
            message.item.output &&
            JSON.parse(message.item.output).success) {
            const objectAppend = {
                type: 'response.create',
            };
            openAiWs.send(JSON.stringify(objectAppend));
        }
        if (message.type === types_1.OpenAIMessageEventType.ConversationItemCreated &&
            ((_b = message.item) === null || _b === void 0 ? void 0 : _b.type) === 'function_call_output' &&
            JSON.parse(message.item.output).error) {
            const objectAppend = {
                type: 'response.create',
                response: {
                    instructions: 'Niestety wystąpił błąd, poinformuj uźytkownika o błędzie i poproś aby spróbował ponownie',
                },
            };
            openAiWs.send(JSON.stringify(objectAppend));
        }
        if (message.type === types_1.OpenAIMessageEventType.ConversationItemCreated &&
            ((_c = message.item) === null || _c === void 0 ? void 0 : _c.type) === 'message' &&
            ((_d = message.item) === null || _d === void 0 ? void 0 : _d.status) === 'completed' &&
            ((_e = message.item) === null || _e === void 0 ? void 0 : _e.role) === 'user' &&
            ((_g = (_f = message.item) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.some(part => part.type === 'input_text'))) {
            console.log('USER (message completed):', message.item.content);
            const objectAppend = {
                type: 'response.create',
            };
            openAiWs.send(JSON.stringify(objectAppend));
        }
        if (((_h = message.response) === null || _h === void 0 ? void 0 : _h.status_details) &&
            message.response.status_details.error) {
            socket.emit('error', message.response.status_details.error);
            console.error('OpenAI status_details:', message.response.status_details);
        }
    }));
    openAiWs.on('close', () => {
        console.log('Disconnected from OpenAI Realtime API');
    });
    openAiWs.on('error', (error) => {
        console.error('OpenAI WebSocket error:', error);
    });
    return { openAiWs };
}
