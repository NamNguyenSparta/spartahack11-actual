import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Shield, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /\d/.test(pw) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const { login, register, requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return PASSWORD_REQUIREMENTS.every(req => req.test(password));
  };

  const getPasswordStrength = (password) => {
    const passed = PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;
    if (passed <= 2) return { label: 'Weak', color: 'var(--accent-rose)' };
    if (passed <= 4) return { label: 'Medium', color: 'var(--accent-amber)' };
    return { label: 'Strong', color: 'var(--accent-emerald)' };
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (showForgotPassword) {
      if (!formData.email) {
        setFormError('Please enter your email address');
        return;
      }
      setIsSubmitting(true);
      try {
        const result = await requestPasswordReset(formData.email);
        if (result.success) {
          setFormSuccess('Password reset link sent to your email');
        } else {
          setFormError(result.error);
        }
      } catch (err) {
        setFormError('An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (!isLogin && !validatePassword(formData.password)) {
      setFormError('Password does not meet all requirements');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.error);
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowForgotPassword(false);
    setFormError('');
    setFormSuccess('');
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setFormError('');
    setFormSuccess('');
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={40} />
            <span>Credence</span>
          </div>
          <h1>{showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{showForgotPassword ? 'Enter your email to receive a reset link' : isLogin ? 'Sign in to access your Credence Passport' : 'Join Credence to build your financial identity'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {!showForgotPassword && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => !isLogin && setShowPasswordRequirements(true)}
                    onBlur={() => setShowPasswordRequirements(false)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!isLogin && formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(PASSWORD_REQUIREMENTS.filter(r => r.test(formData.password)).length / PASSWORD_REQUIREMENTS.length) * 100}%`,
                          backgroundColor: passwordStrength.color 
                        }} 
                      />
                    </div>
                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                {!isLogin && (showPasswordRequirements || formData.password) && (
                  <div className="password-requirements">
                    {PASSWORD_REQUIREMENTS.map(req => (
                      <div key={req.id} className={`requirement ${req.test(formData.password) ? 'met' : ''}`}>
                        {req.test(formData.password) ? <Check size={14} /> : <X size={14} />}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <button type="button" className="forgot-password-btn" onClick={handleForgotPassword}>
                  Forgot your password?
                </button>
              )}
            </>
          )}

          {formError && (
            <div className="form-error">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="form-success">
              {formSuccess}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin" />
                {showForgotPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {showForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {showForgotPassword && (
            <button type="button" className="back-to-login-btn" onClick={handleBackToLogin}>
              Back to Sign In
            </button>
          )}
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" className="toggle-mode-btn" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      <div className="auth-features">
        <div className="feature-card">
          <h3>Build Your Financial Identity</h3>
          <p>Upload documents and behavioral data to create a verified trust score that works for you.</p>
        </div>
        <div className="feature-card">
          <h3>Blockchain Verified</h3>
          <p>Your Credence Passport is secured on the Solana blockchain for immutable proof.</p>
        </div>
        <div className="feature-card">
          <h3>Privacy First</h3>
          <p>Only proof hashes are stored on-chain. Your personal data stays private.</p>
        </div>
      </div>
    </div>
  );
}
