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
exports.handleCheckAvailability = handleCheckAvailability;
const checkDepilationAvailability_1 = require("./libs/nylas/checkDepilationAvailability");
function handleCheckAvailability(message, parsedArgs, openAiWs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const duration = parsedArgs.duration || 60;
            const availabilityResult = yield (0, checkDepilationAvailability_1.checkDepilationAvailability)(parsedArgs.meetingDate, duration);
            console.log('Dostępność terminu:', availabilityResult);
            const output = {
                type: 'conversation.item.create',
                item: {
                    type: 'function_call_output',
                    call_id: message.call_id,
                    output: JSON.stringify({
                        success: 'true',
                        available: availabilityResult.available,
                        conflicts: availabilityResult.conflicts || [],
                    }),
                },
            };
            openAiWs.send(JSON.stringify(output));
        }
        catch (error) {
            console.error('Błąd podczas sprawdzania dostępności:', error);
            const errorOutput = {
                type: 'conversation.item.create',
                item: {
                    type: 'function_call_output',
                    call_id: message.call_id,
                    output: JSON.stringify({
                        success: 'false',
                        error: error.message || 'Błąd podczas sprawdzania dostępności',
                    }),
                },
            };
            openAiWs.send(JSON.stringify(errorOutput));
        }
    });
}
