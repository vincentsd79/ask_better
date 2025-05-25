import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../ui';
import { ModeContentProps } from '../../types';
import { MODES } from '../../constants';

// Lazy load individual mode pages for better performance
const PromptBetterPage = lazy(() => import('../../pages/PromptBetterPage'));
const AskBetterPage = lazy(() => import('../../pages/AskBetterPage.tsx'));
const CodingModePage = lazy(() => import('../../pages/CodingModePage.tsx'));
const Marketing101Page = lazy(() => import('../../pages/Marketing101Page.tsx'));

const ModeContent: React.FC<ModeContentProps> = ({
  selectedMode,
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
  // Validate mode exists
  if (!selectedMode || !MODES[selectedMode]) {
    return (
      <div className="mode-content">
        <div className="error-message">
          Invalid mode selected. Please go back and select a valid mode.
        </div>
      </div>
    );
  }

  // Common props for all mode pages
  const modePageProps = {
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
  };

  // Render the appropriate mode component
  const renderModeComponent = () => {
    switch (selectedMode) {
      case 'PROMPT_BETTER':
        return <PromptBetterPage {...modePageProps} />;
      case 'ASK_BETTER':
        return <AskBetterPage {...modePageProps} />;
      case 'CODING_MODE':
        return <CodingModePage {...modePageProps} />;
      case 'MARKETING_101':
        return <Marketing101Page {...modePageProps} />;
      default:
        return (
          <div className="error-message">
            Mode "{selectedMode}" is not yet implemented.
          </div>
        );
    }
  };

  return (
    <div className="mode-content">
      <Suspense fallback={<LoadingSpinner message={`Loading ${MODES[selectedMode]?.displayName}...`} />}>
        {renderModeComponent()}
      </Suspense>
    </div>
  );
};

export default ModeContent;
