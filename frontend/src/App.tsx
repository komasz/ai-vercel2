import React from 'react';

import { ShowChat } from './components/ShowChat/ShowChat';

const App: React.FC = () => {
  return (
    <div>
      <p>tutaj jest widoczna strona, na której umieszczony jest czat</p>
      <ShowChat />
    </div>
  );
};

export default App;
