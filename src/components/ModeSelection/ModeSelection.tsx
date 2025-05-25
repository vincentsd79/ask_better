import React from 'react';
import { Button } from '../ui';
import { MODES } from '../../constants';

interface ModeSelectionProps {
  onModeSelect: (modeId: string) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  return (
    <div className="mode-selector">
      <h2 className="section-title">Choose a Mode</h2>
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
