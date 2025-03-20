import { useState, useRef, useEffect } from "react";
import { ChatMessage, getChatResponse } from "../services/openai";
import { useAppContext } from "../context/AppContext";

interface ChatBotProps {
  userType: "seeker" | "employer";
  onComplete: () => void;
}

const ChatBot = ({ userType, onComplete }: ChatBotProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chatHistory, addChatMessage } = useAppContext();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Record<string, string> = {
    seeker: "Hi there! I'm here to help you find the perfect opportunity. Tell me about yourself, your skills, interests, and what kind of position you're looking for.",
    employer: "Hello! I'm here to help you find the right candidates. Tell me about your organization, what position you're offering, and what kind of candidates you're looking for.",
  };

  useEffect(() => {
    // Add initial assistant message if chat is empty
    if (chatHistory.length === 0) {
      addChatMessage("assistant", initialMessages[userType]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    addChatMessage("user", input);
    setInput("");
    setIsLoading(true);

    try {
      // Convert chat history to format expected by OpenAI
      const messages: ChatMessage[] = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add current user message
      messages.push({ role: "user", content: input });

      // Add system message based on user type
      const systemMessage: ChatMessage = {
        role: "system",
        content:
          userType === "seeker"
            ? "You are a helpful assistant for job seekers. Ask about their skills, experience, interests, and what they're looking for. Try to gather complete information for a job application in a conversational way. Be friendly and encouraging."
            : "You are a helpful assistant for employers posting jobs. Ask about their organization, the position they're offering, requirements, and other details needed for a complete job posting. Be professional and thorough.",
      };

      // Get response from OpenAI
      const fullMessages = [systemMessage, ...messages];
      const response = await getChatResponse(fullMessages);

      // Add assistant response
      addChatMessage("assistant", response);
    } catch (error) {
      console.error("Error in chat:", error);
      addChatMessage(
        "assistant",
        "I'm having trouble processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[500px]">
      <div className="bg-primary p-4">
        <h3 className="text-white font-bold">
          {userType === "seeker" ? "Job Seeker Chat" : "Employer Chat"}
        </h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`chatbot-bubble ${
                message.role === "user" ? "chatbot-user" : "chatbot-bot"
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-bubble chatbot-bot">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
        <div className="mt-4 flex justify-between">
          <p className="text-xs text-gray-500">
            Tell us about {userType === "seeker" ? "yourself" : "your organization"}
          </p>
          <button
            onClick={onComplete}
            className="text-sm text-primary hover:underline"
            disabled={chatHistory.length < 4}
          >
            Continue to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 