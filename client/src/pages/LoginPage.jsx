import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { Kanban, LogIn } from 'lucide-react';
import '../styles/Auth.css';

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const executeLogin = async (userEmail, userPassword) => {
    if (!userEmail || !userPassword) {
      setError('Please provide email and password');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(userEmail.trim(), userPassword.trim());
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    executeLogin(demoEmail, 'password123');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-icon">
            <Kanban size={26} />
          </div>
          <h1 className="auth-title">Welcome to CollabBoard</h1>
          <p className="auth-subtitle">Sign in to manage team tasks and collaborate via Express REST API.</p>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label required">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            icon={LogIn}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="demo-creds">
          <strong>Quick Demo Accounts (Click to Login):</strong>
          <br />
          👉 <button type="button" className="auth-link" onClick={() => handleQuickLogin('sandeepa@example.com')}>sandeepa@example.com (Team Lead)</button>
          <br />
          👉 <button type="button" className="auth-link" onClick={() => handleQuickLogin('amara@example.com')}>amara@example.com (UI Designer)</button>
          <br />
          👉 <button type="button" className="auth-link" onClick={() => handleQuickLogin('kasun@example.com')}>kasun@example.com (Developer)</button>
          <br />
          Password: <code>password123</code>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <button type="button" className="auth-link" onClick={onSwitchToRegister}>
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
