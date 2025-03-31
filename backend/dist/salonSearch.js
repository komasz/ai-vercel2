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
exports.handleSalonSearch = handleSalonSearch;
function handleSalonSearch(message, parsedArgs, openAiWs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Wysyłanie zapytania do webhooka n8n:', parsedArgs);
            console.log(process.env.N8N_WEBHOOK_URL);
            const response = yield fetch(process.env.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: parsedArgs.pytanie,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.text();
            console.log('Odpowiedź z webhooka n8n:', data);
            const output = {
                type: 'conversation.item.create',
                item: {
                    type: 'function_call_output',
                    call_id: message.call_id,
                    output: JSON.stringify({
                        success: 'true',
                        text: data,
                    }),
                },
            };
            openAiWs.send(JSON.stringify(output));
        }
        catch (error) {
            console.error('Błąd podczas wywoływania webhooka n8n:', error);
            const errorOutput = {
                type: 'conversation.item.create',
                item: {
                    type: 'function_call_output',
                    call_id: message.call_id,
                    output: JSON.stringify({
                        success: 'false',
                        error: error.message || 'Błąd podczas wywoływania webhooka n8n',
                    }),
                },
            };
            openAiWs.send(JSON.stringify(errorOutput));
        }
    });
}
