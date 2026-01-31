import { useState } from 'react';
import { Calendar, CreditCard, Clock, AlertCircle, CheckCircle2, XCircle, Plus, MoreHorizontal, ExternalLink, Pause, Play, Trash2 } from 'lucide-react';
import Header from '../../components/Layout/Header';
import './Subscriptions.css';

const subscriptions = [
    { id: 1, name: 'Netflix', category: 'Entertainment', amount: 15.99, billingDate: 28, status: 'active', logo: '🎬', card: '...9512', nextBill: '2026-02-28' },
    { id: 2, name: 'Spotify Premium', category: 'Entertainment', amount: 9.99, billingDate: 26, status: 'active', logo: '🎵', card: '...9512', nextBill: '2026-02-26' },
    { id: 3, name: 'Amazon Prime', category: 'Shopping', amount: 14.99, billingDate: 15, status: 'active', logo: '📦', card: '...6789', nextBill: '2026-02-15' },
    { id: 4, name: 'Gym Membership', category: 'Health', amount: 29.99, billingDate: 1, status: 'active', logo: '💪', card: '...9512', nextBill: '2026-02-01' },
    { id: 5, name: 'Adobe Creative Cloud', category: 'Productivity', amount: 54.99, billingDate: 10, status: 'paused', logo: '🎨', card: '...9512', nextBill: '-' },
    { id: 6, name: 'Notion Plus', category: 'Productivity', amount: 8.00, billingDate: 5, status: 'active', logo: '📝', card: '...6789', nextBill: '2026-02-05' },
    { id: 7, name: 'iCloud Storage', category: 'Cloud', amount: 2.99, billingDate: 12, status: 'active', logo: '☁️', card: '...9512', nextBill: '2026-02-12' },
    { id: 8, name: 'GitHub Pro', category: 'Development', amount: 4.00, billingDate: 20, status: 'active', logo: '💻', card: '...9512', nextBill: '2026-02-20' },
    { id: 9, name: 'Hulu', category: 'Entertainment', amount: 12.99, billingDate: 8, status: 'cancelled', logo: '📺', card: '-', nextBill: '-' },
];

const upcomingBills = subscriptions
    .filter(s => s.status === 'active')
    .sort((a, b) => a.billingDate - b.billingDate)
    .slice(0, 5);

export default function Subscriptions() {
    const [filter, setFilter] = useState('all');

    const totalMonthly = subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const pausedCount = subscriptions.filter(s => s.status === 'paused').length;

    const filtered = filter === 'all' ? subscriptions : subscriptions.filter(s => s.status === filter);

    const categories = [...new Set(subscriptions.map(s => s.category))];

    return (
        <>
            <Header title="Subscriptions" subtitle="Track and manage your recurring payments" />
            <div className="page-content">
                <div className="subscriptions-layout">
                    {/* Stats */}
                    <div className="sub-stats">
                        <div className="sub-stat-card primary">
                            <div className="stat-icon"><CreditCard size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Monthly Spending</span>
                                <span className="stat-value">${totalMonthly.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="sub-stat-card">
                            <div className="stat-icon active"><CheckCircle2 size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Active</span>
                                <span className="stat-value">{activeCount}</span>
                            </div>
                        </div>
                        <div className="sub-stat-card">
                            <div className="stat-icon paused"><Pause size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Paused</span>
                                <span className="stat-value">{pausedCount}</span>
                            </div>
                        </div>
                        <div className="sub-stat-card">
                            <div className="stat-icon upcoming"><Calendar size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Next Bill</span>
                                <span className="stat-value">Feb 1</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="sub-main">
                        {/* Subscriptions List */}
                        <div className="card sub-list-card">
                            <div className="sub-list-header">
                                <div className="filter-tabs">
                                    <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                                    <button className={`filter-tab ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
                                    <button className={`filter-tab ${filter === 'paused' ? 'active' : ''}`} onClick={() => setFilter('paused')}>Paused</button>
                                    <button className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`} onClick={() => setFilter('cancelled')}>Cancelled</button>
                                </div>
                                <button className="btn btn-primary btn-sm"><Plus size={16} /> Add Subscription</button>
                            </div>

                            <div className="sub-table">
                                <div className="table-header">
                                    <span>Service</span>
                                    <span>Category</span>
                                    <span>Amount</span>
                                    <span>Next Bill</span>
                                    <span>Card</span>
                                    <span>Status</span>
                                    <span></span>
                                </div>
                                {filtered.map((sub) => (
                                    <div key={sub.id} className={`table-row ${sub.status}`}>
                                        <div className="service-info">
                                            <div className="service-logo">{sub.logo}</div>
                                            <span className="service-name">{sub.name}</span>
                                        </div>
                                        <span className="category-badge">{sub.category}</span>
                                        <span className="amount">${sub.amount.toFixed(2)}/mo</span>
                                        <span className="next-bill">{sub.nextBill !== '-' ? new Date(sub.nextBill).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</span>
                                        <span className="card-used">{sub.card}</span>
                                        <span className={`status-badge ${sub.status}`}>
                                            {sub.status === 'active' && <CheckCircle2 size={12} />}
                                            {sub.status === 'paused' && <Pause size={12} />}
                                            {sub.status === 'cancelled' && <XCircle size={12} />}
                                            {sub.status}
                                        </span>
                                        <div className="row-actions">
                                            <button className="btn-icon-sm"><MoreHorizontal size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sub-sidebar">
                        {/* Upcoming Bills */}
                        <div className="card upcoming-bills">
                            <div className="card-header">
                                <h3><Clock size={18} /> Upcoming Bills</h3>
                            </div>
                            <div className="bills-list">
                                {upcomingBills.map((bill) => (
                                    <div key={bill.id} className="bill-item">
                                        <div className="bill-logo">{bill.logo}</div>
                                        <div className="bill-info">
                                            <span className="bill-name">{bill.name}</span>
                                            <span className="bill-date">{new Date(bill.nextBill).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <span className="bill-amount">-${bill.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bills-total">
                                <span>Total Upcoming</span>
                                <span className="total-amount">-${upcomingBills.reduce((s, b) => s + b.amount, 0).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* By Category */}
                        <div className="card category-breakdown">
                            <div className="card-header">
                                <h3>By Category</h3>
                            </div>
                            <div className="category-list">
                                {categories.map((cat) => {
                                    const catSubs = subscriptions.filter(s => s.category === cat && s.status === 'active');
                                    const catTotal = catSubs.reduce((s, sub) => s + sub.amount, 0);
                                    return (
                                        <div key={cat} className="category-row">
                                            <div className="cat-info">
                                                <span className="cat-name">{cat}</span>
                                                <span className="cat-count">{catSubs.length} subscription{catSubs.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <span className="cat-total">${catTotal.toFixed(2)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Savings Tip */}
                        <div className="card savings-tip">
                            <AlertCircle size={24} className="tip-icon" />
                            <h4>Potential Savings</h4>
                            <p>You have 1 paused subscription. Consider cancelling if unused to save $54.99/mo.</p>
                            <button className="btn btn-secondary btn-sm w-full">Review Subscriptions</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
