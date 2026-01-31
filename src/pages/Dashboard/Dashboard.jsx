import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { TrendingUp, Shield, Sparkles, ArrowUpRight, ChevronRight, CheckCircle2, AlertCircle, CreditCard, Wallet, PiggyBank, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { currentPersona, getStatusColor, getStatusLabel } = useApp();

    const pillars = [
        {
            key: 'paymentReliability',
            label: 'Payment Reliability',
            weight: '40%',
            icon: CreditCard,
            description: 'Rent, utilities, subscriptions'
        },
        {
            key: 'savingsStability',
            label: 'Savings Stability',
            weight: '25%',
            icon: PiggyBank,
            description: 'Consistent saving patterns'
        },
        {
            key: 'incomeConsistency',
            label: 'Income Consistency',
            weight: '20%',
            icon: Wallet,
            description: 'Regular income deposits'
        },
        {
            key: 'spendingStability',
            label: 'Spending Stability',
            weight: '15%',
            icon: TrendingUp,
            description: 'Predictable behavior'
        },
    ];

    const scoreChange = currentPersona.history.score[currentPersona.history.score.length - 1].score -
        currentPersona.history.score[0].score;

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Your Trust Reputation</h1>
                    <p>Credence converts financial behavior into trust signals.</p>
                </div>
                <div className="header-actions">
                    <div className="persona-badge">
                        <span className="avatar">{currentPersona.avatar}</span>
                        <span>{currentPersona.name}</span>
                    </div>
                </div>
            </div>

            {/* Score Section */}
            <div className="score-section">
                <div className="score-card card">
                    <div className="score-display">
                        <div className="score-ring">
                            <svg viewBox="0 0 160 160">
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0ea5e9" />
                                        <stop offset="50%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="80" cy="80" r="70"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="80" cy="80" r="70"
                                    fill="none"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * currentPersona.trustScore / 100)}
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                />
                            </svg>
                            <div className="score-inner">
                                <span className="score-value">{currentPersona.trustScore}</span>
                                <span className="score-label">Trust Score</span>
                            </div>
                        </div>
                        <div className="score-info">
                            <div className={`score-change ${scoreChange >= 0 ? 'positive' : 'negative'}`}>
                                {scoreChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span>{scoreChange >= 0 ? '+' : ''}{scoreChange} pts this cycle</span>
                            </div>
                            <div className={`confidence-badge badge-${getStatusColor(currentPersona.trustScore)}`}>
                                Confidence: {currentPersona.confidenceLevel}
                            </div>
                        </div>
                    </div>

                    <div className="score-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/passport')}>
                            <Sparkles size={18} />
                            Generate Trust Passport
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/insights')}>
                            View Insights
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Score Trend Chart */}
                <div className="trend-card card">
                    <div className="card-header">
                        <div>
                            <h3>6-Month Score Trend</h3>
                            <p className="subtitle">Your reputation over time</p>
                        </div>
                        <div className={`trend-badge ${scoreChange >= 0 ? 'positive' : 'negative'}`}>
                            {scoreChange >= 0 ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                            {scoreChange >= 0 ? '+' : ''}{scoreChange}
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={currentPersona.history.score}>
                                <defs>
                                    <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                />
                                <YAxis
                                    domain={[40, 100]}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value) => [`${value}`, 'Trust Score']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#0ea5e9"
                                    strokeWidth={2.5}
                                    fill="url(#scoreAreaGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Reputation Pillars */}
            <section className="pillars-section">
                <h2>Reputation Pillars</h2>
                <p className="section-subtitle">What builds your Trust Score</p>
                <div className="pillars-grid">
                    {pillars.map((pillar) => {
                        const signal = currentPersona.signals[pillar.key];
                        const statusColor = getStatusColor(signal.score);
                        return (
                            <div key={pillar.key} className="pillar-card card">
                                <div className="pillar-header">
                                    <div className={`pillar-icon ${statusColor}`}>
                                        <pillar.icon size={20} />
                                    </div>
                                    <span className="pillar-weight">{pillar.weight}</span>
                                </div>
                                <h4>{pillar.label}</h4>
                                <p className="pillar-desc">{pillar.description}</p>
                                <div className="pillar-score">
                                    <div className="progress">
                                        <div
                                            className={`progress-bar progress-bar-${statusColor}`}
                                            style={{ width: `${signal.score}%` }}
                                        />
                                    </div>
                                    <span className="score-num">{signal.score}</span>
                                </div>
                                <div className={`pillar-status ${statusColor}`}>
                                    {statusColor === 'success' ? <CheckCircle2 size={14} /> :
                                        statusColor === 'warning' ? <AlertCircle size={14} /> :
                                            <AlertCircle size={14} />}
                                    <span>{signal.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Quick Stats */}
            <section className="stats-section">
                <div className="stat-row">
                    <div className="card stat-item">
                        <div className="stat-icon success">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{currentPersona.signals.paymentReliability.onTime}/{currentPersona.signals.paymentReliability.total}</span>
                            <span className="stat-label">On-Time Payments</span>
                        </div>
                    </div>
                    <div className="card stat-item">
                        <div className="stat-icon info">
                            <PiggyBank size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{currentPersona.signals.savingsStability.trend}</span>
                            <span className="stat-label">Savings Trend</span>
                        </div>
                    </div>
                    <div className="card stat-item">
                        <div className="stat-icon purple">
                            <Wallet size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{currentPersona.signals.incomeConsistency.type}</span>
                            <span className="stat-label">Income Type</span>
                        </div>
                    </div>
                    <div className="card stat-item">
                        <div className="stat-icon warning">
                            <TrendingUp size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{currentPersona.signals.spendingStability.volatility}</span>
                            <span className="stat-label">Spending Volatility</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <div className="cta-banner card">
                <div className="cta-content">
                    <Shield size={32} className="cta-icon" />
                    <div>
                        <h3>Share proof of reliability, not your bank history.</h3>
                        <p>Generate your Trust Passport to share with landlords, lenders, or services.</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/passport')}>
                    Generate Passport
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
