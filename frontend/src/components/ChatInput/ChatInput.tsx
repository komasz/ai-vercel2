import React, { ReactElement, useEffect, useState, useCallback } from 'react';
import {
  Arrow,
  FormContainer,
  InputWrapper,
  StyledInput,
  SubmitButton,
} from './ChatInput.styled';

import AudioChat from '../AudioChat/AudioChat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  initialValue?: string;
  clearInput: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  initialValue = '',
  clearInput,
}): ReactElement => {
  const [message, setMessage] = useState(initialValue);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    setMessage(clearInput ? '' : initialValue || '');
  }, [initialValue, clearInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
    }
  };

  const startVoice = useCallback(() => {
    setVoiceEnabled(true);
  }, []);

  const stopVoice = useCallback(() => {
    setVoiceEnabled(false);
  }, []);

  return (
    <FormContainer voiceEnabled={voiceEnabled} onSubmit={handleSubmit}>
      {!voiceEnabled && (
        <InputWrapper>
          <StyledInput
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Wpisz wiadomość"
            disabled={disabled}
          />
          <SubmitButton type="submit" disabled={disabled || !message.trim()}>
            <Arrow />
          </SubmitButton>
        </InputWrapper>
      )}

      <AudioChat
        voiceEnabled={voiceEnabled}
        onVoiceStart={startVoice}
        onVoiceStop={stopVoice}
      />
    </FormContainer>
  );
};
