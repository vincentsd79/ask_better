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
      <div className="mode-selector" style={{ position: 'relative' }}>
        <Button 
          className="mode-button active mode-change-btn-topright"
          onClick={onModeChange}
          variant="primary"
          style={{ width: '80px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        >
          <span style={{ fontWeight: 600, fontSize: '1em' }}>Change Mode</span>
        </Button>
        <h2 className="section-title" style={{ marginBottom: 0, textAlign: 'left' }}>
          {currentMode.displayName}
        </h2>
      </div>

      {/* Tone Selection */}
      <div className="output-params-selector">
        <h3 className="section-title">Select Tone</h3>
        <div className="param-controls-container">
          <div className="param-control">
            <label>Tone:</label>
            <div className="tone-radio-group">
              {TONE_OPTIONS.map(option => (
                <label
                  key={option.value}
                  className={`tone-radio${selectedTone === option.value ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={option.value}
                    checked={selectedTone === option.value}
                    onChange={() => onToneChange(option.value)}
                    style={{ display: 'none' }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {/* Fallback for accessibility: hidden select */}
            <Select
              value={selectedTone}
              onChange={onToneChange}
              options={TONE_OPTIONS}
              className="tone-select-hidden"
            />
          </div>
        </div>
      </div>
    </>
  );
};
