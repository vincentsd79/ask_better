import React from 'react';
import { InputProps } from '../../types';

export const Input = React.forwardRef<HTMLTextAreaElement | HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  multiline = false,
  rows = 3,
  className = '',
  type = 'text',
  onEnterPress,
}, ref) => {
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
        ref={ref as React.Ref<HTMLTextAreaElement>}
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
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={combinedClassName}
    />
  );
});

Input.displayName = 'Input';
