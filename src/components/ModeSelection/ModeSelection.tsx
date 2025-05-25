import React from 'react';
import { Button } from '../ui';
import { MODES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

interface ModeSelectionProps {
  onModeSelect: (modeId: string) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  const { user } = useAuth();
  return (
    <div className="mode-selector">
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
