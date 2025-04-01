import styled from '@emotion/styled';

import { theme } from '../../styles/theme';

export const AudioChatIconButton = styled.img`
  position: absolute;
  bottom: 20px;
  right: 0;
  width: 76px;
  height: 68px;
  cursor: pointer;

  @media (min-width: 768px) {
    bottom: 0;
  }
`;

export const AudioChatRuningIcon = styled.img`
  display: block;
  width: 179px;
  height: 68px;
`;

export const StopAudioIconButton = styled.img`
  display: block;
  width: 76px;
  height: 68px;
  cursor: pointer;
`;

export const ChatRuningWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 3px;
  background-color: ${theme.colors.chatBg};
`;
