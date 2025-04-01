import { checkDepilationAvailability } from './libs/nylas/checkDepilationAvailability';
import { OpenAIMessageEventData, ParsedArgs } from './types';
import WebSocket from 'ws';

export async function handleCheckAvailability(
  message: OpenAIMessageEventData,
  parsedArgs: ParsedArgs,
  openAiWs: WebSocket,
) {
  try {
    const duration = parsedArgs.duration || 60;
    const availabilityResult = await checkDepilationAvailability(
      parsedArgs.meetingDate,
      duration,
    );
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
  } catch (error: any) {
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
}
