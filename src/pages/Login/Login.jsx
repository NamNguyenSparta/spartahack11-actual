import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Check, Shield, TrendingUp } from 'lucide-react';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate login
        setTimeout(() => {
            setUser({
                name: formData.name || 'Yash',
                email: formData.email,
                avatar: '👤',
                accountBalance: 2450.00,
                savingsGoal: 5000,
                totalLoans: 23000,
                nextPayment: { amount: 450, dueDate: 'Feb 15, 2025' }
            });
            setIsLoading(false);
            navigate('/');
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-icon">C</div>
                    <span className="logo-text">Credence</span>
                </div>

                <p className="login-tagline">Your AI-powered financial assistant for students</p>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your first name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In to Credence'}
                    </button>
                </form>

                {/* Divider */}
                <div className="login-divider">
                    <span>or continue with</span>
                </div>

                {/* Social Login */}
                <div className="social-login">
                    <button type="button" className="social-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button type="button" className="social-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                        </svg>
                        Apple
                    </button>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    Don't have an account? <a href="#">Sign up free</a>
                </div>

                {/* Features */}
                <div className="login-features">
                    <div className="login-feature">
                        <Check size={14} />
                        <span>Free forever</span>
                    </div>
                    <div className="login-feature">
                        <Shield size={14} />
                        <span>Bank-level security</span>
                    </div>
                    <div className="login-feature">
                        <TrendingUp size={14} />
                        <span>AI-powered</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
