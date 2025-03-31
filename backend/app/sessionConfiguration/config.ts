import { ragSearchTool } from './tools/ragSearch';
import { validateMeetingDetailsTool } from './tools/validateMeetingDetails';
import { checkAvailabilityTool } from './tools/checkAvailability';
import { phoneNumberTool } from './tools/phoneNumber';
import { assistantInstructions } from './instructions';
import { salonSearchTool } from './tools/salonSearch';
import { offerSearchTool } from './tools/offerSearch';

export const sessionUpdate = {
  type: 'session.update',
  session: {
    turn_detection: {
      type: 'server_vad',
          threshold: 0.4,
          prefix_padding_ms: 300,
          silence_duration_ms: 1500,
    //  eagerness: 'low', // optional
      interrupt_response: true, // only in conversation mode
      //   create_response: true,
    },
    input_audio_noise_reduction: {
      type: 'near_field',
    },
    input_audio_format: 'pcm16',
    input_audio_transcription: {
      model: 'gpt-4o-transcribe',
      language: 'pl',
    },
    tools: [
      ragSearchTool,
      validateMeetingDetailsTool,
      checkAvailabilityTool,
      salonSearchTool,
      phoneNumberTool,
      offerSearchTool,
    ],
    tool_choice: 'auto',
    output_audio_format: 'pcm16',
    voice: 'ash', // Allowed options: coral, alloy, shimmer
    instructions: assistantInstructions,
    modalities: ['text', 'audio'],
    temperature: 1.0,
  },
};
