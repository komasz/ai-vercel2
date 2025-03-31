import React, { useState } from 'react';
import {
  ChatIconButton,
  ChatWrapper,
  OpenIcon,
  CloseIcon,
} from './ShowChat.styled';

import { Chat } from '../ChatTemplate/ChatTemplate';

export const ShowChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <ChatIconButton onClick={toggleChat} isOpen={isOpen}>
        {isOpen ? (
          <CloseIcon src="/close-chat.svg" alt="Close" />
        ) : (
          <OpenIcon src="/show-chat.svg" alt="Open" />
        )}
      </ChatIconButton>

      {isOpen && (
        <ChatWrapper>
          <Chat />
        </ChatWrapper>
      )}
    </>
  );
};
