import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { theme } from '../../styles/theme';

export const Motion = styled(motion.div)``;
export const Conversation = styled.section`
  height: 50vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ConversationWrapper = styled.div<{ isBot: boolean }>`
  max-width: ${theme.maxWidth};
  margin: 20px auto;
  display: flex;
  justify-content: ${({ isBot }) => (isBot ? 'flex-start' : 'flex-end')};
`;

export const BotAnswerWrapper = styled.div`
  max-width: 663px;
  display: flex;
  flex-direction: column;
`;

export const BotAnswer = styled.div`
  display: flex;
  line-height: 1.5;
  color: ${theme.colors.black};
`;

export const UserAnswer = styled.p`
  background: ${theme.colors.answerBg};
  color: ${theme.colors.black};
  padding: 10px 20px;
  border-radius: 8px;
  line-height: 1.5;
`;

export const StyledA = styled.a``;
export const StyledP = styled.p`
  margin-bottom: 10px;
`;
export const StyledOL = styled.ol`
  margin: 10px 0 10px 15px;

  li {
    margin-block: 10px;
  }
`;

export const StyledUL = styled.ul`
  li {
    margin-block: 10px;
  }
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: center;
  border-radius: 16px 16px 0 0;
  background-color: white;
`;

export const ChatAnswerLogo = styled.img`
  width: 18px;
  height: 17px;
  margin-right: 18px;
`;
