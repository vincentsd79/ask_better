import { GoogleGenAI } from "@google/genai";
import { API_MODEL_NAME, CORRECTED_INPUT_PREFIX, BETTER_OUTPUT_PREFIX, BEST_OUTPUT_PREFIX } from '../constants';
import { AIResponse, Message, ModeConfig } from '../types';

export class AIService {
  private aiInstance: GoogleGenAI | null = null;
  private apiKeyExists = false;

  constructor() {
    try {
      this.initializeAI();
    } catch (error) {
      console.error("AI Service initialization failed:", error);
      // Don't throw here - let the app handle the missing API key gracefully
    }
  }

  private initializeAI(): void {
    // Get API key from environment variables (Vite uses import.meta.env)
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    
    console.log("=== AI Service Initialization ===");
    console.log("API Key found:", apiKey ? 'Yes' : 'No');
    console.log("API Key value:", apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
    
    if (apiKey && apiKey.trim()) {
      this.apiKeyExists = true;
      try {
        this.aiInstance = new GoogleGenAI({ apiKey: apiKey });
        console.log("AI instance initialized successfully");
      } catch (error) {
        console.error("Failed to initialize AI:", error);
        throw new Error("Failed to initialize AI instance");
      }
    } else {
      this.apiKeyExists = false;
      console.warn("VITE_GEMINI_API_KEY environment variable is not set");
      // Don't throw here - let isReady() handle this check
    }
  }

  public isReady(): boolean {
    return this.apiKeyExists && this.aiInstance !== null;
  }

  public async generateResponse(
    currentMessage: string,
    conversationHistory: Message[],
    modeConfig: ModeConfig,
    tone: string
  ): Promise<AIResponse> {
    if (!this.isReady()) {
      throw new Error("AI service is not ready. Please check your API key configuration.");
    }

    try {
      const systemInstruction = modeConfig.systemInstruction(tone);
      
      // Build conversation content
      const conversationContent = this.buildConversationContent(
        systemInstruction,
        conversationHistory,
        currentMessage
      );

      console.log("Making AI API call...");
      
      const response = await this.aiInstance!.models.generateContent({
        model: API_MODEL_NAME,
        contents: conversationContent
      });

      const responseText = response.text;
      
      if (!responseText) {
        throw new Error("No response text received from the AI");
      }

      console.log("AI response received");

      // Parse the response based on mode
      return this.parseResponse(responseText, modeConfig.id);

    } catch (error) {
      console.error("Error communicating with AI:", error);
      throw new Error(`AI communication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildConversationContent(
    systemInstruction: string,
    conversationHistory: Message[],
    currentMessage: string
  ): string {
    // For now, use a simple approach
    // In the future, this could be enhanced to properly format conversation history
    let content = `${systemInstruction}\n\n`;
    
    // Add conversation history if it exists
    if (conversationHistory.length > 0) {
      content += "Previous conversation:\n";
      conversationHistory.forEach(msg => {
        content += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      content += "\n";
    }
    
    content += `User: ${currentMessage}`;
    
    return content;
  }

  private parseResponse(responseText: string, modeId: string): AIResponse {
    const result: AIResponse = { text: responseText };

    // Parse outputs based on mode
    if (modeId === 'ASK_BETTER') {
      // Parse corrected, better, and best outputs for ASK_BETTER mode
      const correctedMatch = responseText.match(
        new RegExp(`${CORRECTED_INPUT_PREFIX}\\s*([\\s\\S]*?)(?=${BETTER_OUTPUT_PREFIX}|$)`)
      );
      const betterMatch = responseText.match(
        new RegExp(`${BETTER_OUTPUT_PREFIX}\\s*([\\s\\S]*?)(?=${BEST_OUTPUT_PREFIX}|$)`)
      );
      const bestMatch = responseText.match(
        new RegExp(`${BEST_OUTPUT_PREFIX}\\s*([\\s\\S]*?)$`)
      );

      result.corrected = correctedMatch ? correctedMatch[1].trim() : null;
      result.better = betterMatch ? betterMatch[1].trim() : null;
      result.best = bestMatch ? bestMatch[1].trim() : null;
    } else {
      // Parse better and best outputs for other modes
      const betterMatch = responseText.match(
        new RegExp(`${BETTER_OUTPUT_PREFIX}\\s*([\\s\\S]*?)(?=${BEST_OUTPUT_PREFIX}|$)`)
      );
      const bestMatch = responseText.match(
        new RegExp(`${BEST_OUTPUT_PREFIX}\\s*([\\s\\S]*?)$`)
      );

      result.better = betterMatch ? betterMatch[1].trim() : null;
      result.best = bestMatch ? bestMatch[1].trim() : null;
    }

    return result;
  }
}

// Singleton instance
export const aiService = new AIService();
