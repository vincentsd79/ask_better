import React from 'react';
import { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
  style,
}) => {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const disabledClass = disabled ? 'button--disabled' : '';
  
  const combinedClassName = [baseClass, variantClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      style={style}
    >
      {children}
    </button>
  );
};
