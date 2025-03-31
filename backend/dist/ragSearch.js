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
exports.handleRagSearch = handleRagSearch;
const database_1 = require("./libs/database");
const indexName = 'depilacja-v2';
const model = 'text-embedding-ada-002';
function handleRagSearch(message, parsedArgs, openAiWs, openai, pc) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Handling rag_search for query:', parsedArgs.pytanie);
        const embedding = yield openai.embeddings.create({
            model: model,
            input: parsedArgs.pytanie,
            encoding_format: 'float',
        });
        const index = pc.index(indexName);
        const response = yield index.namespace('ns1').query({
            vector: embedding.data[0].embedding,
            topK: 5,
        });
        const texts = [];
        for (const j of response.matches) {
            const index = yield database_1.depilacjaSiteDb.getIndex('/depilacja', j.id);
            const site = yield database_1.depilacjaSiteDb.getObject(`/depilacja/${index}`);
            texts.push(`
      URL: ${site.url}
      CONTENT: ${site.content}
    `);
        }
        const textAppend = {
            type: 'conversation.item.create',
            item: {
                type: 'function_call_output',
                call_id: message.call_id,
                output: JSON.stringify({
                    success: 'true',
                    text: texts.join('\n'),
                }),
            },
        };
        openAiWs.send(JSON.stringify(textAppend));
    });
}
