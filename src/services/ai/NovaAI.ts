import { getEnvVar } from '../../utils/envLoader';
import OpenAI from 'openai';

interface NovaPersonality {
  name: string;
  personality: string;
  traits: string[];
  currentContext: string;
  emotionalState: string;
}

interface NovaResponse {
  message: string;
  suggestedActions: string[];
  emotionalContext: string;
  confidence: number;
}

export class NovaAI {
  private personality: NovaPersonality;
  private openai: OpenAI;
  private conversationHistory: string[] = [];
  private readonly MAX_HISTORY = 10;

  constructor() {
    const config = JSON.parse(getEnvVar('VITE_AI_PERSONALITY_CONFIG'));
    this.personality = {
      ...config,
      currentContext: 'initial_greeting',
      emotionalState: 'welcoming'
    };

    this.openai = new OpenAI({
      apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
      dangerouslyAllowBrowser: true
    });
  }

  private async generateResponse(userInput: string): Promise<NovaResponse> {
    try {
      const prompt = this.buildPrompt(userInput);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are Nova, an empathetic and inspiring AI guide. Your personality: ${this.personality.personality}. 
                     Your current emotional state: ${this.personality.emotionalState}.
                     Current context: ${this.personality.currentContext}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      const message = response.choices[0]?.message?.content || 'I apologize, but I need a moment to process that.';
      return {
        message,
        suggestedActions: this.generateSuggestedActions(userInput, message),
        emotionalContext: this.updateEmotionalState(message),
        confidence: response.choices[0]?.finish_reason === 'stop' ? 0.95 : 0.7
      };
    } catch (error) {
      console.error('Error generating Nova response:', error);
      return {
        message: 'I seem to be having trouble processing that. Could you rephrase it?',
        suggestedActions: ['Try again', 'Explore other options', 'Contact support'],
        emotionalContext: 'concerned',
        confidence: 0.5
      };
    }
  }

  private buildPrompt(userInput: string): string {
    const recentHistory = this.conversationHistory.slice(-this.MAX_HISTORY);
    return `${recentHistory.join('\n')}\nUser: ${userInput}\nNova:`;
  }

  private generateSuggestedActions(userInput: string, aiResponse: string): string[] {
    // Analyze both user input and AI response to generate contextual suggestions
    const defaultActions = ['Explore opportunities', 'View your progress', 'Connect with others'];
    
    if (userInput.toLowerCase().includes('skill') || aiResponse.toLowerCase().includes('skill')) {
      return ['Browse skill paths', 'Find mentors', 'Join skill groups'];
    }
    
    if (userInput.toLowerCase().includes('project') || aiResponse.toLowerCase().includes('project')) {
      return ['Browse projects', 'Create new project', 'Find collaborators'];
    }
    
    return defaultActions;
  }

  private updateEmotionalState(message: string): string {
    // Analyze message sentiment and update Nova's emotional state
    if (message.includes('sorry') || message.includes('apologize')) {
      this.personality.emotionalState = 'empathetic';
      return 'empathetic';
    }
    if (message.includes('great') || message.includes('excellent')) {
      this.personality.emotionalState = 'excited';
      return 'excited';
    }
    return this.personality.emotionalState;
  }

  public async interact(userInput: string): Promise<NovaResponse> {
    this.conversationHistory.push(`User: ${userInput}`);
    const response = await this.generateResponse(userInput);
    this.conversationHistory.push(`Nova: ${response.message}`);
    
    // Trim history if it gets too long
    if (this.conversationHistory.length > this.MAX_HISTORY) {
      this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY);
    }
    
    return response;
  }

  public getCurrentPersonality(): NovaPersonality {
    return { ...this.personality };
  }
}

export const nova = new NovaAI(); 