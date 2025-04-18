import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ChatBot from "../components/ChatBot";
import EmployerForm from "../components/EmployerForm";
import { extractFormData } from "../services/openai";
import { ChatMessage } from "../services/openai";

const EmployerRegistration = () => {
  const [stage, setStage] = useState<"chat" | "form">("chat");
  const [isProcessing, setIsProcessing] = useState(false);
  const { setUserType, chatHistory, updateFormData } = useAppContext();

  // Set user type on component mount
  useEffect(() => {
    setUserType("employer");
  }, []);

  const handleChatComplete = async () => {
    setIsProcessing(true);
    
    try {
      // Convert chat history to format expected by OpenAI
      const messages: ChatMessage[] = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Extract form data from chat
      const extractedData = await extractFormData("employer", messages);
      
      // Update form data with extracted information
      updateFormData(extractedData);
      
      // Move to form stage
      setStage("form");
    } catch (error) {
      console.error("Error processing chat data:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Post an Opportunity</h1>
        <p className="text-base-content/80">
          Tell us about your organization and the opportunity you're offering to find the right candidates.
        </p>
      </div>

      {isProcessing ? (
        <div className="glass card p-8 text-center">
          <div className="card-body items-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-base-content/80">Processing your information...</p>
          </div>
        </div>
      ) : stage === "chat" ? (
        <ChatBot userType="employer" onComplete={handleChatComplete} />
      ) : (
        <EmployerForm />
      )}

      {stage === "chat" && (
        <div className="mt-8 text-center">
          <p className="text-sm text-base-content/60">
            Chat with our assistant to describe the opportunity, or{" "}
            <button
              onClick={() => setStage("form")}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              skip to the form
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployerRegistration; 