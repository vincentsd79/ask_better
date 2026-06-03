import { useCallback } from 'react';
import { useConversation } from './useConversation';

export const useMode = (
  modeId: string,
  selectedTone: string,
  setUserInput: (input: string) => void
) => {
  const {
    messages,
    visible: chatVisible,
    refinedOutputs,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    clearError,
  } = useConversation();

  const handleSubmit = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    try {
      await sendMessage(input, modeId, selectedTone);
      setUserInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [isLoading, sendMessage, modeId, selectedTone, setUserInput]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    try {
      await sendMessage(message, modeId, selectedTone);
      setUserInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [isLoading, sendMessage, modeId, selectedTone, setUserInput]);

  const handleReset = useCallback(() => {
    resetConversation();
    clearError();
  }, [resetConversation, clearError]);

  return {
    // State
    messages,
    chatVisible,
    refinedOutputs,
    isLoading,
    error,
    
    // Actions
    handleSubmit,
    handleSendMessage,
    handleReset,
  };
};
