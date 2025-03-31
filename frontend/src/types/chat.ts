export interface Message {
  id: string;
  timestamp: Date;
}

export interface UserMessage extends Message {
  content: string;
  role: 'user';
}

interface SearchResult {
  title: string;
  excerpt: string;
  image: {
    alt: string;
    src: string;
  };
  url: string;
  categories: (string | null)[];
  objectID: string;
}

export interface SearchResultsProps {
  results: SearchResult[];
}

export interface BotMessage extends Message {
  content: string | { message: string; articles: SearchResult[] };
  role: 'assistant';
}

export interface ChatState {
  messages: (BotMessage | UserMessage)[];
  isLoading: boolean;
  error: string | null;
}
