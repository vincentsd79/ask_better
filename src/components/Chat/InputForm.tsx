import React from 'react';
import { Button, Input, ErrorMessage } from '../ui';
import { MODES } from '../../constants';

interface InputFormProps {
  selectedMode: string;
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
  error: string | null;
  showReset: boolean;
  sectionTitle?: string;
}

export const InputForm = React.memo<InputFormProps>(({
  selectedMode,
  userInput,
  onInputChange,
  onSubmit,
  onReset,
  isLoading,
  error,
  showReset,
  sectionTitle = 'Your Input',
}) => {
  const currentMode = MODES[selectedMode];

  return (
    <div className="initial-input-container">
      <h3 className="section-title">{sectionTitle}</h3>
      <form className="initial-input-form" onSubmit={onSubmit}>
        <Input
          value={userInput}
          onChange={onInputChange}
          placeholder={currentMode.inputPlaceholder}
          disabled={isLoading}
          multiline={true}
          rows={4}
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '10px',
          marginTop: '10px' 
        }}>
          {showReset && (
            <Button 
              type="button"
              className="reset-button"
              onClick={onReset}
              variant="secondary"
            >
              Reset Conversation
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading || !userInput.trim()}
            variant="primary"
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </Button>
        </div>
        
        {error && <ErrorMessage message={error} />}
      </form>
    </div>
  );
});
