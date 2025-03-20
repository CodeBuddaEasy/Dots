import { createContext, useState, useContext, ReactNode } from "react";

// Types
export type UserType = "seeker" | "employer" | null;

export type FormData = {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  experience?: string;
  availability?: string;
  company?: string;
  position?: string;
  requirements?: string[];
  offerType?: "internship" | "volunteering" | "entry-level" | "other";
  duration?: string;
  compensation?: string;
};

// Context type
type AppContextType = {
  userType: UserType;
  setUserType: (type: UserType) => void;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  chatHistory: { role: "user" | "assistant"; content: string }[];
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  clearChatHistory: () => void;
};

// Default context
const defaultContext: AppContextType = {
  userType: null,
  setUserType: () => {},
  formData: {},
  updateFormData: () => {},
  resetFormData: () => {},
  chatHistory: [],
  addChatMessage: () => {},
  clearChatHistory: () => {},
};

// Create context
const AppContext = createContext<AppContextType>(defaultContext);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  const addChatMessage = (role: "user" | "assistant", content: string) => {
    setChatHistory((prev) => [...prev, { role, content }]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        formData,
        updateFormData,
        resetFormData,
        chatHistory,
        addChatMessage,
        clearChatHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook for using app context
export const useAppContext = () => useContext(AppContext); 