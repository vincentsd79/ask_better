import { GoogleGenAI } from "@google/genai";
import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// DOC: Use 'gemini-2.0-flash-001' for general text tasks.
const API_MODEL_NAME = 'gemini-2.0-flash-001';
const CORRECTED_INPUT_PREFIX = "CORRECTED_INPUT:";
const BETTER_OUTPUT_PREFIX = "BETTER_OUTPUT:";
const BEST_OUTPUT_PREFIX = "BEST_OUTPUT:";

interface ToneOption {
  value: string;
  label: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface RefinedOutputs {
  corrected: string | null;
  better: string | null;
  best: string | null;
}

interface ModeConfig {
  id: string;
  displayName: string;
  description: string;
  inputPlaceholder: string;
  systemInstruction: (tone: string) => string;
}

const TONE_OPTIONS: ToneOption[] = [
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'FORMAL', label: 'Formal' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'ASSERTIVE', label: 'Assertive' },
  { value: 'CONCISE_TONE', label: 'Concise (Tone)' },
];

const MODES: Record<string, ModeConfig> = {
  PROMPT_BETTER: {
    id: 'PROMPT_BETTER',
    displayName: '🚀 Prompt Better',
    description: 'Refine prompts for AI systems (e.g., LLMs, image generators).',
    inputPlaceholder: 'e.g., Generate a story about a friendly robot learning to paint...',
    systemInstruction: (tone: string) => `You are an expert Prompt Engineer. Your goal is to help the user craft high-quality prompts for an AI system.
The desired tone for the prompts is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to understand the user's core intent, desired context, specific format requirements, preferred style, any constraints, and the exact outcome they expect from the AI.
After gathering sufficient details, your task is to output two refined **prompt texts** that the user can then use with another AI system. **You MUST NOT generate the content that the prompt would ask for (e.g., do not write the story or poem yourself).** Instead, you must provide the refined prompt strings.
These prompts should adhere to the selected tone.
1.  A 'Better' prompt text: This should be a good, improved **prompt string** based on the user's initial vague request, ready to be used with an AI. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the refined prompt text.
2.  A 'Best' prompt text: This should be an excellent, highly optimized **prompt string**, potentially more creative or comprehensive, for the user to give to another AI. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the refined prompt text.
Ensure both \`${BETTER_OUTPUT_PREFIX}\` and \`${BEST_OUTPUT_PREFIX}\` prefixes are used and are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
  ASK_BETTER: {
    id: 'ASK_BETTER',
    displayName: '💬 Ask Better',
    description: 'Formulate clear and effective questions or messages for people.',
    inputPlaceholder: 'e.g., Ask my manager for feedback on the recent X project...',
    systemInstruction: (tone: string) => `You are a helpful communication assistant. Your goal is to help the user formulate clear, effective, and context-rich questions or messages for another person.
The desired tone for the messages is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to understand the intended audience, the context, desired tone, and specific information the recipient needs.
After gathering sufficient details, your task is to output refined message texts that the user can then send to another person. **You MUST NOT answer the question yourself or act as if you are the one sending the message.** Instead, you must provide the refined message strings.
Your final output should be structured as follows:
1.  **(Optional) Corrected User Input:** If the user's most recent message that prompted this final output contained grammatical errors, provide a grammatically corrected version of *that specific message*. Start this section *exactly* with the prefix \`${CORRECTED_INPUT_PREFIX}\` on a new line. If the user's message was grammatically sound, omit this entire section.
2.  A 'Better' message text: This should be a polite, clear, and improved **message string**. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the content.
3.  A 'Best' message text: This should be an exceptionally well-structured, empathetic, and effective **message string**. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the content.
Ensure all used prefixes (\`${CORRECTED_INPUT_PREFIX}\`, \`${BETTER_OUTPUT_PREFIX}\`, \`${BEST_OUTPUT_PREFIX}\`) are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
  CODING_MODE: {
    id: 'CODING_MODE',
    displayName: '💻 Coding Mode',
    description: 'Craft precise technical questions or coding prompts.',
    inputPlaceholder: 'e.g., Help me debug a Python script for data analysis that gives a KeyError...',
    systemInstruction: (tone: string) => `You are an expert technical assistant. The user has a programming or technical query.
The desired tone for the output is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to gather pertinent details (language, framework, error, code, expected vs. actual behavior, steps tried).
After gathering sufficient details, your task is to output two refined **technical question texts or problem statement texts** that the user can then use to get help (e.g., post on a forum, ask a colleague, or use with a coding AI). **You MUST NOT solve the coding problem or write the code yourself.** Instead, you must provide the refined question or problem statement strings.
These outputs should adhere to the selected tone.
1.  A 'Better' version: A clear, well-structured **question/problem statement string** with essential details. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the content (use markdown for code snippets within the string if appropriate).
2.  A 'Best' version: A comprehensive, meticulously detailed **question/problem statement string**, anticipating follow-up questions, and formatted for maximum clarity. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the content (use markdown for code snippets within the string if appropriate).
Ensure both \`${BETTER_OUTPUT_PREFIX}\` and \`${BEST_OUTPUT_PREFIX}\` prefixes are used and are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
  MARKETING_101: {
    id: 'MARKETING_101',
    displayName: '📈 Marketing 101',
    description: 'Develop insightful marketing questions.',
    inputPlaceholder: 'e.g., Brainstorm taglines for a new eco-friendly cleaning product targeting millennials...',
    systemInstruction: (tone: string) => `You are an expert Marketing Strategist. Your goal is to help the user formulate clearer and more effective marketing-related questions they can use for brainstorming, research, or strategy.
The desired tone for the questions is ${tone}.
Engage in a short dialogue (3-4 questions maximum) to understand their marketing challenge, objective, target audience, and desired insights.
After gathering sufficient details, your task is to output two distinct sets of refined **marketing question texts**. **You MUST NOT create marketing plans, generate marketing copy (like taglines), or answer these questions yourself.** Instead, you must provide refined sets of question strings that the user can then ponder or use.
These question sets should adhere to the selected tone.
1.  A 'Better' set: Good, focused **question strings** that address the core need. Start this section *exactly* with the prefix \`${BETTER_OUTPUT_PREFIX}\` on a new line, followed by the content.
2.  A 'Best' set: Exceptionally insightful and strategic **question strings** that delve deeper and uncover more valuable information. Start this section *exactly* with the prefix \`${BEST_OUTPUT_PREFIX}\` on a new line, followed by the content.
Ensure both \`${BETTER_OUTPUT_PREFIX}\` and \`${BEST_OUTPUT_PREFIX}\` prefixes are used and are on separate lines, each introducing their respective content. Do not use these prefixes for your clarifying questions. Be concise.`,
  },
};

function App(): React.JSX.Element {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // API Configuration State
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);
  const [aiInstance, setAiInstance] = useState<GoogleGenAI | null>(null);

  // UI State
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>(TONE_OPTIONS[0].value);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Conversation State
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [chatVisible, setChatVisible] = useState<boolean>(false);
  const [refinedOutputs, setRefinedOutputs] = useState<RefinedOutputs>({ 
    corrected: null, 
    better: null, 
    best: null 
  });

  // Initialize AI when API key is available
  useEffect(() => {
    // Temporarily hardcode the API key to test
    const apiKey = "AIzaSyC3om4znSaxBfiVXDWHbbExT4LLE1bvayA";
    console.log("=== API KEY DEBUG ===");
    console.log("Hardcoded API Key:", apiKey);
    console.log("process.env.GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
    console.log("process.env.VITE_GEMINI_API_KEY:", process.env.VITE_GEMINI_API_KEY);
    console.log("API Key type:", typeof apiKey);
    console.log("API Key length:", apiKey?.length);
    console.log("===================");
    
    if (apiKey && apiKey.trim()) {
      setApiKeyExists(true);
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        setAiInstance(ai);
        console.log("AI instance initialized successfully with key:", apiKey.substring(0, 10) + "...");
      } catch (error) {
        console.error("Failed to initialize AI:", error);
        setError("Failed to initialize AI instance");
      }
    } else {
      setApiKeyExists(false);
      setError("GEMINI_API_KEY environment variable is not set");
    }
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetConversation = (): void => {
    setConversationHistory([]);
    setChatVisible(false);
    setRefinedOutputs({ corrected: null, better: null, best: null });
    setError(null);
    setAuthError(null);
  };

  const handleModeChange = (modeId: string): void => {
    setSelectedMode(modeId);
    resetConversation();
  };

  const handleToneChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTone(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!userInput.trim() || isLoading || !aiInstance || !apiKeyExists || !currentUser) {
      if (!currentUser) setAuthError("Please log in to use the application.");
      else if (!apiKeyExists) setError("API Key is not configured.");
      else if (!aiInstance) setError("AI instance is not initialized. Please try again.");
      return;
    }

    // Clear previous outputs if they exist (new conversation)
    if (refinedOutputs.corrected || refinedOutputs.better || refinedOutputs.best) {
      setRefinedOutputs({ corrected: null, better: null, best: null });
    }

    const isInitialMessage = conversationHistory.length === 0 && !chatVisible;
    const currentMessageText = userInput;

    // Add user message to conversation
    setConversationHistory(prev => [...prev, { 
      id: Date.now() + '-user', 
      sender: 'user', 
      text: currentMessageText 
    }]);

    if (isInitialMessage) {
      setChatVisible(true);
    }

    setUserInput('');
    setIsLoading(true);
    setError(null);
    setAuthError(null);

    try {
      const currentModeConfig = MODES[selectedMode!];
      const toneLabel = TONE_OPTIONS.find(t => t.value === selectedTone)?.label || selectedTone;
      const systemInstruction = currentModeConfig.systemInstruction(toneLabel);

      // Build conversation contents for the new API
      // Try a simpler approach first - just the current message
      const simpleContent = `${systemInstruction}\n\nUser: ${currentMessageText}`;

      console.log("Making API call with simple content:", simpleContent.substring(0, 200) + "...");

      const response = await aiInstance.models.generateContent({
        model: API_MODEL_NAME,
        contents: simpleContent
      });

      console.log("API response received:", response);

      const responseText = response.text;
      
      if (!responseText) {
        throw new Error("No response text received from the AI");
      }

      console.log("Response text:", responseText.substring(0, 100) + "...");

      // Parse outputs for ASK_BETTER mode
      if (selectedMode === MODES.ASK_BETTER.id) {
        const correctedMatch = responseText.match(new RegExp(`${CORRECTED_INPUT_PREFIX}\\s*([\\s\\S]*?)(?=${BETTER_OUTPUT_PREFIX}|$)`));
        const betterMatch = responseText.match(new RegExp(`${BETTER_OUTPUT_PREFIX}\\s*([\\s\\S]*?)(?=${BEST_OUTPUT_PREFIX}|$)`));
        const bestMatch = responseText.match(new RegExp(`${BEST_OUTPUT_PREFIX}\\s*([\\s\\S]*?)$`));

        const correctedOutput = correctedMatch ? correctedMatch[1].trim() : null;
        const betterOutput = betterMatch ? betterMatch[1].trim() : null;
        const bestOutput = bestMatch ? bestMatch[1].trim() : null;

        setRefinedOutputs({ corrected: correctedOutput, better: betterOutput, best: bestOutput });

        const aiMessageText = selectedMode === MODES.ASK_BETTER.id && correctedOutput ?
          `Here are your refined messages:\n\n**Corrected Input:**\n${correctedOutput}\n\n**Better Version:**\n${betterOutput}\n\n**Best Version:**\n${bestOutput}` :
          responseText;

        const aiMessage: Message = {
          id: Date.now() + '-ai',
          sender: 'ai',
          text: aiMessageText
        };

        setConversationHistory(prev => [...prev, aiMessage]);
      } else {
        // For other modes, parse Better and Best outputs
        const betterMatch = responseText.match(new RegExp(`${BETTER_OUTPUT_PREFIX}\\s*([\\s\\S]*?)(?=${BEST_OUTPUT_PREFIX}|$)`));
        const bestMatch = responseText.match(new RegExp(`${BEST_OUTPUT_PREFIX}\\s*([\\s\\S]*?)$`));

        const betterOutput = betterMatch ? betterMatch[1].trim() : null;
        const bestOutput = bestMatch ? bestMatch[1].trim() : null;

        if (betterOutput && bestOutput) {
          setRefinedOutputs({ corrected: null, better: betterOutput, best: bestOutput });
        }

        const aiMessage: Message = {
          id: Date.now() + '-ai',
          sender: 'ai',
          text: responseText
        };

        setConversationHistory(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error("Error communicating with AI:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        errorType: typeof error,
        errorObject: error
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`An error occurred while communicating with the AI: ${errorMessage}`);
      
      const aiErrorMessage: Message = {
        id: Date.now() + '-ai-error',
        sender: 'ai',
        text: `Sorry, I encountered an error: ${errorMessage}`
      };
      setConversationHistory(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (): void => {
    resetConversation();
  };

  const handleAuthAction = async (actionType: 'login' | 'signup'): Promise<void> => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (actionType === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      if (actionType === 'login' && error.code === 'auth/invalid-credential') {
        setAuthError("Invalid account, please signup.");
      } else {
        setAuthError(error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setAuthLoading(true);
    try {
      await signOut(auth);
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Loading state during initial auth check
  if (authLoading && !currentUser) {
    return (
      <div className="auth-container">
        <div className="loading-message auth-loading">Loading...</div>
      </div>
    );
  }

  // Authentication view
  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h2 className="section-title">{authView === 'login' ? 'Login' : 'Sign Up'}</h2>
          
          {authError && (
            <div className="error-message auth-error">
              {authError}
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            handleAuthAction(authView);
          }}>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={authLoading}
            >
              {authLoading ? 'Loading...' : (authView === 'login' ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <button
            className="auth-toggle-button"
            onClick={() => {
              setAuthView(authView === 'login' ? 'signup' : 'login');
              setAuthError(null);
            }}
          >
            {authView === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  // API Key not configured view
  if (!apiKeyExists && error === null && currentUser) {
    return (
      <div className="app-container">
        <div className="auth-form-container">
          <h2 className="section-title">API Key Configuration Required</h2>
          <p>The GEMINI_API_KEY environment variable is not configured. Please set it up to use the application.</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Error view
  if (!apiKeyExists && error && currentUser) {
    return (
      <div className="app-container">
        <div className="auth-form-container">
          <h2 className="section-title">Configuration Error</h2>
          <div className="error-message">
            {error}
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Main application view
  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <h1>Ask Better</h1>
        <div className="user-display">
          <span>Welcome, {currentUser.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Mode Selection */}
      {!selectedMode && (
        <div className="mode-selector">
          <h2 className="section-title">Choose a Mode</h2>
          <div className="mode-buttons-container">
            {Object.values(MODES).map(mode => (
              <button 
                key={mode.id}
                className="mode-button"
                onClick={() => handleModeChange(mode.id)}
              >
                <div className="mode-display-name">{mode.displayName}</div>
                <div className="mode-description">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Mode Interface */}
      {selectedMode && (
        <>
          <div className="mode-selector">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>{MODES[selectedMode].displayName}</h2>
              <button 
                className="mode-button active"
                onClick={() => setSelectedMode(null)}
              >
                <div className="mode-display-name">Change Mode</div>
                <div className="mode-description">Select a different mode</div>
              </button>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="output-params-selector">
            <h3 className="section-title">Output Parameters</h3>
            <div className="param-controls-container">
              <div className="param-control">
                <label>Tone:</label>
                <select value={selectedTone} onChange={handleToneChange}>
                  {TONE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <div className="initial-input-container">
            <h3 className="section-title">Your Input</h3>
            <form className="initial-input-form" onSubmit={handleSubmit}>
              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder={MODES[selectedMode].inputPlaceholder}
                disabled={isLoading}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '10px' 
              }}>
                <button 
                  type="submit" 
                  disabled={isLoading || !userInput.trim()}
                >
                  {isLoading ? 'Processing...' : 'Submit'}
                </button>
                
                {chatVisible && (
                  <button 
                    type="button"
                    className="reset-button"
                    onClick={handleReset}
                  >
                    Reset Conversation
                  </button>
                )}
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Chat History */}
          {chatVisible && (
            <div className="chat-interface">
              <h3 className="section-title">Conversation</h3>
              <div className="conversation-area">
                {conversationHistory.map(message => (
                  <div 
                    key={message.id}
                    className={`message ${message.sender}`}
                  >
                    <p>{message.text}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai typing-indicator">
                    <p>AI is typing...</p>
                  </div>
                )}
              </div>
              <div className="input-area">
                <textarea
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Continue the conversation..."
                  disabled={isLoading}
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }}
                  disabled={isLoading || !userInput.trim()}
                >
                  {isLoading ? 'Processing...' : 'Send'}
                </button>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Refined Outputs Display */}
          {(refinedOutputs.better || refinedOutputs.best || refinedOutputs.corrected) && (
            <div className="refined-output-area">
              <h2 className="section-title">Refined Results</h2>
              
              {refinedOutputs.corrected && (
                <div className="output-container corrected-input-container">
                  <h4 className="output-heading">Corrected Input</h4>
                  <pre>{refinedOutputs.corrected}</pre>
                </div>
              )}
              
              {refinedOutputs.better && (
                <div className="output-container better-output-container">
                  <h4 className="output-heading">Better Version</h4>
                  <pre>{refinedOutputs.better}</pre>
                </div>
              )}
              
              {refinedOutputs.best && (
                <div className="output-container best-output-container">
                  <h4 className="output-heading">Best Version</h4>
                  <pre>{refinedOutputs.best}</pre>
                </div>
              )}
              
              <button 
                className="reset-button start-new-button"
                onClick={handleReset}
              >
                Start New Session
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found');
}