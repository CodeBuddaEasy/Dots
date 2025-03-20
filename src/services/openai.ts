import OpenAI from "openai";
import { FormData } from "../context/AppContext";
import { getEnvVar } from "../utils/envLoader";

// For debugging: Output environment variable existence
console.log("API Key value from import.meta.env:", import.meta.env.VITE_OPENAI_API_KEY ? "Key exists" : "Key is missing");

// Get the API key from our custom environment loader
const apiKey = getEnvVar('VITE_OPENAI_API_KEY');
console.log("API Key from custom loader:", apiKey ? "Key loaded successfully" : "Key still missing");

if (!apiKey) {
  console.error("============================================");
  console.error("OpenAI API key is missing from all sources.");
  console.error("Make sure the .env file contains VITE_OPENAI_API_KEY");
  console.error("============================================");
}

// Initialize OpenAI client with fallback for development
let openai: OpenAI;

try {
  openai = new OpenAI({
    apiKey: apiKey || "dummy-key-for-development",
    dangerouslyAllowBrowser: true // Only for demo purposes
  });
  console.log("OpenAI client initialized successfully");
} catch (error) {
  console.error("Error initializing OpenAI client:", error);
  // Create a mock instance as fallback
  openai = {
    chat: {
      completions: {
        create: async () => {
          console.error("Using mock OpenAI client - API key is missing");
          return {
            choices: [{ message: { content: "API key is missing. Mock response." } }]
          };
        }
      }
    }
  } as unknown as OpenAI;
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// Function to get chatbot response
export const getChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};

// Process user input and extract form data
export const extractFormData = async (
  userType: "seeker" | "employer",
  chatHistory: ChatMessage[]
): Promise<Partial<FormData>> => {
  try {
    const systemPrompt = userType === "seeker" 
      ? "Extract information from the job seeker's conversation to fill a job application form. Extract name, email, phone, skills, interests, experience, location, and availability if mentioned."
      : "Extract information from the employer's conversation to fill a job posting form. Extract company name, position, description, requirements, location, offer type (internship/volunteering/entry-level), duration, and compensation if mentioned.";
    
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { 
        role: "user", 
        content: "Please extract the relevant information from our conversation in JSON format. Only include fields that were mentioned."
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as Partial<FormData>;
  } catch (error) {
    console.error("Error extracting form data:", error);
    return {};
  }
};

// Generate embeddings for a text string
export const generateEmbedding = async (text: string): Promise<number[] | null> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

// Combine and prepare text for embedding generation
export const prepareSeeker = (seeker: any): string => {
  const skills = seeker.skills || '';
  const interests = seeker.interests || '';
  const experience = seeker.experience || '';
  
  return `Skills: ${skills}. Interests: ${interests}. Experience: ${experience}`.trim();
};

export const prepareListing = (listing: any): string => {
  const position = listing.position || '';
  const description = listing.description || '';
  const requirements = listing.requirements || '';
  
  return `Position: ${position}. Description: ${description}. Requirements: ${requirements}`.trim();
};

// Calculate similarity between two embeddings using cosine similarity
export const calculateCosineSimilarity = (embedding1: number[], embedding2: number[]): number => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    return 0;
  }

  // Calculate dot product
  const dotProduct = embedding1.reduce((sum, value, i) => sum + value * embedding2[i], 0);
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, value) => sum + value * value, 0));
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  // Return cosine similarity (range -1 to 1, higher is more similar)
  return dotProduct / (magnitude1 * magnitude2);
};

// Normalize similarity to a percentage
export const similarityToPercentage = (similarity: number): number => {
  // Convert from range [-1, 1] to [0, 100]
  return Math.round(((similarity + 1) / 2) * 100);
}; 