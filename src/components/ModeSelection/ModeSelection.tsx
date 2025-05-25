import React from 'react';
import { Button } from '../ui';
import { MODES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

interface ModeSelectionProps {
  onModeSelect: (modeId: string) => void;
  onTitleClick?: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect, onTitleClick }) => {
  const { user } = useAuth();
  return (
    <div className="mode-selector">
      {/* Application Introduction */}
      <div className="app-introduction">
        <h1 
          className="app-title"
          style={{ 
            cursor: onTitleClick ? 'pointer' : 'default',
            transition: 'color 0.2s ease'
          }}
          onClick={onTitleClick}
          onMouseEnter={(e) => {
            if (onTitleClick) {
              e.currentTarget.style.color = '#4A2F6C';
            }
          }}
          onMouseLeave={(e) => {
            if (onTitleClick) {
              e.currentTarget.style.color = '#2F1B41';
            }
          }}
        >
          Ask Better
        </h1>
        <p className="app-subtitle">Transform your ideas into clear, effective communication</p>
        
        <div className="intro-content">
          <p className="intro-description">
            Whether you're crafting prompts for AI, asking questions to colleagues, debugging code, or developing marketing strategies, 
            <strong> Ask Better</strong> helps you communicate with clarity and precision.
          </p>
          
          <div className="how-it-works">
            <h3>How it works:</h3>
            <ol className="steps-list">
              <li><strong>Choose your mode</strong> - Select the type of communication you want to improve</li>
              <li><strong>Share your idea</strong> - Tell us what you want to communicate</li>
              <li><strong>Get refined versions</strong> - Receive polished, effective alternatives</li>
            </ol>
          </div>
          
          <div className="benefits">
            <p className="benefits-text">
              💡 <strong>Save time</strong> by getting your message right the first time<br/>
              🎯 <strong>Improve clarity</strong> and reduce misunderstandings<br/>
              🚀 <strong>Boost effectiveness</strong> in all your communications
            </p>
          </div>
        </div>
      </div>

      <h2 className="section-title">
        {user ? `${user.name || user.email} ơi, hãy chọn mode mà bạn muốn đi nào` : 'Hãy chọn mode mà bạn muốn đi nào'}
      </h2>
      <div className="mode-buttons-container">
        {Object.values(MODES).map(mode => (
          <Button 
            key={mode.id}
            className="mode-button"
            onClick={() => onModeSelect(mode.id)}
            variant="secondary"
          >
            <div className="mode-display-name">{mode.displayName}</div>
            <div className="mode-description">{mode.description}</div>
          </Button>
        ))}
      </div>
    </div>
  );
};
