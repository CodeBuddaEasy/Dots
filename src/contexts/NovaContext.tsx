import React, { createContext, useContext, useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nova';
  timestamp: Date;
}

interface NovaContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const NovaContext = createContext<NovaContextType | undefined>(undefined);

export const useNova = () => {
  const context = useContext(NovaContext);
  if (!context) {
    throw new Error('useNova must be used within a NovaProvider');
  }
  return context;
};

export const NovaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate AI response - Replace with actual AI integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await generateNovaResponse(content);

      const novaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'nova',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, novaMessage]);
    } catch (error) {
      console.error('Error generating Nova response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble processing your request. Please try again later.",
        sender: 'nova',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <NovaContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </NovaContext.Provider>
  );
};

// Temporary function to generate responses - Replace with actual AI integration
const generateNovaResponse = async (userMessage: string): Promise<string> => {
  const greetings = ['hello', 'hi', 'hey', 'greetings'];
  const lowerMessage = userMessage.toLowerCase();

  if (greetings.some(greeting => lowerMessage.includes(greeting))) {
    return "Hello! I'm Nova, your guide in the Dots community. How can I help you today?";
  }

  if (lowerMessage.includes('help')) {
    return "I can help you with various things like finding opportunities, tracking your progress, or learning new skills. What would you like to know more about?";
  }

  if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
    return "I see you're interested in learning! Our skill tree system allows you to track your progress in various areas. Would you like me to explain how it works?";
  }

  if (lowerMessage.includes('achievement')) {
    return "Achievements are a great way to track your progress and get recognized for your contributions. You can view your achievements in the dashboard. Would you like to see your current achievements?";
  }

  return "I understand you're interested in exploring the Dots community. Could you tell me more about what you'd like to know or achieve?";
}; 