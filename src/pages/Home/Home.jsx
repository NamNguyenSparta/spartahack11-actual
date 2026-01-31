import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, TrendingUp, BarChart3, Wallet, Sparkles, ChevronRight, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Home.css';

export default function Home() {
    const { publicKey, connected } = useWallet();
    const {
        currentPersona,
        currentPersonaId,
        setCurrentPersonaId,
        personas,
        reputationScore,
        getReputationLevel,
        passport,
        anchorOnChain,
        isAnchoring,
        demoMode,
        judgeMode,
        setJudgeMode,
    } = useApp();
    const navigate = useNavigate();

    const level = getReputationLevel(reputationScore);

    const pillars = [
        { key: 'paymentReliability', label: 'Payment Reliability', weight: '40%', icon: '💳' },
        { key: 'savingsStability', label: 'Savings Stability', weight: '30%', icon: '💰' },
        { key: 'spendingConsistency', label: 'Spending Consistency', weight: '20%', icon: '📊' },
        { key: 'incomeStability', label: 'Income Stability', weight: '10%', icon: '📈' },
    ];

    const handleGeneratePassport = async () => {
        await anchorOnChain();
        navigate('/passport');
    };

    return (
        <div className="home">
            {/* Header */}
            <header className="home-header">
                <div className="header-left">
                    <button className="logo-btn" onClick={() => navigate('/')}>
                        <Shield size={24} />
                        <span>Credence</span>
                    </button>
                </div>
                <nav className="home-nav">
                    <button className="nav-btn active">Home</button>
                    <button className="nav-btn" onClick={() => navigate('/insights')}>Insights</button>
                    <button className="nav-btn" onClick={() => navigate('/passport')}>Passport</button>
                </nav>
                <div className="header-right">
                    <button
                        className={`judge-toggle ${judgeMode ? 'active' : ''}`}
                        onClick={() => setJudgeMode(!judgeMode)}
                    >
                        <span className="toggle-indicator" />
                        Judge Mode
                    </button>
                    {demoMode ? (
                        <div className="demo-badge">
                            <Sparkles size={14} />
                            Demo Mode
                        </div>
                    ) : (
                        <WalletMultiButton />
                    )}
                </div>
            </header>

            <main className="home-main">
                {/* Persona Selector (Demo Mode) */}
                {demoMode && (
                    <div className="persona-selector card">
                        <h4>Select Persona</h4>
                        <div className="persona-options">
                            {Object.entries(personas).map(([id, persona]) => (
                                <button
                                    key={id}
                                    className={`persona-option ${currentPersonaId === id ? 'active' : ''}`}
                                    onClick={() => setCurrentPersonaId(id)}
                                >
                                    <span className="persona-avatar">{persona.avatar}</span>
                                    <div className="persona-info">
                                        <span className="persona-name">{persona.name}</span>
                                        <span className="persona-desc">{persona.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="home-grid">
                    {/* Score Card */}
                    <div className="score-card card card-glow">
                        <div className="score-header">
                            <div>
                                <h2>Trust Reputation</h2>
                                <p>Your on-chain reputation score</p>
                            </div>
                            <div className="score-trend positive">
                                <TrendingUp size={16} />
                                <span>+6 this month</span>
                            </div>
                        </div>

                        <div className="score-display">
                            <div className="score-ring-large">
                                <svg viewBox="0 0 160 160">
                                    <defs>
                                        <linearGradient id="scoreGradLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                    <circle className="ring-bg" cx="80" cy="80" r="70" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                                    <circle
                                        className="ring-progress"
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        fill="none"
                                        stroke="url(#scoreGradLarge)"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray="440"
                                        strokeDashoffset={440 - (440 * reputationScore / 100)}
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                    />
                                </svg>
                                <div className="score-inner">
                                    <span className="score-number">{reputationScore}</span>
                                    <span className="score-max">/100</span>
                                </div>
                            </div>
                            <div className="score-details">
                                <span className="score-level" style={{ color: level.color }}>{level.label}</span>
                                <p>Based on verified behavioral signals</p>
                            </div>
                        </div>

                        {judgeMode && (
                            <div className="judge-info">
                                <h5>🔍 Technical Explanation</h5>
                                <p>
                                    Score computed from weighted signals: Payment Reliability (40%),
                                    Savings Stability (30%), Spending Consistency (20%), Income Stability (10%).
                                    Updates instantly when switching personas.
                                </p>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={handleGeneratePassport}
                            disabled={isAnchoring}
                        >
                            {isAnchoring ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Anchoring On-Chain...
                                </>
                            ) : passport ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    View Passport
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate On-Chain Passport
                                </>
                            )}
                        </button>
                    </div>

                    {/* Reputation Pillars */}
                    <div className="pillars-section">
                        <h3>Reputation Pillars</h3>
                        <div className="pillars-grid">
                            {pillars.map((pillar) => {
                                const signal = currentPersona.signals[pillar.key];
                                const isVerified = signal.status === 'verified';
                                return (
                                    <div key={pillar.key} className="pillar-card card">
                                        <div className="pillar-header">
                                            <span className="pillar-icon">{pillar.icon}</span>
                                            <span className="pillar-weight">{pillar.weight}</span>
                                        </div>
                                        <h4>{pillar.label}</h4>
                                        <div className="pillar-score">
                                            <div className="progress">
                                                <div
                                                    className="progress-bar progress-bar-gradient"
                                                    style={{ width: `${signal.score}%` }}
                                                />
                                            </div>
                                            <span className="pillar-value">{signal.score}</span>
                                        </div>
                                        <div className={`pillar-status ${isVerified ? 'verified' : 'pending'}`}>
                                            {isVerified ? (
                                                <>
                                                    <CheckCircle2 size={14} />
                                                    Verified Signal
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={14} />
                                                    Needs More Data
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="quick-links">
                    <button className="quick-link card" onClick={() => navigate('/insights')}>
                        <BarChart3 size={24} />
                        <div>
                            <h4>View Insights</h4>
                            <p>See what built your reputation</p>
                        </div>
                        <ChevronRight size={20} />
                    </button>
                    <button className="quick-link card" onClick={() => navigate('/passport')}>
                        <Shield size={24} />
                        <div>
                            <h4>View Passport</h4>
                            <p>Share your verified reputation</p>
                        </div>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
}
