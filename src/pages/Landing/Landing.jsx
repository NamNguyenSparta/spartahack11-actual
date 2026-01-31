import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Zap, Lock, ArrowRight, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useEffect } from 'react';
import './Landing.css';

export default function Landing() {
    const { connected } = useWallet();
    const { runDemoMode, demoMode } = useApp();
    const navigate = useNavigate();

    // Auto-navigate when wallet connects
    useEffect(() => {
        if (connected || demoMode) {
            navigate('/home');
        }
    }, [connected, demoMode, navigate]);

    const handleDemoMode = async () => {
        await runDemoMode();
        navigate('/passport');
    };

    const features = [
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'No personal financial data stored on-chain. Only cryptographic proofs.',
        },
        {
            icon: Zap,
            title: 'Instant Verification',
            description: 'Generate and verify reputation in seconds with Solana.',
        },
        {
            icon: Lock,
            title: 'Portable Reputation',
            description: 'Share your passport with landlords, lenders, or services.',
        },
    ];

    const signals = [
        { label: 'Payment Reliability', description: 'Rent, utilities, subscriptions' },
        { label: 'Savings Stability', description: 'Consistent saving patterns' },
        { label: 'Spending Consistency', description: 'Predictable behavior' },
        { label: 'Income Stability', description: 'Regular income signals' },
    ];

    return (
        <div className="landing">
            {/* Header */}
            <header className="landing-header">
                <div className="logo">
                    <div className="logo-icon">
                        <Shield size={24} />
                    </div>
                    <span className="logo-text">Credence</span>
                </div>
                <nav className="landing-nav">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="https://solana.com" target="_blank" rel="noopener noreferrer">
                        Solana <ExternalLink size={14} />
                    </a>
                </nav>
                <div className="header-actions">
                    <WalletMultiButton />
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-badge">
                    <Sparkles size={14} />
                    <span>Built on Solana</span>
                </div>
                <h1 className="hero-title">
                    Your Reputation,<br />
                    <span className="gradient-text">On-Chain.</span>
                </h1>
                <p className="hero-subtitle">
                    Prove you're reliable without revealing your bank balance.
                    A privacy-preserving reputation passport for the trustless economy.
                </p>
                <div className="hero-actions">
                    <WalletMultiButton className="btn btn-primary btn-lg" />
                    <button className="btn btn-secondary btn-lg" onClick={handleDemoMode}>
                        <Zap size={18} />
                        Demo Mode
                    </button>
                </div>
                <p className="hero-note">
                    No wallet? Click Demo Mode to see it in action →
                </p>

                {/* Hero Visual */}
                <div className="hero-visual">
                    <div className="score-preview">
                        <div className="score-ring">
                            <svg viewBox="0 0 120 120">
                                <circle className="ring-bg" cx="60" cy="60" r="54" />
                                <circle className="ring-progress" cx="60" cy="60" r="54" strokeDasharray="339.3" strokeDashoffset="45" />
                            </svg>
                            <div className="score-inner">
                                <span className="score-value">87</span>
                                <span className="score-label">Trust Score</span>
                            </div>
                        </div>
                        <div className="preview-signals">
                            <div className="signal verified"><CheckCircle2 size={14} /> Payment Reliable</div>
                            <div className="signal verified"><CheckCircle2 size={14} /> Savings Stable</div>
                            <div className="signal verified"><CheckCircle2 size={14} /> Low Volatility</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features" id="features">
                <h2>Why Credence?</h2>
                <p className="section-subtitle">For students, immigrants, and freelancers with thin credit history</p>
                <div className="features-grid">
                    {features.map((feature) => (
                        <div key={feature.title} className="feature-card card">
                            <div className="feature-icon">
                                <feature.icon size={28} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works" id="how-it-works">
                <h2>How It Works</h2>
                <p className="section-subtitle">Generate your on-chain reputation in 3 steps</p>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">01</div>
                        <h3>Connect Wallet</h3>
                        <p>Link your Solana wallet to start building your reputation passport.</p>
                    </div>
                    <div className="step-arrow"><ArrowRight size={24} /></div>
                    <div className="step">
                        <div className="step-number">02</div>
                        <h3>Verify Signals</h3>
                        <p>We analyze behavioral patterns without storing your financial data.</p>
                    </div>
                    <div className="step-arrow"><ArrowRight size={24} /></div>
                    <div className="step">
                        <div className="step-number">03</div>
                        <h3>Anchor On-Chain</h3>
                        <p>Record a cryptographic proof on Solana. Share anywhere, verify instantly.</p>
                    </div>
                </div>
            </section>

            {/* Reputation Signals */}
            <section className="signals-section">
                <h2>Reputation Signals</h2>
                <p className="section-subtitle">What builds your trust score</p>
                <div className="signals-grid">
                    {signals.map((signal) => (
                        <div key={signal.label} className="signal-card">
                            <div className="signal-indicator" />
                            <div>
                                <h4>{signal.label}</h4>
                                <p>{signal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2>Ready to build your on-chain reputation?</h2>
                    <p>Join the trustless economy. No credit history required.</p>
                    <div className="cta-actions">
                        <WalletMultiButton className="btn btn-primary btn-lg" />
                        <button className="btn btn-secondary btn-lg" onClick={handleDemoMode}>
                            Try Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <Shield size={20} />
                        <span>Credence</span>
                    </div>
                    <p>Privacy-preserving reputation for the trustless economy.</p>
                    <div className="footer-links">
                        <a href="https://solana.com" target="_blank" rel="noopener noreferrer">Solana</a>
                        <span>•</span>
                        <a href="https://phantom.app" target="_blank" rel="noopener noreferrer">Phantom</a>
                        <span>•</span>
                        <span>Built for SpartaHack 2026</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
