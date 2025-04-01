"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionUpdate = void 0;
const ragSearch_1 = require("./tools/ragSearch");
const validateMeetingDetails_1 = require("./tools/validateMeetingDetails");
const checkAvailability_1 = require("./tools/checkAvailability");
const phoneNumber_1 = require("./tools/phoneNumber");
const instructions_1 = require("./instructions");
const salonSearch_1 = require("./tools/salonSearch");
exports.sessionUpdate = {
    type: 'session.update',
    session: {
        turn_detection: {
            type: 'server_vad',
            threshold: 0.4,
            prefix_padding_ms: 250,
            silence_duration_ms: 350,
            create_response: true,
        },
        input_audio_noise_reduction: {
            type: 'near_field',
        },
        input_audio_format: 'pcm16',
        input_audio_transcription: {
            model: 'gpt-4o-transcribe',
            language: 'pl',
        },
        tools: [
            ragSearch_1.ragSearchTool,
            validateMeetingDetails_1.validateMeetingDetailsTool,
            checkAvailability_1.checkAvailabilityTool,
            salonSearch_1.salonSearchTool,
            phoneNumber_1.phoneNumberTool
        ],
        tool_choice: 'auto',
        output_audio_format: 'pcm16',
        voice: 'ash', // Allowed options: coral, alloy, shimmer
        instructions: instructions_1.assistantInstructions,
        modalities: ['text', 'audio'],
        temperature: 0.6,
    },
};
