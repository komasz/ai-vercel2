import React, { useEffect, useRef, useState } from 'react';
import { ReactElement } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import { BotMessage, UserMessage } from '../../types/chat';

import {
  BotAnswer,
  BotAnswerWrapper,
  ConversationWrapper,
  Motion,
  StyledA,
  StyledImage,
  StyledOL,
  StyledP,
  StyledUL,
  UserAnswer,
  ChatAnswerLogo,
} from './ChatMessage.styled';

interface ChatMessageProps {
  message: UserMessage | BotMessage;
}

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const ChatMessage: (props: ChatMessageProps) => ReactElement = ({
  message,
}) => {
  const isBot = message.role === 'assistant';
  const fullContent =
    typeof message.content === 'string'
      ? message.content
      : message.content.message;

  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBot && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [displayedText, isBot]);

  useEffect(() => {
    if (!isBot && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isBot]);

  useEffect(() => {
    if (!isBot || !fullContent) return;

    const interval = setInterval(() => {
      if (textIndex < fullContent.length) {
        const nextChar = fullContent[textIndex];

        if (nextChar === '!' && fullContent.slice(textIndex).startsWith('![')) {
          const match = fullContent.slice(textIndex).match(/!\[.*?\]\(.*?\)/);
          if (match) {
            setDisplayedText(prev => prev + match[0]);
            setTextIndex(prev => prev + match[0].length);
            return;
          }
        }

        if (nextChar === '[' && fullContent.slice(textIndex).startsWith('[')) {
          const match = fullContent.slice(textIndex).match(/\[.*?\]\(.*?\)/);
          if (match) {
            setDisplayedText(prev => prev + match[0]);
            setTextIndex(prev => prev + match[0].length);
            return;
          }
        }

        setDisplayedText(prev => prev + nextChar);
        setTextIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        if (messageRef.current) {
          messageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }, 8);

    return () => clearInterval(interval);
  }, [isBot, fullContent, textIndex]);

  return (
    <Motion
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <ConversationWrapper isBot={isBot} ref={messageRef}>
        <BotAnswer>
          {isBot && (
            <ChatAnswerLogo
              src="/chat-answer-logo.svg"
              alt="Chat answer icon"
            />
          )}
          {isBot ? (
            <BotAnswerWrapper>
              <Markdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ ...props }) => <StyledA {...props} />,
                  p: ({ ...props }) => <StyledP {...props} />,
                  ol: ({ ...props }) => <StyledOL {...props} />,
                  ul: ({ ...props }) => <StyledUL {...props} />,
                  img: ({ src, alt }) => <StyledImage src={src!} alt={alt!} />,
                }}
              >
                {displayedText}
              </Markdown>
            </BotAnswerWrapper>
          ) : (
            <UserAnswer>{fullContent}</UserAnswer>
          )}
        </BotAnswer>
      </ConversationWrapper>
    </Motion>
  );
};
