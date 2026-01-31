import { useState } from 'react';
import { CreditCard, Plus, Settings, Lock, Unlock, Eye, EyeOff, Copy, MoreHorizontal, Wifi, Trash2 } from 'lucide-react';
import Header from '../../components/Layout/Header';
import './Cards.css';

const cards = [
    { id: 1, type: 'Visa', number: '5827 4920 4459 9512', expiry: '12/28', cvv: '***', balance: 4250.00, limit: 10000, status: 'active', color: 'pink' },
    { id: 2, type: 'Mastercard', number: '4532 8901 2345 6789', expiry: '08/27', cvv: '***', balance: 1850.00, limit: 5000, status: 'active', color: 'purple' },
    { id: 3, type: 'Virtual', number: '6011 2233 4455 6677', expiry: '03/26', cvv: '***', balance: 500.00, limit: 1000, status: 'locked', color: 'cyan' },
];

const recentCardTx = [
    { id: 1, merchant: 'Netflix Subscription', amount: 15.99, date: '2026-01-28', card: '...9512', category: 'Entertainment' },
    { id: 2, merchant: 'Spotify Premium', amount: 9.99, date: '2026-01-26', card: '...9512', category: 'Entertainment' },
    { id: 3, merchant: 'Amazon Prime', amount: 14.99, date: '2026-01-25', card: '...6789', category: 'Shopping' },
    { id: 4, merchant: 'Uber Eats', amount: 28.50, date: '2026-01-24', card: '...9512', category: 'Food' },
    { id: 5, merchant: 'Starbucks', amount: 6.45, date: '2026-01-23', card: '...9512', category: 'Food' },
];

export default function Cards() {
    const [selectedCard, setSelectedCard] = useState(0);
    const [showDetails, setShowDetails] = useState(false);

    const card = cards[selectedCard];

    return (
        <>
            <Header title="My Cards" subtitle="Manage your credit and debit cards" />
            <div className="page-content">
                <div className="cards-layout">
                    {/* Cards Carousel */}
                    <div className="cards-carousel">
                        <div className="cards-list">
                            {cards.map((c, idx) => (
                                <div
                                    key={c.id}
                                    className={`card-item ${c.color} ${selectedCard === idx ? 'active' : ''} ${c.status === 'locked' ? 'locked' : ''}`}
                                    onClick={() => setSelectedCard(idx)}
                                >
                                    <div className="card-header-row">
                                        <Wifi size={20} />
                                        <span className="card-type">{c.type}</span>
                                    </div>
                                    <div className="card-chip-area">
                                        <div className="chip" />
                                    </div>
                                    <div className="card-number-display">
                                        {showDetails && selectedCard === idx ? c.number : c.number.replace(/\d{4}(?=\s)/g, '****').slice(0, -4) + c.number.slice(-4)}
                                    </div>
                                    <div className="card-footer-row">
                                        <div className="card-detail">
                                            <span className="label">Expires</span>
                                            <span className="value">{c.expiry}</span>
                                        </div>
                                        <div className="card-balance">
                                            <span className="label">Balance</span>
                                            <span className="value">${c.balance.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {c.status === 'locked' && (
                                        <div className="locked-overlay">
                                            <Lock size={32} />
                                            <span>Card Locked</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button className="add-card-btn">
                                <Plus size={24} />
                                <span>Add New Card</span>
                            </button>
                        </div>
                    </div>

                    {/* Card Details & Actions */}
                    <div className="card-details-panel card">
                        <div className="panel-header">
                            <h3>Card Details</h3>
                            <button className="btn-icon" onClick={() => setShowDetails(!showDetails)}>
                                {showDetails ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="detail-rows">
                            <div className="detail-row">
                                <span className="label">Card Number</span>
                                <div className="value-with-action">
                                    <span className="value">{showDetails ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}</span>
                                    <button className="btn-icon-sm"><Copy size={14} /></button>
                                </div>
                            </div>
                            <div className="detail-row">
                                <span className="label">Expiry Date</span>
                                <span className="value">{card.expiry}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">CVV</span>
                                <span className="value">{showDetails ? '847' : '•••'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Credit Limit</span>
                                <span className="value">${card.limit.toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Available Credit</span>
                                <span className="value highlight">${(card.limit - card.balance).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="card-usage">
                            <div className="usage-header">
                                <span>Usage This Month</span>
                                <span className="usage-percent">{((card.balance / card.limit) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="usage-bar">
                                <div className="usage-fill" style={{ width: `${(card.balance / card.limit) * 100}%` }} />
                            </div>
                            <div className="usage-labels">
                                <span>${card.balance.toLocaleString()} used</span>
                                <span>${card.limit.toLocaleString()} limit</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className={`action-btn ${card.status === 'locked' ? 'unlock' : 'lock'}`}>
                                {card.status === 'locked' ? <Unlock size={18} /> : <Lock size={18} />}
                                {card.status === 'locked' ? 'Unlock Card' : 'Lock Card'}
                            </button>
                            <button className="action-btn settings">
                                <Settings size={18} /> Settings
                            </button>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="card-transactions card">
                        <div className="panel-header">
                            <h3>Recent Card Transactions</h3>
                            <a href="/analytics" className="view-link">View All</a>
                        </div>
                        <div className="tx-list">
                            {recentCardTx.map((tx) => (
                                <div key={tx.id} className="tx-item">
                                    <div className="tx-icon">{tx.category === 'Entertainment' ? '🎬' : tx.category === 'Shopping' ? '🛒' : '🍔'}</div>
                                    <div className="tx-info">
                                        <span className="tx-merchant">{tx.merchant}</span>
                                        <span className="tx-meta">{tx.date} • {tx.card}</span>
                                    </div>
                                    <span className="tx-amount">-${tx.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
