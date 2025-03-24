'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

const INITIAL_MESSAGE: Message = {
  role: 'system',
  content: 'Welcome to Covera Digital AI\n\nAsk questions about policies, claims, or get quotes for your insurance needs.',
  timestamp: new Date(),
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, { ...data, timestamp: new Date() }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Message */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome to Covera Digital AI</h2>
          <p className="text-gray-600 max-w-md">
            Ask questions about policies, claims, or get quotes for your insurance needs.
          </p>
        </div>

        {/* Document Processing Section */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">OCR Document Processing</h3>
          <p className="text-gray-600 max-w-md mb-4">
            Upload insurance documents to extract and analyze text automatically.
          </p>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Scan Document
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.slice(1).map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                } rounded-lg px-4 py-2`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              📎
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
} 