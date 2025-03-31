import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ChatWrapper = styled.section`
  position: relative;
  width: calc(100dvw - 40px);
  height: 100dvh;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px 20px;

  @media (min-width: 768px) {
    padding: 0 20px;
  }
`;

export const InputWrapper = styled.div``;

export const ChatHeader = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 100;
  top: 0;
`;
export const ChatLogo = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 20px;
`;

export const LoadingLogo = styled.div`
  width: 28px;
  height: 28px;
  margin: 0 20px;
`;
