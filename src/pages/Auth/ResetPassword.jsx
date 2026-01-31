import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ArrowRight, Shield, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /\d/.test(pw) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [token, setToken] = useState('');

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setFormError('Invalid or missing reset token');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (!validatePassword(formData.password)) {
      setFormError('Password does not meet all requirements');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword(token, formData.password);
      if (result.success) {
        setFormSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/auth'), 2000);
      } else {
        setFormError(result.error);
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1>Set New Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                disabled={!token}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
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
            {formData.password && (
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                disabled={!token}
              />
            </div>
          </div>

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

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting || !token}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin" />
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button type="button" className="back-to-login-btn" onClick={() => navigate('/auth')}>
            Back to Sign In
          </button>
        </form>
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
