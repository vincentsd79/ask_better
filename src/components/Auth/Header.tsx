import React from 'react';
import { Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user } = useAuth();

  const handleProfileClick = () => {
    // You can implement navigation to the profile page here, e.g., using react-router
    // For now, just log to console
    window.dispatchEvent(new CustomEvent('open-profile'));
  };

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ margin: 0, textAlign: 'left', textShadow: '2px 2px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.10)' }}>Ask Better</h1>
      {user && (
        <div className="user-display" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={handleProfileClick}>
          <span>{user.name || user.email}</span>
        </div>
      )}
    </header>
  );
};
