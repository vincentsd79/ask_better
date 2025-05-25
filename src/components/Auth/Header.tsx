import React from 'react';
import { Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header>
      <h1>Ask Better</h1>
      {user && (
        <div className="user-display">
          <span>Welcome, {user.email}</span>
          <Button 
            className="logout-button"
            onClick={handleLogout}
            variant="secondary"
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};
