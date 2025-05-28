import React from 'react';
import { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  multiline = false,
  rows = 3,
  className = '',
  type = 'text',
  onEnterPress,
}) => {
  const baseClass = multiline ? 'textarea' : 'input';
  const disabledClass = disabled ? `${baseClass}--disabled` : '';
  
  const combinedClassName = [baseClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onEnterPress?.();
    }
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={combinedClassName}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={combinedClassName}
    />
  );
};
