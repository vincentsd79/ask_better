import React, { useState } from 'react';
import { Button, Input, ErrorMessage, LoadingSpinner } from '../ui';
import { useAuth } from '../../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const { loading, error, signIn, signUp, clearError, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetSent(false);
    if (authView === 'login') {
      await signIn(email, password);
    } else {
      await signUp(name, email, password);
    }
  };

  const handleResetPassword = async () => {
    setResetSent(false);
    const result = await resetPassword(email);
    if (result.success) {
      setResetSent(true);
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
          {authView === 'signup' && (
            <Input
              value={name}
              onChange={setName}
              placeholder="Name"
              className="auth-input"
            />
          )}
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
            type="password"
          />
          
          <Button 
            type="submit" 
            className="auth-button"
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Loading...' : (authView === 'login' ? 'Login' : 'Sign Up')}
          </Button>
          {(authView === 'login' && error && (error.includes('Wrong password') || error.includes('Invalid email or password'))) && (
            <div style={{ marginBottom: '1rem' }}>
              <Button
                className="auth-reset-password-button"
                variant="secondary"
                onClick={handleResetPassword}
                disabled={!email}
              >
                Reset Password
              </Button>
            </div>
          )}
        </form>

        {resetSent && (
          <div className="auth-reset-sent">Password reset email sent! Please check your inbox.</div>
        )}

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
