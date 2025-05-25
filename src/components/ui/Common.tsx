import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div className={`error-message ${className}`}>
      {message}
    </div>
  );
};

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`loading-message ${className}`}>
      {message}
    </div>
  );
};


