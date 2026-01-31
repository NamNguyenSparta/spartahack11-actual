import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, TrendingUp, TrendingDown, DollarSign, Wallet, Link as LinkIcon, CheckCircle, Loader2, Sparkles, AlertCircle, Briefcase, Award, Calendar, Target, Zap, BookOpen, Home, UtensilsCrossed } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './StudentHub.css';

export default function StudentHub() {
    const { currentPersona: persona, user } = useApp();
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [aiTyping, setAiTyping] = useState(true);

    const userName = user?.name || 'Student';

    // Reset connection state when persona switches
    useEffect(() => {
        setConnected(false);
        setPrediction(null);
        setAiTyping(true);
        const timer = setTimeout(() => setAiTyping(false), 1500);
        return () => clearTimeout(timer);
    }, [persona?.id]);

    const handleConnect = () => {
        if (connected) return;
        setConnecting(true);
        setTimeout(() => {
            setConnecting(false);
            setConnected(true);

            const chart = persona.wealth?.chart || [];
            const lastMonth = chart[chart.length - 1]?.amount || 0;
            const growthRate = lastMonth < 0 ? 0.92 : 1.08;
            setPrediction(Math.round(lastMonth * Math.pow(growthRate, 12)));
        }, 1500);
    };

    // Safe loading check
    if (!persona || !persona.timeline) return <div className="p-8 text-center">Loading Finance Data...</div>;

    const { timeline, wealth, role } = persona;
    const isInDebt = wealth.chart[wealth.chart.length - 1].amount < 0;
    const isAlumni = role === 'Alumni';

    // Dynamic content based on persona
    const getContent = () => {
        if (isAlumni) {
            return {
                title: 'Alumni Wealth Builder',
                subtitle: 'Track loan payoff and career growth.',
                icon: <Award size={32} className="text-warning-500" />,
                agentName: 'Career Coach Agent',
                agentMessage: `Outstanding progress, ${userName}! Your aggressive loan payoff strategy will save you $12,400 in interest. Consider increasing your 401k contribution to 15% for maximum employer matching.`,
                timelineTitle: 'Post-Graduation Journey'
            };
        } else if (isInDebt) {
            return {
                title: 'Debt Crusher',
                subtitle: 'Aggressive loan repayment strategy.',
                icon: <Wallet size={32} className="text-error-500" />,
                agentName: 'Loan Strategy Agent',
                agentMessage: `Hey ${userName}! I detected a high-interest private loan ($16k). Prioritize this over the subsidized federal loan to save $3,200 in long-term interest. Your FAFSA renewal is coming up in 14 days.`,
                timelineTitle: 'Financial Aid & Loan Timeline'
            };
        } else {
            return {
                title: 'Finance Manager',
                subtitle: `Track tuition, aid, and savings growth.`,
                icon: <GraduationCap size={32} className="text-primary-600" />,
                agentName: 'Strategy Agent',
                agentMessage: `Great work, ${userName}! Your summer internship will reduce loan burden by 18%. I recommend maxing out your Roth IRA contribution this year – you're on track for $142k by age 30!`,
                timelineTitle: 'Academic & Financial Timeline'
            };
        }
    };

    const content = getContent();

    // Calculate totals from timeline
    const calculateTotals = () => {
        let totalTuition = 0, totalLoans = 0, totalAid = 0, totalIncome = 0;

        timeline.forEach(item => {
            totalTuition += (item.tuition || 0) + (item.fees || 0) + (item.housing || 0) + (item.mealPlan || 0);
            totalLoans += item.loans || 0;
            totalAid += (item.scholarships || 0) + (item.pellGrant || 0);
            totalIncome += (item.workStudy || 0) + (item.income || 0);
        });

        return { totalTuition, totalLoans, totalAid, totalIncome };
    };

    const { totalTuition, totalLoans, totalAid, totalIncome } = calculateTotals();

    return (
        <div className="student-hub" key={persona.id}>
            {/* Header */}
            <div className="hub-header">
                <div>
                    <div className="hub-title">
                        {content.icon}
                        <h1>{content.title}</h1>
                    </div>
                    <p className="hub-subtitle">{content.subtitle}</p>
                </div>
                <button
                    className={`bank-connect-btn ${connected ? 'connected' : ''}`}
                    onClick={handleConnect}
                    disabled={connecting || connected}
                >
                    {connecting ? (
                        <><Loader2 size={16} className="animate-spin" /> Syncing Accounts...</>
                    ) : connected ? (
                        <><CheckCircle size={16} className="text-success-600" /> All Accounts Synced</>
                    ) : (
                        <><LinkIcon size={16} /> Link Aid & Bank</>
                    )}
                </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="quick-stats">
                <div className="quick-stat">
                    <Calendar size={16} />
                    <span className="label">Semesters</span>
                    <span className="value">{timeline.length}</span>
                </div>
                <div className="quick-stat">
                    <BookOpen size={16} />
                    <span className="label">Total Costs</span>
                    <span className="value negative">${totalTuition.toLocaleString()}</span>
                </div>
                <div className="quick-stat">
                    <Wallet size={16} />
                    <span className="label">Total Loans</span>
                    <span className="value negative">${totalLoans.toLocaleString()}</span>
                </div>
                <div className="quick-stat">
                    <DollarSign size={16} />
                    <span className="label">Aid & Income</span>
                    <span className="value positive">+${(totalAid + totalIncome).toLocaleString()}</span>
                </div>
            </div>

            <div className="hub-grid">
                {/* Left Column: Enhanced Timeline */}
                <div className="hub-column">
                    <div className="timeline-card">
                        <div className="card-header">
                            <h2>{content.timelineTitle}</h2>
                            <span className="timeline-range">Your Journey</span>
                        </div>

                        <div className="timeline-container">
                            {timeline.map((item, index) => (
                                <div key={item.id} className={`timeline-item ${item.status}`}>
                                    <div className="timeline-marker">
                                        <div className={`period-badge ${item.status === 'active' ? 'active' : ''} ${item.type}`}>
                                            <span className="period-icon">
                                                {item.type === 'study' && '📚'}
                                                {item.type === 'work' && '💼'}
                                                {item.type === 'debt' && '💳'}
                                                {item.type === 'aid' && '🎁'}
                                                {item.type === 'grad' && '🎓'}
                                                {item.type === 'milestone' && '🏆'}
                                            </span>
                                        </div>
                                        {index < timeline.length - 1 && <div className="timeline-line"></div>}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <div>
                                                <h3>{item.title}</h3>
                                                <span className="timeline-date">{item.term}</span>
                                                {item.description && (
                                                    <p className="timeline-description">{item.description}</p>
                                                )}
                                            </div>
                                            <span className={`type-badge ${item.type}`}>
                                                {item.semester?.toUpperCase() || item.type.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Detailed cost breakdown for study items */}
                                        {item.type === 'study' && (
                                            <div className="cost-breakdown">
                                                <div className="cost-row">
                                                    <BookOpen size={12} />
                                                    <span>Tuition & Fees</span>
                                                    <span className="cost-amount negative">-${((item.tuition || 0) + (item.fees || 0)).toLocaleString()}</span>
                                                </div>
                                                {item.housing > 0 && (
                                                    <div className="cost-row">
                                                        <Home size={12} />
                                                        <span>Housing</span>
                                                        <span className="cost-amount negative">-${item.housing.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {item.scholarships > 0 && (
                                                    <div className="cost-row">
                                                        <Award size={12} />
                                                        <span>Scholarships</span>
                                                        <span className="cost-amount positive">+${item.scholarships.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {item.loans > 0 && (
                                                    <div className="cost-row">
                                                        <Wallet size={12} />
                                                        <span>Loans</span>
                                                        <span className="cost-amount warning">+${item.loans.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {item.workStudy > 0 && (
                                                    <div className="cost-row">
                                                        <Briefcase size={12} />
                                                        <span>Work Study</span>
                                                        <span className="cost-amount positive">+${item.workStudy.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Work/Income items */}
                                        {item.type === 'work' && item.income > 0 && (
                                            <div className="income-highlight">
                                                <DollarSign size={14} />
                                                <span>Earned: <strong>${item.income.toLocaleString()}</strong></span>
                                            </div>
                                        )}

                                        {/* Loan payment items */}
                                        {item.loanPayment > 0 && (
                                            <div className="loan-payment-highlight">
                                                <TrendingDown size={14} />
                                                <span>Monthly Payment: <strong>${item.loanPayment.toLocaleString()}</strong></span>
                                            </div>
                                        )}

                                        {item.status === 'active' && (
                                            <div className="current-badge">
                                                <Zap size={12} /> Current
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Wealth & AI Agent */}
                <div className="hub-column">
                    {/* AI Agent Card - Personalized */}
                    <div className={`ai-agent-card ${isInDebt ? 'debt-mode' : isAlumni ? 'alumni-mode' : ''}`}>
                        <div className="ai-header">
                            <div className="ai-avatar-wrapper">
                                <div className="ai-avatar">🤖</div>
                                <div className="ai-status-dot"></div>
                            </div>
                            <div className="ai-info">
                                <h3>{content.agentName}</h3>
                                <span className="ai-status">
                                    {aiTyping ? 'Analyzing your data...' : 'Ready to help'}
                                </span>
                            </div>
                        </div>
                        <div className="ai-message-container">
                            {aiTyping ? (
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            ) : (
                                <p className="ai-message">{content.agentMessage}</p>
                            )}
                        </div>
                        <div className="ai-actions">
                            <button className="btn btn-primary btn-sm">
                                <Sparkles size={14} /> Get More Insights
                            </button>
                        </div>
                    </div>

                    {/* Wealth Card */}
                    <div className="wealth-card">
                        <div className="card-header">
                            <h2>{isInDebt ? 'Debt Payoff Progress' : 'Net Worth Growth'}</h2>
                            {isInDebt ? <TrendingUp size={20} className="text-primary-600" /> : <TrendingUp size={20} className="text-success-600" />}
                        </div>

                        <div className="portfolio-summary">
                            <div className="portfolio-stat">
                                <span className="stat-label">Current Balance</span>
                                <span className={`stat-value ${isInDebt ? 'text-error-600' : 'text-success-600'}`}>
                                    {connected ? `$${wealth.chart[wealth.chart.length - 1].amount.toLocaleString()}` : '---'}
                                </span>
                            </div>
                            <div className="portfolio-stat">
                                <span className="stat-label">Projected @ 30</span>
                                <span className="stat-value text-primary-600">
                                    ${wealth.projected.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="wealth-chart" style={{ minHeight: '140px' }}>
                            <ResponsiveContainer width="100%" height={140}>
                                <AreaChart data={wealth.chart}>
                                    <defs>
                                        <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isInDebt ? "#ef4444" : "#10b981"} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={isInDebt ? "#ef4444" : "#10b981"} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                                    <Area type="monotone" dataKey="amount" stroke={isInDebt ? "#ef4444" : "#10b981"} strokeWidth={2} fill="url(#wealthGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {connected && prediction && (
                            <div className={`prediction-box ${isInDebt ? 'debt' : 'growth'}`}>
                                <Sparkles size={14} />
                                <p>
                                    {isInDebt
                                        ? <span><strong>AI Projection:</strong> Debt-free by <strong>2028</strong> if you maintain this pace!</span>
                                        : <span><strong>AI Projection:</strong> You'll reach <strong>${prediction.toLocaleString()}</strong> by next year.</span>
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Card */}
                    {isInDebt && (
                        <div className="action-card">
                            <div className="action-icon">
                                <AlertCircle size={20} />
                            </div>
                            <div className="action-content">
                                <h4>Action Required</h4>
                                <p>FAFSA Renewal deadline in <strong>14 days</strong></p>
                                <button className="btn btn-sm btn-secondary">
                                    Auto-fill with AI →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
