
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser({
        email: email.trim(),
        password
      });

      if (!user || user.id == null) {
        console.error('Login response:', user);
        throw new Error('User ID was not returned by the server.');
      }

      // Store user information consistently
      sessionStorage.setItem('userId', String(user.id));
      sessionStorage.setItem('userName', user.name || '');
      sessionStorage.setItem('userEmail', user.email || '');

      // Remove the old key to avoid confusion
      sessionStorage.removeItem('user_Id');
      sessionStorage.removeItem('user_id');

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);

      setError(
        err.message?.includes('Failed to fetch')
          ? 'Cannot connect to the server. Check that Spring Boot is running.'
          : err.message || 'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-icon">RA</div>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Sign in to your Resume Analyzer account.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
