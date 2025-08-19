// src/pages/AIAssistantPage.tsx
import React, { useState, useEffect } from "react";
import ChatMessageComponent from "../components/ChatMessage";
import { ChatMessage } from "../types/chatTypes";
import { sendMessageToAI } from "../services/openaiService";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import BackButton from "../components/BackButton";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

const STORAGE_KEY = "aiChatMessages";

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load from localStorage first
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(
            parsed.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }))
          );
        }
      }
    } catch (e) {
      console.error("Failed to parse localStorage messages", e);
    }
  }, []);

  // Load from Firestore, but only if it contains messages (otherwise keep localStorage data)
  useEffect(() => {
    const loadFromFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const chatRef = doc(db, "users", user.uid, "data", "aiChat");
        const snap = await getDoc(chatRef);
        if (snap.exists()) {
          const data = snap.data().messages;
          if (Array.isArray(data) && data.length > 0) {
            setMessages(
              data.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              }))
            );
          }
        }
      } catch (err) {
        console.error("Error loading chat from Firestore:", err);
      }
    };
    loadFromFirestore();
  }, []);

  // Save messages to localStorage and Firestore (if logged in)
  useEffect(() => {
    // Always save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save messages to localStorage", e);
    }

    const saveToFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;
      if (messages.length === 0) return;

      try {
        const chatRef = doc(db, "users", user.uid, "data", "aiChat");
        await setDoc(
          chatRef,
          {
            messages: messages.map((m) => ({
              ...m,
              timestamp: m.timestamp.toISOString(),
            })),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error saving chat to Firestore:", err);
      }
    };

    saveToFirestore();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToAI(input);
      const aiMsg: ChatMessage = {
        sender: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          content: "❌ Failed to get response.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };


  return (
    <div className="h-screen bg-zinc-900 text-pink-400 flex flex-col">
  {/* Header */}
  <div className="p-4 border-b border-zinc-700 flex items-center justify-between relative">

    {/* Back Button - top-left */}
    <div className="absolute left-4">
      <BackButton to="/dashboard" />
    </div>

    {/* Title in center */}
    <div className="w-full flex justify-center">
      <h1 className="text-2xl font-bold text-pink-500 flex items-center gap-3">
        <SiOpenai className="w-6 h-6 text-pink-500" />
        AI Assistant
      </h1>
    </div>

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
