import React from 'react';

import { LoadingLogo } from '../ChatTemplate/ChatTemplate.styled';

import { Dot, DotContainer, TypingIndicatorWrapper } from './Dots.styled';

const dotVariants = {
  animate: (i: number) => ({
    y: [0, -4, 0],
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.5,
    },
  }),
};

export const TypingIndicator = () => {
  return (
    <DotContainer>
      <LoadingLogo />
      <TypingIndicatorWrapper>
        {[...Array(3)].map((_, i) => (
          <Dot key={i} custom={i} variants={dotVariants} animate="animate" />
        ))}
      </TypingIndicatorWrapper>
    </DotContainer>
  );
};
