import React from 'react';
import { InputForm } from '../components/Chat/InputForm';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { RefinedOutputDisplay } from '../components/Output/RefinedOutputDisplay';
import { ModePageProps } from '../types';
import { MODES } from '../constants';

const PromptBetterPage: React.FC<ModePageProps> = ({
  userInput,
  onInputChange,
  onSubmit,
  onSendMessage,
  onReset,
  onStartNew,
  messages,
  chatVisible,
  refinedOutputs,
  isLoading,
  error,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    onSubmit(userInput);
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isLoading) return;
    onSendMessage(userInput);
  };

  return (
    <>
      <InputForm
        selectedMode={MODES.PROMPT_BETTER.id}
        userInput={userInput}
        onInputChange={onInputChange}
        onSubmit={handleSubmit}
        onReset={onReset}
        isLoading={isLoading}
        error={error}
        showReset={chatVisible}
      />

      {chatVisible && (
        <ChatInterface
          messages={messages}
          userInput={userInput}
          onInputChange={onInputChange}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
        />
      )}

      <RefinedOutputDisplay
        refinedOutputs={refinedOutputs}
        onStartNew={onStartNew}
      />
    </>
  );
};

export default PromptBetterPage;
