# Voice AI Chat

Voice AI Chat is a project that leverages artificial intelligence to facilitate voice-based communication. It aims to provide a seamless and intuitive user experience by converting spoken language into text and generating appropriate responses using the OpenAI Realtime model.

## Project Structure

This project consists of two main parts:

- **Backend**: Built with Node.js and Express, it handles API requests, socket connections, and integrates with external services like Nylas, OpenAI and Pinecone.
- **Frontend**: A React application that provides the user interface for interacting with the voice chat system.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Environment variables set up for Nylas, Pinecone and OpenAI API keys.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/voice-ai-chat.git
   cd voice-ai-chat
   ```

2. **Install dependencies**:

   - Backend:
     ```bash
     cd backend
     npm install
     ```

   - Frontend:
     ```bash
     cd frontend
     npm install
     ```

### Running the Application

1. **Backend**:
   - Start the server in development mode:
     ```bash
     npm run dev
     ```

2. **Frontend**:
   - Start the React application:
     ```bash
     npm start
     ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Available Scripts

### Backend

- **`npm run build`**: Compiles TypeScript files.
- **`npm start`**: Runs the compiled JavaScript files.
- **`npm run dev`**: Starts the server with `nodemon` for live reloading.
- **`npm run format`**: Formats the code using Prettier.
- **`npm run type-check`**: Checks TypeScript types.

### Frontend

- **`npm start`**: Runs the app in development mode.
- **`npm run build`**: Builds the app for production.
- **`npm test`**: Launches the test runner.
- **`npm run eject`**: Ejects the app from Create React App configuration.
- **`npm run format`**: Formats the code using Prettier.


