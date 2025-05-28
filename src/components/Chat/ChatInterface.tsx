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

  const handleEnterPress = () => {
    onSendMessage();
  };

  const formatTime = (timestamp?: Date) => {
    if (!timestamp) return '';
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-interface-modern">
      <div className="chat-header">
        <h3 className="chat-title">Conversation</h3>
        <span className="message-count">{messages.length} messages</span>
      </div>
      
      <div className="conversation-container">
        <div className="messages-list">
          {messages.map((message, index) => (
            <div 
              key={message.id}
              className={`message-wrapper ${message.sender}`}
            >
              <div className={`message-bubble ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                </div>
                                 <div className="message-meta">
                   <span className="message-time">
                     {formatTime(message.timestamp || new Date())}
                   </span>
                 </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-wrapper ai">
              <div className="message-bubble ai typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>AI is thinking...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <Input
              value={userInput}
              onChange={onInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              multiline={true}
              rows={1}
              className="chat-input"
              onEnterPress={handleEnterPress}
            />
            <Button 
              type="submit"
              disabled={isLoading || !userInput.trim()}
              variant="primary"
              className="send-button"
            >
              {isLoading ? '⏳' : '📤'}
            </Button>
          </div>
        </form>
        
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
});
