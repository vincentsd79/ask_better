import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle-buttons">
        <button
          className={`theme-button ${currentTheme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
          title="Light mode"
          aria-label="Switch to light mode"
        >
          ☀️
        </button>
        <button
          className={`theme-button ${currentTheme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
          title="Dark mode"
          aria-label="Switch to dark mode"
        >
          🌙
        </button>
      </div>
    </div>
  );
}; 