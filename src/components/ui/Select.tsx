import React from 'react';
import { SelectProps } from '../../types';

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
}) => {
  const baseClass = 'select';
  const disabledClass = disabled ? 'select--disabled' : '';
  
  const combinedClassName = [baseClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={combinedClassName}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
