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
}) => {
  const baseClass = multiline ? 'textarea' : 'input';
  const disabledClass = disabled ? `${baseClass}--disabled` : '';
  
  const combinedClassName = [baseClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={handleChange}
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
