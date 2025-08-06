// src/components/ChatMessage.tsx
import React from 'react';
import { ChatMessage } from '../types/chatTypes';
import ReactMarkdown from 'react-markdown';

const ChatMessageComponent: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs whitespace-pre-wrap ${
          isUser ? 'bg-pink-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
