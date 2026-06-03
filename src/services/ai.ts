import { CORRECTED_INPUT_PREFIX, BETTER_OUTPUT_PREFIX, BEST_OUTPUT_PREFIX } from '../constants';
import { auth } from './firebase';
import { AIResponse, Message, ModeConfig } from '../types';

export class AIService {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = (import.meta as any).env?.VITE_AI_ENDPOINT?.trim() || '/api/generate';
  }

  public isReady(): boolean {
    return Boolean(this.endpoint);
  }

  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Please sign in again before using the AI service.");
    }
    return user.getIdToken();
  }

  public async generateResponse(
    currentMessage: string,
    conversationHistory: Message[],
    modeConfig: ModeConfig,
    tone: string
  ): Promise<AIResponse> {
    if (!this.isReady()) {
      throw new Error("AI service is not ready. Please check the backend endpoint configuration.");
    }

    try {
      const systemInstruction = modeConfig.systemInstruction(tone);

      console.log("Making AI API call...");
      const idToken = await this.getAuthToken();
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMessage,
          conversationHistory,
          systemInstruction,
          modeId: modeConfig.id,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = payload?.error || "AI request failed";
        throw new Error(message);
      }

      const responseText = payload?.text;
      
      if (!responseText || typeof responseText !== 'string') {
        throw new Error("No response text received from the AI");
      }
      // Parse the response based on mode
      return this.parseResponse(responseText, modeConfig.id);

    } catch (error) {
      console.error("Error communicating with AI:", error);
      throw new Error(`AI communication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
