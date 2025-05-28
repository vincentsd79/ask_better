import React, { lazy, Suspense, useEffect } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/Auth/Header';
import { ModeSelection } from './components/ModeSelection/ModeSelection';
import { ModeHeader } from './components/ModeSelection/ModeHeader';
import { LoadingSpinner } from './components/ui';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProfilePage from './components/Auth/ProfilePage.tsx';

import { useAuth } from './hooks/useAuth';
import { useAppState } from './hooks/useAppState';
import { useMode } from './hooks/useMode';
import { ThemeProvider } from './contexts/ThemeContext';
import { aiService } from './services/ai';
import { saveChatHistory } from './services/firebase';

// Lazy load mode components for better performance
const ModeContent = lazy(() => import('./components/ModeContent/ModeContent.tsx'));

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    selectedMode,
    selectedTone,
    setSelectedMode,
    setSelectedTone,
    resetAppState,
  } = useAppState();

  const {
    messages,
    chatVisible,
    refinedOutputs,
    isLoading: conversationLoading,
    error: conversationError,
    userInput,
    handleSubmit,
    handleSendMessage,
    handleReset,
    setUserInput,
  } = useMode(selectedMode || '');

  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => navigate('/profile');
    window.addEventListener('open-profile', handler);
    return () => window.removeEventListener('open-profile', handler);
  }, [navigate]);

  // Handle mode change
  const handleModeChange = () => {
    setSelectedMode(null);
    handleReset();
  };

  // Check if AI service is ready
  const aiReady = aiService.isReady();

  // Loading state during initial auth check
  if (authLoading) {
    return (
      <div className="auth-container">
        <LoadingSpinner message="Loading..." className="auth-loading" />
      </div>
    );
  }

  // Authentication view
  if (!user) {
    return (
      <ErrorBoundary>
        <ThemeToggle />
        <AuthPage />
      </ErrorBoundary>
    );
  }

  // AI service not ready view
  if (!aiReady) {
    return (
      <div className="app-container">
        <ThemeToggle />
        <Header onTitleClick={selectedMode ? handleModeChange : undefined} />
        <div className="auth-form-container">
          <h2 className="section-title">API Key Configuration Required</h2>
          <p>The VITE_GEMINI_API_KEY environment variable is not configured. Please set it up to use the application.</p>
        </div>
      </div>
    );
  }

  // Handle start new session
  const handleStartNew = async () => {
    if (user && messages && messages.length > 0) {
      try {
        await saveChatHistory(user.uid, messages);
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
    handleReset();
    resetAppState();
  };

  return (
    <Routes>
      <Route
        path="/profile"
        element={
          <>
            <ThemeToggle />
            <ProfilePage user={user} />
          </>
        }
      />
      <Route
        path="*"
        element={
          <ErrorBoundary>
            <div className="app-container">
              <ThemeToggle />
              <Header onTitleClick={selectedMode ? handleModeChange : undefined} />

              {/* Mode Selection */}
              {!selectedMode ? (
                <ModeSelection onModeSelect={setSelectedMode} />
              ) : (
                <>
                  {/* Selected Mode Interface */}
                  <ModeHeader
                    selectedMode={selectedMode}
                    selectedTone={selectedTone}
                    onToneChange={setSelectedTone}
                    onModeChange={handleModeChange}
                  />

                  {/* Mode-specific content with lazy loading */}
                  <Suspense fallback={<LoadingSpinner message="Loading mode..." />}>
                    <ModeContent
                      selectedMode={selectedMode}
                      userInput={userInput}
                      onInputChange={setUserInput}
                      onSubmit={handleSubmit}
                      onSendMessage={handleSendMessage}
                      onReset={handleReset}
                      onStartNew={handleStartNew}
                      messages={messages}
                      chatVisible={chatVisible}
                      refinedOutputs={refinedOutputs}
                      isLoading={conversationLoading}
                      error={conversationError}
                    />
                  </Suspense>
                </>
              )}
            </div>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
