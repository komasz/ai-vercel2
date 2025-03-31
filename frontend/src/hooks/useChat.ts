import { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { BotMessage, ChatState, UserMessage } from '@/types/chat';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const processedTextEventIds = useRef<Set<string>>(new Set());
  const processedAudioEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    socket.connect();
    setState(prev => ({ ...prev, isLoading: true }));

    socket.on('connect', () => {
      setState(prev => ({ ...prev, isLoading: false }));
    });

    socket.on('audioInputTranscript', (data: any) => {
      if (data.event_id) {
        if (processedAudioEventIds.current.has(data.event_id)) {
          return;
        }
        processedAudioEventIds.current.add(data.event_id);
      }

      const userMessage: UserMessage = {
        id: Date.now().toString(),
        content: data.transcript,
        role: 'user',
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));
    });

    socket.on('textTranscript', (data: any) => {
      if (processedTextEventIds.current.has(data.event_id)) {
        return;
      }
      processedTextEventIds.current.add(data.event_id);

      const botMessage: BotMessage = {
        id: (Date.now() + 1).toString(),
        content: {
          message: data.part?.transcript || '(no text)',
          articles: [],
        },
        role: 'assistant',
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }));
    });

    socket.on('connect_error', err => {
      console.error('Socket connect_error:', err);
      setState(prev => ({
        ...prev,
        error: 'Unable to connect to Socket.io',
        isLoading: false,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!socket.connected) {
      console.error('Socket is not connected.');
      return;
    }

    socket.emit('textInput', text);

    const userMessage: UserMessage = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));
  };

  const handleRecommendMessage = (message: string) => {
    const assistantMessage: BotMessage = {
      id: Date.now().toString(),
      content: { message, articles: [] },
      role: 'assistant',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isLoading: false,
    }));
  };

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    handleRecommendMessage,
  };
};
