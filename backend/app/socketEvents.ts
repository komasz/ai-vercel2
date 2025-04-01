import { Socket } from 'socket.io';
import { createOpenAiWebSocket } from './websocket';
import WebSocket from 'ws';
import { bookMeetingTool } from './sessionConfiguration/tools/bookMeeting';
import { ToolFunctionName } from './types';

/**
 * @function handleSocketConnection
 * @description Handles user connection events via Socket.io.
 *              - Listens for audio and text inputs, and relays them to the OpenAI realtime API.
 *              - Manages the cancellation (stop) of responses if requested.
 *              - Closes the OpenAI WebSocket upon user disconnection.
 *
 * @param {Socket} socket - The client socket connection.
 */
export function handleSocketConnection(socket: Socket) {
  console.log('User connected');

  const { openAiWs } = createOpenAiWebSocket(socket);

  // Forward incoming audio data to OpenAI after converting the data from base64 encoding.
  socket.on('audioInput', (audioData: string) => {
    if (openAiWs.readyState === WebSocket.OPEN) {
      const audioAppend = {
        type: 'input_audio_buffer.append',
        audio: Buffer.from(audioData, 'base64').toString('base64'),
      };
      openAiWs.send(JSON.stringify(audioAppend));
    } else {
      console.error('WebSocket is not open. Cannot send audio data.');
    }
  });

  // Send text input from the user to the conversation item handler.
  socket.on('textInput', (text: string) => {
    if (openAiWs.readyState === WebSocket.OPEN) {
      const textAppend = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          status: 'completed',
          content: [
            {
              type: 'input_text',
              text: text,
            },
          ],
        },
      };
      openAiWs.send(JSON.stringify(textAppend));
    } else {
      console.error('WebSocket is not open. Cannot send text data.');
    }
  });

  // Confirm data for bookMeeting.
  socket.on('confirmData', async parsedArgs => {
    if (openAiWs.readyState === WebSocket.OPEN) {
      console.log('wyslane', parsedArgs);
      const objectAppend = {
        type: 'response.create',
        response: {
          instructions: `Wywołaj funckje bookMeeting z tymi danymi: ${JSON.stringify(parsedArgs)}`,
          tools: [bookMeetingTool],
          tool_choice: 'required',
          temperature: 1.2,
        },
      };
      openAiWs.send(JSON.stringify(objectAppend));
    } else {
      console.error('WebSocket is not open. Cannot confirm Data.');
    }
  });

  // Stop any ongoing response by sending a cancel command.
  socket.on('stop', (responseId?: string) => {
    if (openAiWs.readyState === WebSocket.OPEN) {
      const cancelEvent = {
        type: 'response.cancel',
        response_id: responseId,
      };
      openAiWs.send(JSON.stringify(cancelEvent));
    } else {
      console.error('WebSocket is not open. Cannot cancel respone.');
    }
  });

  // On disconnect, ensure that the connection to OpenAI is closed.
  socket.on('disconnect', () => {
    console.log('User disconnected');
    openAiWs.close();
  });
}
