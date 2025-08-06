// src/pages/AIAssistantPage.tsx
import React, { useState } from 'react';
import ChatMessageComponent from '../components/ChatMessage';
import { ChatMessage } from '../types/chatTypes';
import { sendMessageToAI } from '../services/openaiService';
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  //🔹 Load messages from sessionStorage on first render
  useEffect(() => {
    const stored = sessionStorage.getItem('aiMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  // 🔹 Save messages to sessionStorage every time they change
  useEffect(() => {
    sessionStorage.setItem('aiMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToAI(input);
      const aiMsg: ChatMessage = {
        sender: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          content: '❌ Failed to get response.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="h-screen bg-zinc-900 text-pink-400 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-2xl font-bold mb-6 text-pink-500 flex items-center gap-2">
  <SiOpenai className="w-6 h-6 text-pink-500" />
  AI Assistant
</h1>
      </div>

      {/* Chat Messages */}
<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
  {messages.map((msg, idx) =>
    msg.sender === 'assistant' ? (
      <div
        key={idx}
        className="bg-zinc-800 text-white p-4 rounded-lg shadow"
      >
        <div className="prose prose-invert max-w-none whitespace-pre-wrap">
          <ReactMarkdown>
            {msg.content}
          </ReactMarkdown>
        </div>
      </div>
    ) : (
      <ChatMessageComponent key={idx} msg={msg} />
    )
  )}
  {loading && (
    <div className="text-gray-400 text-sm">AI is typing...</div>
  )}
</div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-zinc-800 border-t border-zinc-700">
        <div className="flex gap-2">
          
          <input
            type="text"
            className="flex-1 bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
          />
          <button
            onClick={handleSend}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
