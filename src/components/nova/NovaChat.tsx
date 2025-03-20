import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNova } from '../../contexts/NovaContext';

const NovaChat: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, sendMessage } = useNova();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              message.sender === 'nova'
                ? 'bg-secondary/20 ml-4'
                : 'bg-primary/20 mr-4'
            }`}
          >
            <p>{message.content}</p>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/20 p-4 rounded-lg ml-4"
          >
            <p>Nova is typing...</p>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <label htmlFor="nova-chat-input" className="sr-only">
            Message Nova
          </label>
          <input
            type="text"
            id="nova-chat-input"
            name="nova-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nova anything..."
            className="flex-1 input"
            autoComplete="off"
            aria-label="Chat message"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn btn-primary"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaChat; 