import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { Socket } from 'socket.io';
import WebSocket from 'ws';
import { handleCheckAvailability } from './checkAvailability';
import { convertPhoneNumberToWords } from './convertPhoneNumberToWords';
import { handleBookMeeting } from './libs/nylas/meetingHandler';
import { handleRagSearch } from './ragSearch';
import { handleSalonSearch } from './salonSearch';
import { handleOfferSearch } from './offerSearch';
import { sessionUpdate } from './sessionConfiguration/config';
import {
  OpenAIMessageEventData,
  OpenAIMessageEventType,
  ParsedArgs,
  ToolFunctionName,
} from './types';
import { salonSearchResponseInstructions } from './sessionConfiguration/salonSearchResponseInstructions';

/**
 * @function createOpenAiWebSocket
 * @description This function establishes a WebSocket connection to the OpenAI Realtime API, enabling real-time communication between the client and the AI.
 *              It handles various types of messages and events, facilitating a two-step booking process and other interactions.
 *
 *              Key functionalities include:
 *              - Establishing a WebSocket connection and sending initial session configuration.
 *              - Handling different message types from the OpenAI API, such as audio transcription completion, speech start, content part completion, and function call arguments.
 *              - Implementing a two-step booking flow:
 *                1. When booking data is received, it is stored, and a confirmation request is sent to the AI.
 *                2. Upon user confirmation, the booking is finalized by sending a request to Nylas, with the result communicated back to the AI.
 *              - Emitting events to the client socket based on message types, such as audio input transcription, speech start, text transcript, and audio response.
 *              - Handling errors and unknown function calls gracefully, ensuring robust communication.
 *
 * @param {Socket} socket - The client's socket connection.
 * @returns {WebSocket} - Returns the open WebSocket connection as `openAiWs`.
 */
export function createOpenAiWebSocket(socket: Socket): { openAiWs: WebSocket } {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const openAiWs = new WebSocket(
    'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    },
  );

  openAiWs.on('open', () => {
    console.log('Connected to OpenAI Realtime API');
    openAiWs.send(JSON.stringify(sessionUpdate));
  });

  openAiWs.on('message', async (data: string) => {
    const message: OpenAIMessageEventData = JSON.parse(data);
    // console.log(message) //For debugging
    if (
      message.type ===
        OpenAIMessageEventType.ConversationItemInputAudioTranscriptionCompleted &&
      message.transcript
    ) {
      console.log('USER (audio transcription completed):', message.transcript);
      socket.emit('audioInputTranscript', message);
    }

    if (message.type === OpenAIMessageEventType.InputAudioBufferSpeechStarted) {
      console.log('USER (speech started) transcript:', message.event_id);
      socket.emit('speechStarted', message.event_id);
    }

    if (
      message.type === OpenAIMessageEventType.ResponseContentPartDone &&
      message.part
    ) {
      console.log('Wojtek AI (content_part.done):', message.part.transcript);
      socket.emit('textTranscript', message);
    }

    if (
      message.type === OpenAIMessageEventType.ResponseAudioDelta &&
      message.delta
    ) {
      console.log(
        'Wojtek AI (audio delta) - response_id:',
        message.response_id,
      );
      socket.emit('audioResponse', message);
    }

    if (
      message.type === OpenAIMessageEventType.ResponseFunctionCallArgumentsDone
    ) {
      console.log('Received function call:', message);
      const parsedArgs: ParsedArgs = JSON.parse(message.arguments || '{}');
      const functionName: string = message?.name || '';
      console.log(
        `Received function call arguments for function [${functionName}]:`,
        parsedArgs,
      );

      switch (functionName) {
        case ToolFunctionName.CheckAvailability: {
          await handleCheckAvailability(message, parsedArgs, openAiWs);
          return;
        }
        case ToolFunctionName.RagSearch: {
          await handleRagSearch(message, parsedArgs, openAiWs, openai, pc);
          return;
        }
        case ToolFunctionName.SalonSearch: {
          await handleSalonSearch(message, parsedArgs, openAiWs);
          return;
        }
        case ToolFunctionName.OfferSearch: {
          await handleOfferSearch(message, parsedArgs, openAiWs);
          return;
        }
        case ToolFunctionName.ValidateMeetingDetails: {
          console.log(
            'Received booking details, awaiting confirmation for:',
            parsedArgs.firstName,
            parsedArgs.lastName,
          );

          const objectAppend = {
            type: 'response.create',
            response: {
              instructions:
                'Napisz uzytkownikowi dokładnie taką wiadomość: Poniżej wyświetlił się formularz. Proszę sprawdź, czy wszystkie dane są poprawne, a następnie potwierdź wizytę.',
            },
          };
          openAiWs.send(JSON.stringify(objectAppend));
          socket.emit('confirmationMessage', parsedArgs);
          return;
        }
        case ToolFunctionName.BookMeeting: {
          const result = await handleBookMeeting(parsedArgs, message, socket);
          openAiWs.send(JSON.stringify(result));
          return;
        }
        case ToolFunctionName.PhoneNumber: {
          const phoneNumber = parsedArgs.phone_number;
          console.log('PHONE NUMBER', phoneNumber);

          const outputSuccess = {
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: message.call_id,
              output: JSON.stringify({
                phone_number: convertPhoneNumberToWords(phoneNumber as string),
                success: true,
              }),
            },
          };

          openAiWs.send(JSON.stringify(outputSuccess));
          return;
        }
        default: {
          console.error('Unknown function call:', functionName);
          break;
        }
      }
    }

    if (
      message.type === OpenAIMessageEventType.ConversationItemCreated &&
      message.item?.type === 'function_call_output' &&
      message.item.output &&
      JSON.parse(message.item.output).success
    ) {
      const args = JSON.parse(message.item.output);

      let objectAppend;
      objectAppend = {
        type: 'response.create',
      };

      if (args.text) {
        objectAppend = {
          type: 'response.create',
          response: {
           // conversation: 'none',
            instructions:
              salonSearchResponseInstructions + 'Przeczytaj to:' + args.text,
          },
        };
      }

      openAiWs.send(JSON.stringify(objectAppend));
    }

    if (
      message.type === OpenAIMessageEventType.ConversationItemCreated &&
      message.item?.type === 'function_call_output' &&
      JSON.parse(message.item.output).error
    ) {
      const objectAppend = {
        type: 'response.create',
        response: {
          instructions:
            'Niestety wystąpił błąd, poinformuj uźytkownika o błędzie i poproś aby spróbował ponownie',
        },
      };
      openAiWs.send(JSON.stringify(objectAppend));
    }

    if (
      message.type === OpenAIMessageEventType.ConversationItemCreated &&
      message.item?.type === 'message' &&
      message.item?.status === 'completed' &&
      message.item?.role === 'user' &&
      message.item?.content?.some(part => part.type === 'input_text')
    ) {
      console.log('USER (message completed):', message.item.content);
      const objectAppend = {
        type: 'response.create',
      };
      openAiWs.send(JSON.stringify(objectAppend));
    }

    if (
      message.response?.status_details &&
      message.response.status_details.error
    ) {
      socket.emit('error', message.response.status_details.error);
      console.error('OpenAI status_details:', message.response.status_details);
    }
  });

  openAiWs.on('close', () => {
    console.log('Disconnected from OpenAI Realtime API');
  });

  openAiWs.on('error', (error: Error) => {
    console.error('OpenAI WebSocket error:', error);
  });

  return { openAiWs };
}
