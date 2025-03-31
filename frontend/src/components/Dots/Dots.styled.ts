import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { theme } from '../../styles/theme';

export const TypingIndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
`;

export const Dot = styled(motion.div)`
  width: 7px;
  height: 7px;
  background-color: ${theme.colors.black};
  border-radius: 50%;
`;

export const DotContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: ${theme.maxWidth};
`;
