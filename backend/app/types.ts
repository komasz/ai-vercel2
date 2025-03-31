export enum OpenAIMessageEventType {
  ConversationItemInputAudioTranscriptionCompleted = 'conversation.item.input_audio_transcription.completed',
  InputAudioBufferSpeechStarted = 'input_audio_buffer.speech_started',
  ResponseContentPartDone = 'response.content_part.done',
  ResponseAudioDelta = 'response.audio.delta',
  ResponseFunctionCallArgumentsDone = 'response.function_call_arguments.done',
  ConversationItemCreated = 'conversation.item.created',
}

export enum ToolFunctionName {
  RagSearch = 'rag_search',
  BookMeeting = 'bookMeeting',
  CheckAvailability = 'checkAvailability',
  ValidateMeetingDetails = 'validateMeetingDetails',
}

export interface FunctionCallOutputItem {
  type: 'function_call_output';
  call_id: string;
  output: string;
}

export interface MessageContentPart {
  type: string;
  transcript?: string;
}

export interface ConversationMessageItem {
  type: 'message';
  status: string;
  role: string;
  content: MessageContentPart[];
}

export type OpenAiMessageEventItem =
  | FunctionCallOutputItem
  | ConversationMessageItem;

export interface OpenAIMessageEventData {
  type: OpenAIMessageEventType;
  name: ToolFunctionName;
  transcript?: string;
  event_id: string;
  part?: {
    transcript: string;
  };
  response_id?: string;
  response?: {
    object: string;
    status: 'failed' | string;
    status_details?: {
      type: string;
      error?: {
        type: string;
        code: string;
        message: string;
      };
    };
  };
  delta?: any;
  arguments?: string;
  call_id?: string;
  item?: OpenAiMessageEventItem;
}

export interface ParsedArgs {
  check?: boolean;
  meetingDate: string;
  duration?: number;
  pytanie: string;
  firstName?: string;
  lastName?: string;
  typZabiegu?: string;
  phone?: string;
  email?: string;
  confirm?: boolean;
}
