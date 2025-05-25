import { useState, useCallback } from 'react';
import { AppState } from '../types';
import { TONE_OPTIONS } from '../constants';

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>({
    selectedMode: null,
    selectedTone: TONE_OPTIONS[0].value,
    userInput: '',
  });

  const setSelectedMode = useCallback((mode: string | null) => {
    setAppState(prev => ({ ...prev, selectedMode: mode }));
  }, []);

  const setSelectedTone = useCallback((tone: string) => {
    setAppState(prev => ({ ...prev, selectedTone: tone }));
  }, []);

  const setUserInput = useCallback((input: string) => {
    setAppState(prev => ({ ...prev, userInput: input }));
  }, []);

  const resetAppState = useCallback(() => {
    setAppState({
      selectedMode: null,
      selectedTone: TONE_OPTIONS[0].value,
      userInput: '',
    });
  }, []);

  return {
    ...appState,
    setSelectedMode,
    setSelectedTone,
    setUserInput,
    resetAppState,
  };
};
