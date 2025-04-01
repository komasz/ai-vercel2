import styled from '@emotion/styled';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { theme } from '../../styles/theme';

export const FormContainer = styled.form<{ voiceEnabled?: boolean }>`
  width: calc(90dvw - 100px);
  margin: 20px 72px 24px auto;
  border-radius: 8px;
  bottom: 24px;
  right: 0;
  z-index: 100;
  box-shadow: ${({ voiceEnabled }) =>
    voiceEnabled ? 'none' : '0px 16px 16px 0px rgba(0, 0, 0, 0.15)'};

  @media (min-width: 768px) {
    width: calc(50dvw - 100px);
  }
`;

export const InputWrapper = styled.div`
  padding: 10px 20px;
  border-radius: 8px;
  background: ${theme.colors.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
`;

export const StyledInput = styled.input`
  font-family: 'Outfit', sans-serif;
  border: none;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${theme.colors.inputPlaceholder};
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
`;

export const Arrow = styled(ArrowUpIcon)`
  width: 16px;
  height: 16px;
  color: ${theme.colors.black};
  stroke: ${theme.colors.black};
  stroke-width: 1;
  padding-left: 1px;
`;
