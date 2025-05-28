import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          Made with <span className="heart">&lt;3</span> by your boi, <span className="looper">looper</span>
        </p>
        <div className="footer-theme-toggle">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}; 