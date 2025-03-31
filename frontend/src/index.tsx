import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals';
import GlobalStyles from './styles/globals';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <GlobalStyles />
      <App />
    </React.StrictMode>,
  );
}
