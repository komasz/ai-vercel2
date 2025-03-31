import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../../services/socket';
import { ChatInput } from '../ChatInput/ChatInput';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { Conversation } from '../ChatMessage/ChatMessage.styled';
import { TypingIndicator } from '../Dots/Dots';
import { WelcomeComponent } from '../WelcomeComponent/WelcomeComponent';
import DataForm from '../DataForm/DataForm';
import { useChat } from '../../hooks/useChat';
import {
  ChatHeader,
  ChatLogo,
  ChatWrapper,
  InputWrapper,
  Container,
} from './ChatTemplate.styled';

export const Chat = () => {
  const { messages, isLoading, sendMessage, handleRecommendMessage } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [clearInput, setClearInput] = useState(false);
  const [showDataForm, setShowDataForm] = useState(false);

  const [formInitialData, setFormInitialData] = useState<{
    firstName?: string;
    lastName?: string;
    typZabiegu?: string;
    phone?: string;
    email?: string;
    meetingDate?: string;
  }>({
    firstName: '',
    lastName: '',
    typZabiegu: '',
    phone: '',
    email: '',
    meetingDate: '',
  });

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

  useEffect(() => {
    const handleConfirmation = (data: any) => {
      console.log('confirmationMessage received:', data);
      setFormInitialData(data);
      setShowDataForm(true);
    };

    socket.on('confirmationMessage', handleConfirmation);
    return () => {
      socket.off('confirmationMessage', handleConfirmation);
    };
  }, []);

  useEffect(() => {
    const handleBookingResult = (result: any) => {
      console.log('Received bookingResult:', result);
      try {
        if (result && result.item && result.item.output) {
          const parsedOutput = JSON.parse(result.item.output);
          console.log('Parsed booking result:', parsedOutput);

          if (
            parsedOutput.success === true ||
            parsedOutput.success === 'true'
          ) {
            setShowDataForm(false);
          } else {
            console.warn('Booking result indicates failure.');
          }
        } else {
          console.warn(
            'Booking result does not contain expected output:',
            result,
          );
        }
      } catch (e) {
        console.error('Error parsing booking result:', e);
      }
    };

    socket.on('bookingResult', handleBookingResult);
    return () => {
      socket.off('bookingResult', handleBookingResult);
    };
  }, []);

  useEffect(() => {
    const handleCloseModal = () => {
      console.log('Received closeModal event');
      setShowDataForm(false);
    };

    socket.on('closeModal', handleCloseModal);
    return () => {
      socket.off('closeModal', handleCloseModal);
    };
  }, []);

  return (
    <Container>
      <ChatWrapper>
        <ChatHeader>
          <ChatLogo src="/chat-icon.svg" alt="Icon" />
          <h1 className="text-xl font-semibold">Chat</h1>
        </ChatHeader>

        <div className="overflow-y-auto">
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
        <InputWrapper>
          {showDataForm && <DataForm initialData={formInitialData} />}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            initialValue={inputValue}
            clearInput={clearInput}
          />
        </InputWrapper>
      </ChatWrapper>
    </Container>
  );
};
