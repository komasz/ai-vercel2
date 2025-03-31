import styled from '@emotion/styled';

import { theme } from '../../styles/theme';

export const OpenIcon = styled.img`
  width: 92px;
  height: 84px;
`;

export const CloseIcon = styled.img`
  width: 44px;
  height: 44px;
  padding: 10px;
`;

export const ChatIconButton = styled.button<{ isOpen: boolean }>`
  position: fixed;
  ${({ isOpen }) =>
    isOpen
      ? `
        top: 10px; 
        right: 10px; 
      `
      : `
        bottom: 20px; 
        right: 0;
        @media (min-width: 768px) {
            bottom: 0;
        }
      `}
  z-index: 9999;
  border: none;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;

  &:hover {
    opacity: 0.85;
  }
`;

export const ChatWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100dvw;
  z-index: 9998;
  background-color: ${theme.colors.chatBg};

  @media (min-width: 768px) {
    width: 50dvw;
  }
`;
