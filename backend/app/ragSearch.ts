import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { depilacjaSiteDb } from './libs/database';
import { OpenAIMessageEventData, ParsedArgs } from './types';
import WebSocket from 'ws';

const indexName = 'depilacja-v2';
const model = 'text-embedding-ada-002';

export async function handleRagSearch(
  message: OpenAIMessageEventData,
  parsedArgs: ParsedArgs,
  openAiWs: WebSocket,
  openai: OpenAI,
  pc: Pinecone,
) {
  console.log('Handling rag_search for query:', parsedArgs.pytanie);
  const embedding = await openai.embeddings.create({
    model: model,
    input: parsedArgs.pytanie,
    encoding_format: 'float',
  });
  const index = pc.index(indexName);
  const response = await index.namespace('ns1').query({
    vector: embedding.data[0].embedding,
    topK: 5,
  });
  const texts: string[] = [];
  for (const j of response.matches) {
    const index = await depilacjaSiteDb.getIndex('/depilacja', j.id);
    const site: { url: string; content: string } =
      await depilacjaSiteDb.getObject(`/depilacja/${index}`);
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
}
