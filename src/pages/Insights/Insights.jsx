import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Plus, Minus, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Insights.css';

export default function Insights() {
    const { currentPersona, getStatusColor } = useApp();

    return (
        <div className="insights">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Why is my score this?</h1>
                    <p>Explainable breakdown of your Trust Reputation</p>
                </div>
                <div className="score-badge">
                    <span className="score">{currentPersona.trustScore}</span>
                    <span className="label">Current Score</span>
                </div>
            </div>

            {/* What Built Your Reputation */}
            <section className="factors-section">
                <h2>What built your reputation this month?</h2>
                <div className="factors-grid">
                    {currentPersona.factors.map((factor, i) => (
                        <div key={i} className={`factor-card card ${factor.type}`}>
                            <div className={`factor-icon ${factor.type}`}>
                                {factor.type === 'positive' ? <Plus size={18} /> : <Minus size={18} />}
                            </div>
                            <span className="factor-text">{factor.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Payment Punctuality Timeline */}
                <div className="chart-card card">
                    <div className="card-header">
                        <div>
                            <h3>Payment Punctuality</h3>
                            <p className="subtitle">On-time vs late payments</p>
                        </div>
                        <div className="header-stat">
                            <span className="stat-value">{currentPersona.signals.paymentReliability.onTime}/{currentPersona.signals.paymentReliability.total}</span>
                            <span className="stat-label">On Time</span>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={currentPersona.history.payments} barGap={4}>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar dataKey="onTime" name="On Time" stackId="a" radius={[4, 4, 0, 0]}>
                                    {currentPersona.history.payments.map((_, index) => (
                                        <Cell key={index} fill="#10b981" />
                                    ))}
                                </Bar>
                                <Bar dataKey="late" name="Late" stackId="a" radius={[4, 4, 0, 0]}>
                                    {currentPersona.history.payments.map((_, index) => (
                                        <Cell key={index} fill="#ef4444" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-legend">
                        <span className="legend-item"><span className="dot success" /> On Time</span>
                        <span className="legend-item"><span className="dot danger" /> Late</span>
                    </div>
                </div>

                {/* Savings Balance Trend */}
                <div className="chart-card card">
                    <div className="card-header">
                        <div>
                            <h3>Savings Trend</h3>
                            <p className="subtitle">6-month savings pattern</p>
                        </div>
                        <div className={`trend-indicator ${currentPersona.signals.savingsStability.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                            {currentPersona.signals.savingsStability.trend.startsWith('+') ?
                                <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {currentPersona.signals.savingsStability.trend}
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={currentPersona.history.savings}>
                                <defs>
                                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    formatter={(value) => [`$${value}`, 'Savings']}
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    fill="url(#savingsGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Spending Volatility Meter */}
            <section className="volatility-section">
                <div className="card volatility-card">
                    <div className="card-header">
                        <div>
                            <h3>Spending Volatility Meter</h3>
                            <p className="subtitle">How predictable is your spending?</p>
                        </div>
                        <Activity size={24} className="header-icon" />
                    </div>

                    <div className="volatility-meter">
                        <div className="meter-bar">
                            <div
                                className="meter-fill"
                                style={{
                                    width: `${100 - currentPersona.signals.spendingStability.score}%`,
                                }}
                            />
                            <div
                                className="meter-indicator"
                                style={{ left: `${100 - currentPersona.signals.spendingStability.score}%` }}
                            />
                        </div>
                        <div className="meter-labels">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                        </div>
                    </div>

                    <div className={`volatility-status ${getStatusColor(currentPersona.signals.spendingStability.score)}`}>
                        {currentPersona.signals.spendingStability.score >= 70 ? (
                            <>
                                <CheckCircle2 size={18} />
                                <div>
                                    <strong>Low volatility detected</strong>
                                    <p>Your spending patterns are consistent and predictable.</p>
                                </div>
                            </>
                        ) : currentPersona.signals.spendingStability.score >= 50 ? (
                            <>
                                <AlertCircle size={18} />
                                <div>
                                    <strong>Moderate volatility detected</strong>
                                    <p>Some spending spikes detected. Consider more consistent patterns.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={18} />
                                <div>
                                    <strong>High volatility detected</strong>
                                    <p>Variable spending patterns may impact your Trust Score.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Signal Breakdown */}
            <section className="signal-section">
                <h2>Signal Breakdown</h2>
                <div className="signal-grid">
                    {Object.entries(currentPersona.signals).map(([key, signal]) => {
                        const labels = {
                            paymentReliability: { name: 'Payment Reliability', weight: '40%' },
                            savingsStability: { name: 'Savings Stability', weight: '25%' },
                            incomeConsistency: { name: 'Income Consistency', weight: '20%' },
                            spendingStability: { name: 'Spending Stability', weight: '15%' },
                        };
                        const statusColor = getStatusColor(signal.score);
                        return (
                            <div key={key} className="signal-card card">
                                <div className="signal-header">
                                    <span className="signal-name">{labels[key].name}</span>
                                    <span className="signal-weight">{labels[key].weight}</span>
                                </div>
                                <div className="signal-score-row">
                                    <div className="progress progress-thick">
                                        <div
                                            className={`progress-bar progress-bar-${statusColor}`}
                                            style={{ width: `${signal.score}%` }}
                                        />
                                    </div>
                                    <span className="signal-value">{signal.score}</span>
                                </div>
                                <div className={`signal-status ${statusColor}`}>
                                    {statusColor === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                    {signal.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
