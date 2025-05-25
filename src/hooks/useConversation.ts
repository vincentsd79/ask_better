import { useState, useCallback } from 'react';
import { Message, RefinedOutputs, ConversationState } from '../types';
import { aiService } from '../services/ai';
import { MODES } from '../constants';

export const useConversation = () => {
  const [conversationState, setConversationState] = useState<ConversationState>({
    messages: [],
    visible: false,
    refinedOutputs: { corrected: null, better: null, best: null },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now() + '-' + message.sender,
      timestamp: new Date(),
    };

    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      visible: true,
    }));

    return newMessage;
  }, []);

  const sendMessage = useCallback(async (
    text: string, 
    selectedMode: string, 
    selectedTone: string
  ) => {
    if (!text.trim() || isLoading || !aiService.isReady()) {
      throw new Error('Invalid request state');
    }

    // Clear previous outputs if they exist
    if (conversationState.refinedOutputs.corrected || 
        conversationState.refinedOutputs.better || 
        conversationState.refinedOutputs.best) {
      setConversationState(prev => ({
        ...prev,
        refinedOutputs: { corrected: null, better: null, best: null }
      }));
    }

    // Add user message
    addMessage({ sender: 'user', text });

    setIsLoading(true);
    setError(null);

    try {
      const modeConfig = MODES[selectedMode];
      if (!modeConfig) {
        throw new Error('Invalid mode selected');
      }

      const response = await aiService.generateResponse(
        text,
        conversationState.messages,
        modeConfig,
        selectedTone
      );

      // Create AI response message
      let aiMessageText = response.text;
      
      // Handle refined outputs
      const refinedOutputs: RefinedOutputs = {
        corrected: response.corrected || null,
        better: response.better || null,
        best: response.best || null,
      };

      // Update refined outputs if any exist
      if (refinedOutputs.better || refinedOutputs.best || refinedOutputs.corrected) {
        setConversationState(prev => ({
          ...prev,
          refinedOutputs,
        }));

        // For ASK_BETTER mode, format the message to show the refined outputs
        if (selectedMode === 'ASK_BETTER' && refinedOutputs.corrected) {
          aiMessageText = `Here are your refined messages:\n\n**Corrected Input:**\n${refinedOutputs.corrected}\n\n**Better Version:**\n${refinedOutputs.better}\n\n**Best Version:**\n${refinedOutputs.best}`;
        }
      }

      // Add AI response message
      addMessage({ sender: 'ai', text: aiMessageText });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Add error message to conversation
      addMessage({ 
        sender: 'ai', 
        text: `Sorry, I encountered an error: ${errorMessage}` 
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversationState.messages, conversationState.refinedOutputs, isLoading, addMessage]);

  const resetConversation = useCallback(() => {
    setConversationState({
      messages: [],
      visible: false,
      refinedOutputs: { corrected: null, better: null, best: null },
    });
    setError(null);
  }, []);

  return {
    messages: conversationState.messages,
    visible: conversationState.visible,
    refinedOutputs: conversationState.refinedOutputs,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    clearError: () => setError(null),
  };
};
