// src/types/chatTypes.ts
export interface ChatMessage {
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
