import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIMessageEventData, ParsedArgs } from './types';
import WebSocket from 'ws';

const indexName = 'depilacja-test-n8n';
const model = 'text-embedding-3-small';

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
  const response = await index.namespace('Blog').query({
    vector: embedding.data[0].embedding,
    topK: 7,
    includeMetadata: true
  });
  const texts: string[] = [];
  for (const j of response.matches) {
    console.log(j);
    // const index = await depilacjaSiteDb.getIndex('/depilacja', j.id);
    // const site: { url: string; content: string } =
    //   await depilacjaSiteDb.getObject(`/depilacja/${index}`);
    texts.push(`
      Zawartość artykułu: ${j.metadata?.text}
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
