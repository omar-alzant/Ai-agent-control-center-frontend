"use client";
import { useEffect, useRef, useState } from 'react';
import { api } from "../lib/api"; // Centralized API client

export function ChatInterface({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await api.getChatHistory(agentId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [agentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const data = await api.sendMessage(agentId, input);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-zinc-500">Loading conversation...</div>;

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-zinc-800 flex gap-2">
        <input 
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-600 px-6 py-2 rounded-lg font-medium">Send</button>
      </div>
    </div>
  );
}