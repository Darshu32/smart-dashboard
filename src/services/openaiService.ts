// src/services/openaiService.ts
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const systemMessage: Message = {
  role: 'system',
  content: `You are a helpful assistant. Respond clearly and in a well-structured format using proper punctuation. 
Use full sentences and bullet points or numbered lists where applicable. Always include full stops.`,
};

// Load from localStorage or fallback to default
let chatHistory: Message[] = JSON.parse(localStorage.getItem('chatHistory') || '[]');
if (chatHistory.length === 0) {
  chatHistory.push(systemMessage);
}

export const sendMessageToAI = async (message: string): Promise<string> => {
  chatHistory.push({ role: 'user', content: message });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'HTTP-Referer': 'https://github.com/Darshu32/openAI-chatapp',
      'X-Title': 'openai-react-chat',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: chatHistory,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('❌ API Error:', errText);
    throw new Error(`Failed: ${errText}`);
  }

  const data = await response.json();
  const aiReply = data.choices?.[0]?.message?.content?.trim() || 'No reply';

  chatHistory.push({ role: 'assistant', content: aiReply });

  // ✅ Store updated history
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

  return aiReply;
};

// ✅ Optional: export a way to clear history (e.g., on logout)
export const clearChatHistory = () => {
  chatHistory = [systemMessage];
  localStorage.removeItem('chatHistory');
};
