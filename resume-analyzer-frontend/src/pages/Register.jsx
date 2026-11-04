
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    setMessage('');
    setError('');

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(formData);

      setMessage('Account created successfully!');

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });

      setTimeout(() => {
        navigate('/');
      }, 1200);

    } catch (err) {
      setError(
        err.message.includes('Email is already registered')
          ? 'This email is already registered. Please log in.'
          : err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-icon">RA</div>

        <h1>Create Account</h1>

        <p className="subtitle">
          Create your account and start improving your resume.
        </p>

        <form onSubmit={handleRegister}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          {error && <p className="error-message">{error}</p>}

          {message && (
            <p className="success-message">{message}</p>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
