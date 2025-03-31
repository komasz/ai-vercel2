import React from 'react';
import { css, Global } from '@emotion/react';
import { theme } from './theme';

const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        font-size: 16px;
        scroll-behavior: smooth;
      }

      h1 {
        font-size: 1rem;
        font-weight: 500;
      }

      h2 {
        font-size: 1.5rem;
        font-weight: 600;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      p {
        font-weight: 400;
      }

      body {
        font-family: 'Outfit', sans-serif;
        line-height: 1.5;
        background-color: ${theme.colors.background};
        display: flex;
        align-items: center;
      }

      a {
        color: ${theme.colors.black};
        text-decoration: underline;
        font-weight: 700;
      }

      button {
        border: none;
        background: none;
        cursor: pointer;
        font-family: inherit;
      }
    `}
  />
);

export default GlobalStyles;
