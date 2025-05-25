import { useCallback } from 'react';
import { useConversation } from './useConversation';
import { useAppState } from './useAppState';

export const useMode = (modeId: string) => {
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

  const {
    userInput,
    selectedTone,
    setUserInput,
  } = useAppState();

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
    userInput,
    
    // Actions
    handleSubmit,
    handleSendMessage,
    handleReset,
    setUserInput,
  };
};
