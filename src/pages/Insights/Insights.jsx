import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, MessageCircle, Brain, Users } from 'lucide-react';
import './Insights.css';

export default function Insights() {
    const { currentPersona: persona, analysis, agentDiscussion, getStatusColor } = useApp();

    const { trustScore, consensus, agents } = analysis;

    if (!persona || !analysis) {
        return <div className="p-8 text-center">Loading Credence Data...</div>;
    }

    const agentResults = Object.values(agents);

    // Separate positive and negative factors
    const positiveAgents = agentResults.filter(a => a.status === 'positive');
    const negativeAgents = agentResults.filter(a => a.status === 'negative');
    const neutralAgents = agentResults.filter(a => a.status === 'neutral');

    // Safe access to persona data
    const historyPayments = persona.history?.payments || [];
    const historySavings = persona.history?.savings || [];
    const spendingVolatility = persona.signals?.spendingStability?.volatility || 0;

    return (
        <div className="insights">
            {/* Header */}
            <div className="insights-header">
                <div>
                    <h1>Score Insights</h1>
                    <p className="subtitle">
                        Credence makes financial trust transparent and explainable.
                    </p>
                </div>
                <div className="score-snapshot">
                    <span className="snapshot-score">{trustScore}</span>
                    <span className="snapshot-label">Trust Score</span>
                </div>
            </div>

            {/* What Built Your Score */}
            <div className="card factors-card">
                <h2>What built your reputation this month?</h2>
                <p className="card-subtitle">AI agents analyzed your financial behavior and identified these factors.</p>

                <div className="factors-grid">
                    {/* Positive Factors */}
                    <div className="factors-column positive">
                        <div className="factors-header">
                            <CheckCircle size={18} />
                            <h3>Strengthening Factors</h3>
                        </div>
                        {positiveAgents.map((agent) => (
                            <div key={agent.id} className="factor-item">
                                <span className="factor-icon">{agent.icon}</span>
                                <div className="factor-content">
                                    <span className="factor-title">{agent.name.replace(' Agent', '')}</span>
                                    <p className="factor-text">{agent.reasoning}</p>
                                </div>
                                <span className="factor-score">+{agent.contribution}</span>
                            </div>
                        ))}
                        {positiveAgents.length === 0 && (
                            <p className="no-factors">No strong positive factors detected.</p>
                        )}
                    </div>

                    {/* Negative Factors */}
                    <div className="factors-column negative">
                        <div className="factors-header">
                            <AlertCircle size={18} />
                            <h3>Areas for Improvement</h3>
                        </div>
                        {[...negativeAgents, ...neutralAgents].map((agent) => (
                            <div key={agent.id} className="factor-item">
                                <span className="factor-icon">{agent.icon}</span>
                                <div className="factor-content">
                                    <span className="factor-title">{agent.name.replace(' Agent', '')}</span>
                                    <p className="factor-text">{agent.reasoning}</p>
                                </div>
                                <span className="factor-score" data-warning={agent.status === 'neutral'}>
                                    +{agent.contribution}
                                </span>
                            </div>
                        ))}
                        {negativeAgents.length === 0 && neutralAgents.length === 0 && (
                            <p className="no-factors">No major concerns detected.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Trust Council Discussion */}
            <div className="card discussion-card">
                <div className="discussion-header">
                    <div className="discussion-title">
                        <Brain size={20} className="brain-icon" />
                        <h2>Inside the AI Trust Council</h2>
                    </div>
                    <div className="consensus-badge" data-level={consensus >= 80 ? 'high' : consensus >= 60 ? 'medium' : 'low'}>
                        <Users size={14} />
                        {consensus}% Aligned
                    </div>
                </div>
                <p className="card-subtitle">
                    Watch how our AI agents discuss and analyze your financial profile.
                </p>

                <div className="discussion-feed">
                    {agentDiscussion.map((entry, index) => (
                        <div
                            key={index}
                            className="discussion-message"
                            data-sentiment={entry.sentiment}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="message-avatar">
                                <span>{entry.icon}</span>
                            </div>
                            <div className="message-content">
                                <span className="message-agent">{entry.agent}</span>
                                <p className="message-text">{entry.statement}</p>
                            </div>
                            <div className="message-indicator" data-sentiment={entry.sentiment} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Payment Punctuality Chart */}
                <div className="card chart-card">
                    <h3>Payment Punctuality</h3>
                    <p className="card-subtitle">On-time vs late payments over 6 months</p>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={historyPayments}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="onTime" fill="var(--success-500)" radius={[4, 4, 0, 0]} name="On Time" />
                                <Bar dataKey="late" fill="var(--error-400)" radius={[4, 4, 0, 0]} name="Late" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Savings Trend Chart */}
                <div className="card chart-card">
                    <h3>Savings Trend</h3>
                    <p className="card-subtitle">Your savings balance over 6 months</p>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={historySavings}>
                                <defs>
                                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--secondary-500)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--secondary-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis hide />
                                <Tooltip
                                    formatter={(value) => [`$${value}`, 'Balance']}
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="var(--secondary-500)"
                                    strokeWidth={2}
                                    fill="url(#savingsGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Agent Detail Breakdown */}
            <div className="card breakdown-card">
                <h2>Detailed Signal Breakdown</h2>
                <p className="card-subtitle">Each AI agent's individual assessment and contribution.</p>

                <div className="breakdown-table">
                    <div className="breakdown-header">
                        <span>Agent</span>
                        <span>Focus Area</span>
                        <span>Score</span>
                        <span>Contribution</span>
                        <span>Confidence</span>
                        <span>Status</span>
                    </div>
                    {agentResults.map((agent) => (
                        <div key={agent.id} className="breakdown-row">
                            <div className="breakdown-agent">
                                <span className="agent-icon">{agent.icon}</span>
                                <span>{agent.name.replace(' Agent', '')}</span>
                            </div>
                            <span className="breakdown-focus">{agent.focus}</span>
                            <span className="breakdown-score">{agent.score}</span>
                            <span className="breakdown-contrib">+{agent.contribution}</span>
                            <div className="breakdown-confidence">
                                <div className="confidence-mini-bar">
                                    <div
                                        className="confidence-mini-fill"
                                        style={{ width: `${agent.confidence}%` }}
                                    />
                                </div>
                                <span>{agent.confidence}%</span>
                            </div>
                            <span
                                className="breakdown-status"
                                style={{ color: getStatusColor(agent.score) }}
                            >
                                {agent.status === 'positive' ? '✓ Strong' : agent.status === 'neutral' ? '◐ Moderate' : '✗ Weak'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spending Volatility Meter */}
            <div className="card volatility-card">
                <h3>Spending Volatility Analysis</h3>
                <p className="card-subtitle">
                    The Spending Behavior Agent detected a volatility of {spendingVolatility}%
                </p>
                <div className="volatility-meter">
                    <div className="volatility-scale">
                        <span className="scale-label">Low</span>
                        <div className="scale-bar">
                            <div
                                className="scale-indicator"
                                style={{ left: `${Math.min(100, spendingVolatility)}%` }}
                            />
                        </div>
                        <span className="scale-label">High</span>
                    </div>
                    <div className="volatility-zones">
                        <div className="zone zone-good" />
                        <div className="zone zone-moderate" />
                        <div className="zone zone-high" />
                    </div>
                </div>
                <p className="volatility-insight">
                    {spendingVolatility < 25
                        ? '✓ Your spending is consistent and predictable.'
                        : spendingVolatility < 40
                            ? '◐ Some spending variations detected. Generally manageable.'
                            : '⚠ High spending volatility may impact your Trust Score.'}
                </p>
            </div>
        </div>
    );
}
