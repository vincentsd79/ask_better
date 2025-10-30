import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  onTitleClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onTitleClick }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleProfileClick = () => {
    // You can implement navigation to the profile page here, e.g., using react-router
    // For now, just log to console
    window.dispatchEvent(new CustomEvent('open-profile'));
  };

  return (
    <header style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
      width: '100%'
    }}>
      {/* Left side - App title */}
      <h1 
        style={{ 
          margin: 0, 
          textAlign: 'left', 
          textShadow: '2px 2px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.10)',
          color: '#2F1B41',
          cursor: onTitleClick ? 'pointer' : 'default',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '2.5rem',
          transition: 'color 0.2s ease'
        }}
        onClick={onTitleClick}
        onMouseEnter={(e) => {
          if (onTitleClick) {
            e.currentTarget.style.color = '#4A2F6C';
          }
        }}
        onMouseLeave={(e) => {
          if (onTitleClick) {
            e.currentTarget.style.color = '#2F1B41';
          }
        }}
      >
        {t.appTitle}
      </h1>

      {/* Right side - Theme toggle and User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle />
        {user && (
          <div 
            style={{ 
              fontSize: '1.5em', 
              color: '#4A2F6C', 
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={handleProfileClick}
          >
            {user.name || user.email}
          </div>
        )}
      </div>
    </header>
  );
};
