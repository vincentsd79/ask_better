import React from 'react';
import { Button, Select } from '../ui';
import { MODES, TONE_OPTIONS } from '../../constants';

interface ModeHeaderProps {
  selectedMode: string;
  selectedTone: string;
  onToneChange: (tone: string) => void;
  onModeChange: () => void;
}

export const ModeHeader: React.FC<ModeHeaderProps> = ({
  selectedMode,
  selectedTone,
  onToneChange,
  onModeChange,
}) => {
  const currentMode = MODES[selectedMode];

  return (
    <>
      {/* Mode Title and Change Button */}
      <div className="mode-selector">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            {currentMode.displayName}
          </h2>
          <Button 
            className="mode-button active"
            onClick={onModeChange}
            variant="primary"
          >
            <div className="mode-display-name">Change Mode</div>
            <div className="mode-description">Select a different mode</div>
          </Button>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="output-params-selector">
        <h3 className="section-title">Output Parameters</h3>
        <div className="param-controls-container">
          <div className="param-control">
            <label>Tone:</label>
            <Select
              value={selectedTone}
              onChange={onToneChange}
              options={TONE_OPTIONS}
            />
          </div>
        </div>
      </div>
    </>
  );
};
