"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolFunctionName = exports.OpenAIMessageEventType = void 0;
var OpenAIMessageEventType;
(function (OpenAIMessageEventType) {
    OpenAIMessageEventType["ConversationItemInputAudioTranscriptionCompleted"] = "conversation.item.input_audio_transcription.completed";
    OpenAIMessageEventType["InputAudioBufferSpeechStarted"] = "input_audio_buffer.speech_started";
    OpenAIMessageEventType["ResponseContentPartDone"] = "response.content_part.done";
    OpenAIMessageEventType["ResponseAudioDelta"] = "response.audio.delta";
    OpenAIMessageEventType["ResponseFunctionCallArgumentsDone"] = "response.function_call_arguments.done";
    OpenAIMessageEventType["ConversationItemCreated"] = "conversation.item.created";
})(OpenAIMessageEventType || (exports.OpenAIMessageEventType = OpenAIMessageEventType = {}));
var ToolFunctionName;
(function (ToolFunctionName) {
    ToolFunctionName["RagSearch"] = "rag_search";
    ToolFunctionName["SalonSearch"] = "salon_search";
    ToolFunctionName["BookMeeting"] = "bookMeeting";
    ToolFunctionName["CheckAvailability"] = "checkAvailability";
    ToolFunctionName["ValidateMeetingDetails"] = "validateMeetingDetails";
    ToolFunctionName["PhoneNumber"] = "PhoneNumber";
})(ToolFunctionName || (exports.ToolFunctionName = ToolFunctionName = {}));
