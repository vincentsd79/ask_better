import React, { useState } from 'react';
import { Button, Input, ErrorMessage, LoadingSpinner } from '../ui';
import { useAuth } from '../../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { loading, error, signIn, signUp, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (authView === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  const toggleAuthView = () => {
    setAuthView(authView === 'login' ? 'signup' : 'login');
    clearError();
  };

  if (loading) {
    return (
      <div className="auth-container">
        <LoadingSpinner message="Loading..." className="auth-loading" />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="section-title">
          {authView === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        
        {error && <ErrorMessage message={error} className="auth-error" />}

        <form onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={setEmail}
            placeholder="Email"
            className="auth-input"
          />
          
          <Input
            value={password}
            onChange={setPassword}
            placeholder="Password"
            className="auth-input"
          />
          
          <Button 
            type="submit" 
            className="auth-button"
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Loading...' : (authView === 'login' ? 'Login' : 'Sign Up')}
          </Button>
        </form>

        <Button
          className="auth-toggle-button"
          onClick={toggleAuthView}
          variant="secondary"
        >
          {authView === 'login' 
            ? "Don't have an account? Sign Up" 
            : "Already have an account? Login"}
        </Button>
      </div>
    </div>
  );
};
