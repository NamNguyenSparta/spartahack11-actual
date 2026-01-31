import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { snowflakeQueries } from '../../data/mockData';
import Header from '../../components/Layout/Header';
import './Analytics.css';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a78bfa'];

export default function Analytics() {
    const { currentPersona, judgeView } = useApp();
    const savingsDeltas = snowflakeQueries.monthlySavingsDeltas(currentPersona.savingsHistory);
    const punctuality = snowflakeQueries.paymentPunctuality(currentPersona.paymentHistory);
    const volatility = snowflakeQueries.volatilityMeasure(currentPersona.spendingCategories);

    return (
        <>
            <Header title="Analytics" subtitle="Detailed breakdown of your trust score factors" />
            <div className="page-content">
                <div className="analytics-grid">
                    {/* Score Factors */}
                    <div className="card factors-card">
                        <h3>What Changed Your Score</h3>
                        <p className="card-subtitle">Explainable factors from the last 6 months</p>
                        <div className="factors-list">
                            {currentPersona.scoreFactors.map((factor, i) => (
                                <div key={i} className={`factor-item ${factor.type}`}>
                                    <span className="factor-icon">
                                        {factor.type === 'positive' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                    </span>
                                    <span className="factor-label">{factor.label}</span>
                                    <span className={`factor-points ${factor.type}`}>{factor.points}</span>
                                </div>
                            ))}
                        </div>
                        {judgeView && (
                            <div className="judge-info-box">
                                <Info size={14} /> Each factor is weighted based on recency and magnitude of impact.
                            </div>
                        )}
                    </div>

                    {/* Savings Trend */}
                    <div className="card chart-card">
                        <h3>Savings Balance Trend</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={currentPersona.savingsHistory}>
                                    <defs>
                                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip contentStyle={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={(v) => [`$${v}`, 'Balance']} />
                                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#savingsGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Punctuality */}
                    <div className="card chart-card">
                        <h3>Payment Punctuality Timeline</h3>
                        <div className="punctuality-stat">
                            <span className="big-stat">{punctuality}%</span>
                            <span className="stat-label">On-time payments</span>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={currentPersona.paymentHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                    <Bar dataKey="onTime" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="On-time" />
                                    <Bar dataKey="late" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Late" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Spending Distribution */}
                    <div className="card chart-card spending-card">
                        <h3>Spending Distribution</h3>
                        <div className="spending-content">
                            <div className="pie-container">
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie data={currentPersona.spendingCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="amount">
                                            {currentPersona.spendingCategories.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={(v) => [`$${v}`, '']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="spending-legend">
                                {currentPersona.spendingCategories.map((cat, i) => (
                                    <div key={cat.name} className="legend-item">
                                        <span className="legend-dot" style={{ background: COLORS[i] }} />
                                        <span className="legend-name">{cat.name}</span>
                                        <span className="legend-value">{cat.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="volatility-indicator">
                            <span>Volatility Index:</span>
                            <span className={`volatility-value ${volatility > 0.5 ? 'high' : volatility > 0.3 ? 'medium' : 'low'}`}>
                                {(volatility * 100).toFixed(0)}% {volatility > 0.5 ? '(High)' : volatility > 0.3 ? '(Medium)' : '(Low)'}
                            </span>
                        </div>
                    </div>

                    {/* Monthly Deltas */}
                    <div className="card deltas-card">
                        <h3>Monthly Savings Changes</h3>
                        <div className="deltas-list">
                            {savingsDeltas.map((d) => (
                                <div key={d.month} className="delta-item">
                                    <span className="delta-month">{d.month}</span>
                                    <span className={`delta-value ${d.delta >= 0 ? 'positive' : 'negative'}`}>
                                        {d.delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {d.delta >= 0 ? '+' : ''}${d.delta}
                                    </span>
                                    <span className={`delta-percent ${d.delta >= 0 ? 'positive' : 'negative'}`}>
                                        {d.percentChange}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
