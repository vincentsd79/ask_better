import React from 'react';
import { Button, Select } from '../ui';
import { MODES, getToneOptions } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { language } = useLanguage();
  const currentMode = MODES[selectedMode];
  const toneOptions = getToneOptions(language);

  // Get mode display name based on language
  const getModeDisplayName = (modeId: string) => {
    const { t } = useLanguage();
    switch (modeId) {
      case 'PROMPT_BETTER':
        return t.promptBetter;
      case 'ASK_BETTER':
        return t.askBetter;
      case 'CODING_MODE':
        return t.codingMode;
      case 'MARKETING_101':
        return t.marketing101;
      default:
        return currentMode.displayName;
    }
  };

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
          <span style={{ fontWeight: 600, fontSize: '1em' }}>
            {language === 'vi' ? 'Đổi Chế Độ' : 'Change Mode'}
          </span>
        </Button>
        <h2 className="section-title" style={{ marginBottom: 0, textAlign: 'left' }}>
          {getModeDisplayName(selectedMode)}
        </h2>
      </div>

      {/* Tone Selection */}
      <div className="output-params-selector">
        <h3 className="section-title">
          {language === 'vi' ? 'Chọn Giọng Điệu' : 'Select Tone'}
        </h3>
        <div className="param-controls-container">
          <div className="param-control">
            <label>
              {language === 'vi' ? 'Giọng điệu:' : 'Tone:'}
            </label>
            <div className="tone-radio-group">
              {toneOptions.map(option => (
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
              options={toneOptions}
              className="tone-select-hidden"
            />
          </div>
        </div>
      </div>
    </>
  );
};
