import { OpenAIMessageEventData, ParsedArgs } from './types';
import WebSocket from 'ws';

export async function handleOfferSearch(
  message: OpenAIMessageEventData,
  parsedArgs: ParsedArgs,
  openAiWs: WebSocket,
) {
  try {
    console.log('Wysyłanie zapytania do webhooka n8n:', parsedArgs);
    console.log(process.env.N8N_OFFER_WEBHOOK_URL);

    const response = await fetch(process.env.N8N_OFFER_WEBHOOK_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: parsedArgs.pytanie,
        id: message.response_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
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
  } catch (error: any) {
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
}
