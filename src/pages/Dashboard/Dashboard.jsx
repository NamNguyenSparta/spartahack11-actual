import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Plus, MoreHorizontal, Send, Download, CreditCard, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getScoreRating } from '../../data/mockData';
import Header from '../../components/Layout/Header';
import './Dashboard.css';

export default function Dashboard() {
    const { currentPersona, judgeView } = useApp();
    const rating = getScoreRating(currentPersona.trustScore);

    const quickActions = [
        { icon: Send, label: 'Send', color: '#ec4899' },
        { icon: Download, label: 'Receive', color: '#8b5cf6' },
        { icon: CreditCard, label: 'Cards', color: '#06b6d4' },
        { icon: Zap, label: 'Pay Bills', color: '#10b981' },
    ];

    return (
        <>
            <Header title={`Welcome to Credence`} subtitle={`Hello ${currentPersona.name}, welcome back!`} />
            <div className="page-content">
                <div className="dashboard-layout">
                    {/* Left Column */}
                    <div className="dashboard-left">
                        {/* Credit Card Section */}
                        <div className="card credit-card-section">
                            <div className="section-header">
                                <h3>Credit Card</h3>
                                <div className="card-tabs">
                                    <button className="tab active">All Cards</button>
                                    <button className="tab">+ Add New</button>
                                </div>
                            </div>

                            <div className="credit-card-display">
                                <div className="credit-card">
                                    <div className="card-chip"></div>
                                    <div className="card-type">VISA</div>
                                    <div className="card-number">5827  4920  4459  9512</div>
                                    <div className="card-bottom">
                                        <div className="card-holder">
                                            <span className="label">Internet Payment Limit</span>
                                            <span className="value">$890</span>
                                        </div>
                                        <div className="card-expiry">
                                            <span className="label">Status</span>
                                            <span className="value">Active</span>
                                        </div>
                                    </div>
                                    <div className="card-shine"></div>
                                </div>

                                <div className="card-info">
                                    <div className="info-item">
                                        <span className="label">Create New Card</span>
                                        <button className="btn-circle"><Plus size={20} /></button>
                                    </div>
                                    <div className="active-subscriptions">
                                        <span className="count">11</span>
                                        <span className="label">active subscriptions</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions">
                                {quickActions.map((action) => (
                                    <button key={action.label} className="quick-action">
                                        <div className="action-icon" style={{ background: `${action.color}15`, color: action.color }}>
                                            <action.icon size={20} />
                                        </div>
                                        <span>{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card activity-section">
                            <div className="section-header">
                                <h3>Recent Activity</h3>
                                <a href="/analytics" className="view-link">View All</a>
                            </div>
                            <div className="activity-list">
                                {currentPersona.transactions.slice(0, 5).map((tx) => (
                                    <div key={tx.id} className="activity-item">
                                        <div className={`activity-icon ${tx.type}`}>
                                            {tx.type === 'credit' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div className="activity-info">
                                            <span className="activity-name">{tx.description}</span>
                                            <span className="activity-date">{tx.date}</span>
                                        </div>
                                        <div className="activity-amount-wrap">
                                            <span className={`activity-amount ${tx.type}`}>
                                                {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                            </span>
                                            <span className={`activity-status ${tx.status}`}>{tx.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="dashboard-right">
                        {/* Trust Score Widget */}
                        <div className="card trust-widget">
                            <div className="trust-header">
                                <h3>Trust Score</h3>
                                <button className="btn-icon"><MoreHorizontal size={18} /></button>
                            </div>
                            <div className="trust-score-display">
                                <div className="score-ring" style={{ '--score': currentPersona.trustScore, '--color': rating.color }}>
                                    <span className="score-number">{currentPersona.trustScore}</span>
                                </div>
                                <div className="score-details">
                                    <span className="score-rating" style={{ color: rating.color }}>{rating.label}</span>
                                    <p className="score-desc">{rating.description}</p>
                                </div>
                            </div>
                            <div className="score-chart">
                                <ResponsiveContainer width="100%" height={80}>
                                    <AreaChart data={currentPersona.scoreHistory}>
                                        <defs>
                                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2} fill="url(#scoreGrad)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* All Transactions Summary */}
                        <div className="card transactions-summary">
                            <div className="section-header">
                                <h3>All Transactions</h3>
                                <button className="btn-icon"><MoreHorizontal size={18} /></button>
                            </div>
                            <div className="total-balance">
                                <span className="balance-label">Total Balance</span>
                                <span className="balance-amount">$113,650<sup>.08</sup></span>
                            </div>
                            <div className="transaction-categories">
                                {currentPersona.spendingCategories.slice(0, 4).map((cat, i) => (
                                    <div key={cat.name} className="category-item">
                                        <div className="category-icon" style={{ background: ['#fce7f3', '#e9d5ff', '#d1fae5', '#fef3c7'][i] }}>
                                            {['🏠', '🛒', '⚡', '🚗'][i]}
                                        </div>
                                        <div className="category-info">
                                            <span className="category-name">{cat.name}</span>
                                            <span className="category-percent">{cat.percentage}%</span>
                                        </div>
                                        <span className="category-amount">-${cat.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="card payment-details">
                            <div className="section-header">
                                <h3>Payment Details</h3>
                            </div>
                            <div className="payment-recipient">
                                <div className="recipient-avatar">📱</div>
                                <div className="recipient-info">
                                    <span className="recipient-name">Mobile Bank Limited</span>
                                    <span className="recipient-type">Transfer</span>
                                </div>
                                <span className="payment-amount">+$1,550.00</span>
                            </div>
                            <div className="payment-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Type</span>
                                    <span className="meta-value">Category</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Transfer</span>
                                    <span className="meta-value">Income</span>
                                </div>
                            </div>
                            <div className="payment-actions">
                                <button className="btn btn-secondary">Manage</button>
                                <button className="btn btn-primary">Receive</button>
                            </div>
                            <a href="#" className="add-beneficiary">+ Add as a Beneficiary</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
