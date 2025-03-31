import React, { useEffect, useRef, useState } from 'react';

import { ChatInput } from '../ChatInput/ChatInput';

import { ChatMessage } from '../ChatMessage/ChatMessage';
import { Conversation } from '../ChatMessage/ChatMessage.styled';

import { TypingIndicator } from '../Dots/Dots';

import { WelcomeComponent } from '../WelcomeComponent/WelcomeComponent';

import { useChat } from '../../hooks/useChat';

import {
  ChatHeader,
  ChatLogo,
  ChatWrapper,
  Container,
} from './ChatTemplate.styled';

export const Chat = () => {
  const { messages, isLoading, sendMessage, handleRecommendMessage } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [clearInput, setClearInput] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleCommonTopicClick = (topic: string) => {
    setInputValue(topic);
    sendMessage(topic);
    setClearInput(true);
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
    setClearInput(true);
  };

  useEffect(() => {
    const handleMessageEvent = (event: MessageEvent) => {
      if (event.data.action === 'recommendationMessage') {
        const message = event.data.message;
        console.log(event.data, 'DATA CHAT');

        if (
          !messages.some(existingMessage => existingMessage.id === message.id)
        ) {
          handleRecommendMessage(message);
        }
      }
    };

    window.addEventListener('message', handleMessageEvent);
    return () => {
      window.removeEventListener('message', handleMessageEvent);
    };
  }, [messages, handleRecommendMessage]);

  useEffect(() => {
    if (clearInput) {
      setInputValue('');
      setClearInput(false);
    }
  }, [clearInput]);

  return (
    <Container>
      <ChatWrapper>
        <ChatHeader>
          <ChatLogo src="/chat-icon.svg" alt="Icon" />
          <h1 className="text-xl font-semibold">Chat</h1>
        </ChatHeader>

        <div className="h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeComponent onCommonTopicClick={handleCommonTopicClick} />
          ) : (
            <Conversation>
              {messages
                .slice()
                .sort((a, b) => {
                  const timeA = new Date(a.timestamp).getTime();
                  const timeB = new Date(b.timestamp).getTime();
                  if (timeA !== timeB) {
                    return timeA - timeB;
                  }
                  if (a.role === b.role) return 0;
                  return a.role === 'user' ? -1 : 1;
                })
                .map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              {isLoading && <TypingIndicator />}
            </Conversation>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          initialValue={inputValue}
          clearInput={clearInput}
        />
      </ChatWrapper>
    </Container>
  );
};
