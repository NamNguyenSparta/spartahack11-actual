import { useApp } from '../../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, Sparkles, Brain, Users, ChevronRight, Wallet, CreditCard, Target, GraduationCap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
    const { currentPersona: persona, analysis, agents, getStatusColor, getStatusLabel, user } = useApp();
    const navigate = useNavigate();

    const { trustScore, consensus, confidenceLevel, riskTier } = analysis;

    if (!persona || !analysis) {
        return <div className="p-8 text-center">Loading Credence Data...</div>;
    }

    const agentResults = Object.values(analysis.agents);
    const userName = user?.name || 'Student';
    const accountBalance = persona.wealth?.accountBalance || 2450;
    const savingsGoal = persona.wealth?.savingsGoal || 5000;
    const savingsProgress = Math.round((accountBalance / savingsGoal) * 100);

    // Calculate score change
    const history = persona.history?.score || [];
    const lastMonth = history.length > 1 ? history[history.length - 2]?.score : trustScore;
    const scoreChange = trustScore - lastMonth;

    // Get next timeline event
    const activeEvent = persona.timeline?.find(e => e.status === 'active');

    return (
        <div className="dashboard">
            {/* Welcome Header */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1 className="welcome-title">Hey {userName}! 👋</h1>
                    <p className="welcome-subtitle">Here's your financial overview for today</p>
                </div>
                <div className="university-badge">
                    <GraduationCap size={16} />
                    <span>{persona.university || 'Michigan State University'}</span>
                    <span className="year-badge">{persona.year || 'Freshman'}</span>
                </div>
            </div>

            {/* Account Overview Cards */}
            <div className="account-cards">
                <div className="account-card balance-card">
                    <div className="account-card-header">
                        <Wallet size={20} />
                        <span>Account Balance</span>
                    </div>
                    <div className="account-value">
                        ${accountBalance.toLocaleString()}
                    </div>
                    <div className="account-meta positive">
                        <TrendingUp size={14} />
                        +$350 this month
                    </div>
                </div>

                <div className="account-card savings-card">
                    <div className="account-card-header">
                        <Target size={20} />
                        <span>Savings Goal</span>
                    </div>
                    <div className="savings-progress-container">
                        <div className="savings-amounts">
                            <span className="current">${accountBalance.toLocaleString()}</span>
                            <span className="goal">/ ${savingsGoal.toLocaleString()}</span>
                        </div>
                        <div className="savings-bar">
                            <div className="savings-fill" style={{ width: `${Math.min(savingsProgress, 100)}%` }}></div>
                        </div>
                        <span className="savings-percent">{savingsProgress}% complete</span>
                    </div>
                </div>

                <div className="account-card next-payment-card">
                    <div className="account-card-header">
                        <Calendar size={20} />
                        <span>Current Semester</span>
                    </div>
                    <div className="next-payment-info">
                        <span className="payment-label">{activeEvent?.title || 'Spring 2025'}</span>
                        <span className="payment-date">{activeEvent?.term || 'In Progress'}</span>
                    </div>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate('/student')}>
                        View Timeline
                    </button>
                </div>

                <div className="account-card score-preview-card">
                    <div className="account-card-header">
                        <Shield size={20} />
                        <span>Trust Score</span>
                    </div>
                    <div className="score-preview">
                        <span className="score-big">{trustScore}</span>
                        <span className="score-label">/ 100</span>
                    </div>
                    <div className={`score-change ${scoreChange >= 0 ? 'positive' : 'negative'}`}>
                        <TrendingUp size={14} />
                        {scoreChange >= 0 ? '+' : ''}{scoreChange} pts
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
                {/* Trust Score Card */}
                <div className="card score-card">
                    <div className="score-display">
                        <div className="score-circle">
                            <svg viewBox="0 0 120 120" className="score-ring">
                                <circle cx="60" cy="60" r="54" className="ring-bg" />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    className="ring-progress"
                                    style={{
                                        strokeDasharray: `${(trustScore / 100) * 339.292} 339.292`,
                                        stroke: trustScore >= 70 ? 'var(--primary-500)' : trustScore >= 50 ? 'var(--warning-500)' : 'var(--error-500)',
                                    }}
                                />
                            </svg>
                            <div className="score-value">
                                <span className="score-number">{trustScore}</span>
                                <span className="score-label">TRUST SCORE</span>
                            </div>
                        </div>
                        <div className="score-meta">
                            <div className="score-change" data-positive={scoreChange >= 0}>
                                <TrendingUp size={16} />
                                <span>{scoreChange >= 0 ? '+' : ''}{scoreChange} pts this cycle</span>
                            </div>
                            <div className="confidence-badge" data-level={confidenceLevel.toLowerCase()}>
                                Confidence: {confidenceLevel}
                            </div>
                        </div>
                    </div>
                    <div className="score-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/passport')}>
                            <Shield size={16} />
                            Generate Trust Passport
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/insights')}>
                            View Insights
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Score Trend Card */}
                <div className="card trend-card">
                    <div className="card-header">
                        <h3>6-Month Score Trend</h3>
                        <span className="trend-indicator" data-positive={scoreChange >= 0}>
                            <TrendingUp size={14} />
                            {scoreChange >= 0 ? '+' : ''}{scoreChange}
                        </span>
                    </div>
                    <p className="card-subtitle">Your reputation over time</p>
                    <div className="chart-container" style={{ minHeight: '120px' }}>
                        <ResponsiveContainer width="100%" height={120}>
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis domain={[50, 100]} hide />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="var(--primary-500)"
                                    strokeWidth={2}
                                    fill="url(#scoreGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Trust Council Card */}
            <div className="card council-card">
                <div className="card-header">
                    <div className="council-header">
                        <Brain size={20} className="council-icon" />
                        <h3>AI Trust Council</h3>
                    </div>
                    <div className="council-meta">
                        <span className="agent-count">
                            <Users size={14} />
                            {agentResults.length} Agents
                        </span>
                    </div>
                </div>
                <p className="card-subtitle">
                    Multiple AI agents evaluate your financial behavior from different perspectives.
                </p>

                {/* Agent Contributions */}
                <div className="agent-contributions">
                    {agentResults.map((agent) => (
                        <div key={agent.id} className="agent-row" data-status={agent.status}>
                            <div className="agent-info">
                                <span className="agent-icon">{agent.icon}</span>
                                <div className="agent-details">
                                    <span className="agent-name">{agent.name.replace(' Agent', '')}</span>
                                    <span className="agent-role">{agent.role}</span>
                                </div>
                            </div>
                            <div className="agent-contribution">
                                <span className="contribution-value">+{agent.contribution}</span>
                            </div>
                            <div className="agent-reasoning">
                                <p>{agent.reasoning}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Consensus Bar */}
                <div className="consensus-section">
                    <div className="consensus-header">
                        <span className="consensus-label">
                            <Users size={14} />
                            Agent Consensus Level
                        </span>
                        <span className="consensus-value">{consensus}%</span>
                    </div>
                    <div className="consensus-bar">
                        <div
                            className="consensus-fill"
                            style={{ width: `${consensus}%` }}
                            data-level={consensus >= 80 ? 'high' : consensus >= 60 ? 'medium' : 'low'}
                        />
                    </div>
                    <p className="consensus-hint">
                        Higher agreement = higher confidence in score
                    </p>
                </div>
            </div>

            {/* Reputation Pillars */}
            <div className="pillars-section">
                <h2>Reputation Pillars</h2>
                <p className="section-subtitle">What builds your Trust Score</p>

                <div className="pillars-grid">
                    {agentResults.slice(0, 4).map((agent) => (
                        <div key={agent.id} className="pillar-card">
                            <div className="pillar-header">
                                <span className="pillar-icon">{agent.icon}</span>
                                <span className="pillar-score">{agent.score}%</span>
                            </div>
                            <h4>{agent.name.replace(' Agent', '')}</h4>
                            <p className="pillar-focus">{agent.focus}</p>
                            <div className="pillar-bar">
                                <div
                                    className="pillar-progress"
                                    style={{
                                        width: `${agent.score}%`,
                                        backgroundColor: getStatusColor(agent.score),
                                    }}
                                />
                            </div>
                            <span className="pillar-status" style={{ color: getStatusColor(agent.score) }}>
                                {getStatusLabel(agent.score)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="cta-banner">
                <div className="cta-content">
                    <Sparkles size={24} />
                    <div>
                        <h3>Credence makes financial trust transparent and explainable.</h3>
                        <p>Share your Trust Passport with landlords, lenders, and services.</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/passport')}>
                    Generate Passport
                </button>
            </div>
        </div>
    );
}
