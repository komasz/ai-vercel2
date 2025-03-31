import { ragSearchTool } from './tools/ragSearch';
import { validateMeetingDetailsTool } from './tools/validateMeetingDetails';
import { checkAvailabilityTool } from './tools/checkAvailability';
import { assistantInstructions } from './instructions';

export const sessionUpdate = {
  type: 'session.update',
  session: {
    turn_detection: {
      type: 'server_vad',
      threshold: 0.4,
      prefix_padding_ms: 250,
      silence_duration_ms: 350,
      create_response: true,
    },
    input_audio_format: 'pcm16',
    input_audio_transcription: {
      model: 'whisper-1',
      language: 'pl',
    },
    tools: [ragSearchTool, validateMeetingDetailsTool, checkAvailabilityTool],
    tool_choice: 'auto',
    output_audio_format: 'pcm16',
    voice: 'alloy', // Allowed options: coral, alloy, shimmer
    instructions: assistantInstructions,
    modalities: ['text', 'audio'],
    temperature: 1,
  },
};
