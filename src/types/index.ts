// Types and interfaces for the Ask Better application

export interface ToneOption {
  value: string;
  label: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

export interface RefinedOutputs {
  corrected: string | null;
  better: string | null;
  best: string | null;
}

export interface ModeConfig {
  id: string;
  displayName: string;
  description: string;
  inputPlaceholder: string;
  systemInstruction: (tone: string) => string;
}

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

export interface AIState {
  loading: boolean;
  error: string | null;
  apiKeyExists: boolean;
}

export interface ConversationState {
  messages: Message[];
  visible: boolean;
  refinedOutputs: RefinedOutputs;
}

export interface AppState {
  selectedMode: string | null;
  selectedTone: string;
  userInput: string;
}

// API Response types
export interface AIResponse {
  text: string;
  corrected?: string | null;
  better?: string | null;
  best?: string | null;
}

// Component Props
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ModeContentProps {
  selectedMode: string;
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (input: string) => void;
  onSendMessage: (message: string) => void;
  onReset: () => void;
  onStartNew: () => void;
  messages: Message[];
  chatVisible: boolean;
  refinedOutputs: RefinedOutputs;
  isLoading: boolean;
  error: string | null;
}

export interface ModePageProps {
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (input: string) => void;
  onSendMessage: (message: string) => void;
  onReset: () => void;
  onStartNew: () => void;
  messages: Message[];
  chatVisible: boolean;
  refinedOutputs: RefinedOutputs;
  isLoading: boolean;
  error: string | null;
}
