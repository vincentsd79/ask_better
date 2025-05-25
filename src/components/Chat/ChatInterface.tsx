import React from 'react';
import { Button, Input, ErrorMessage } from '../ui';
import { Message } from '../../types';

interface ChatInterfaceProps {
  messages: Message[];
  userInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  error: string | null;
}

export const ChatInterface = React.memo<ChatInterfaceProps>(({
  messages,
  userInput,
  onInputChange,
  onSendMessage,
  isLoading,
  error,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="chat-interface">
      <h3 className="section-title">Conversation</h3>
      
      <div className="conversation-area">
        {messages.map(message => (
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
      
      <form onSubmit={handleSubmit} className="input-area">
        <Input
          value={userInput}
          onChange={onInputChange}
          placeholder="Continue the conversation..."
          disabled={isLoading}
          multiline={true}
          rows={2}
        />
        
        <Button 
          type="submit"
          disabled={isLoading || !userInput.trim()}
          variant="primary"
        >
          {isLoading ? 'Processing...' : 'Send'}
        </Button>
      </form>
      
      {error && <ErrorMessage message={error} />}
    </div>
  );
});
