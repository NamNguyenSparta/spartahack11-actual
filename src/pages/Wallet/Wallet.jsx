import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, CreditCard, Send, Download, ArrowUpRight, MoreHorizontal, Wifi } from 'lucide-react';
import './Wallet.css';

// Mock transaction data
const TRANSACTIONS = [
    { id: 1, name: 'Starbucks Coffee', category: 'food', icon: '☕', amount: -5.40, date: 'Today, 9:32 AM', status: 'completed' },
    { id: 2, name: 'Netflix Subscription', category: 'subscription', icon: '🎬', amount: -15.99, date: 'Jan 30, 2025', status: 'completed' },
    { id: 3, name: 'Work Study Deposit', category: 'income', icon: '💰', amount: 425.00, date: 'Jan 28, 2025', status: 'completed' },
    { id: 4, name: 'Amazon Purchase', category: 'shopping', icon: '📦', amount: -67.89, date: 'Jan 27, 2025', status: 'completed' },
    { id: 5, name: 'College Fee Payment', category: 'education', icon: '🎓', amount: -1250.00, date: 'Jan 25, 2025', status: 'completed' },
    { id: 6, name: 'Spotify Premium', category: 'subscription', icon: '🎵', amount: -9.99, date: 'Jan 24, 2025', status: 'completed' },
    { id: 7, name: 'Transfer from Mom', category: 'transfer', icon: '💝', amount: 200.00, date: 'Jan 22, 2025', status: 'completed' },
    { id: 8, name: 'Chipotle', category: 'food', icon: '🌯', amount: -12.50, date: 'Jan 21, 2025', status: 'completed' },
    { id: 9, name: 'Uber Ride', category: 'entertainment', icon: '🚗', amount: -18.75, date: 'Jan 20, 2025', status: 'completed' },
    { id: 10, name: 'Scholarship Deposit', category: 'income', icon: '🎁', amount: 2000.00, date: 'Jan 15, 2025', status: 'completed' },
];

export default function Wallet() {
    const { user, currentPersona } = useApp();
    const [selectedCard, setSelectedCard] = useState(0);

    const userName = user?.name || 'Student';
    const accountBalance = currentPersona?.wealth?.accountBalance || 2450;

    // Calculate total from transactions
    const totalBalance = TRANSACTIONS.reduce((sum, t) => sum + t.amount, accountBalance);

    // Generate card number with last 4 digits based on user
    const cardNumber = `5627 4820 4439 ${String(userName.charCodeAt(0) * 73).slice(0, 4)}`;

    return (
        <div className="wallet-page">
            {/* Header */}
            <div className="wallet-header">
                <div>
                    <h1>My Wallet</h1>
                    <p className="wallet-subtitle">Manage your cards and transactions</p>
                </div>
                <button className="add-card-btn">
                    <Plus size={18} />
                    Add New Card
                </button>
            </div>

            <div className="wallet-grid">
                {/* Left: Card Section */}
                <div className="card-section">
                    <div>
                        <h3 className="section-title">Credit Card</h3>

                        {/* Beautiful Credit Card */}
                        <div className={`credit-card gradient-1`}>
                            <div className="card-bg-pattern"></div>

                            <div className="card-header">
                                <span className="card-bank">CREDENCE</span>
                                <div className="card-type">
                                    <div className="card-chip"></div>
                                    <Wifi size={20} className="contactless-icon" style={{ transform: 'rotate(90deg)' }} />
                                </div>
                            </div>

                            <div className="card-number">
                                {cardNumber}
                            </div>

                            <div className="card-footer">
                                <div className="card-holder">
                                    <span className="label">Card Holder</span>
                                    <span className="value">{userName.toUpperCase()}</span>
                                </div>
                                <div className="card-expiry">
                                    <span className="label">Expires</span>
                                    <span className="value">12/28</span>
                                </div>
                            </div>

                            {/* Mastercard Logo */}
                            <div className="card-brand">
                                <div className="card-brand-circle red"></div>
                                <div className="card-brand-circle orange"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card Info */}
                    <div className="card-info">
                        <div className="card-info-item">
                            <span className="label">Current Balance</span>
                            <span className="value">${accountBalance.toLocaleString()}</span>
                        </div>
                        <div className="card-info-item">
                            <span className="label">Credit Limit</span>
                            <span className="value positive">$5,000</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button className="quick-action-btn">
                            <Send size={20} />
                            <span>Transfer</span>
                        </button>
                        <button className="quick-action-btn">
                            <Download size={20} />
                            <span>Deposit</span>
                        </button>
                        <button className="quick-action-btn">
                            <MoreHorizontal size={20} />
                            <span>More</span>
                        </button>
                    </div>
                </div>

                {/* Right: Transactions */}
                <div className="transactions-section">
                    <div className="transactions-header">
                        <h2>All Transactions</h2>
                        <div className="total-balance">
                            <span className="label">Total Balance</span>
                            <span className="amount">${totalBalance.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="transactions-list">
                        {TRANSACTIONS.map(transaction => (
                            <div key={transaction.id} className="transaction-item">
                                <div className={`transaction-icon ${transaction.category}`}>
                                    {transaction.icon}
                                </div>
                                <div className="transaction-details">
                                    <div className="transaction-name">{transaction.name}</div>
                                    <div className="transaction-date">{transaction.date}</div>
                                </div>
                                <div className="transaction-amount-container">
                                    <div className={`transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                    </div>
                                    <div className={`transaction-status ${transaction.status}`}>
                                        {transaction.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="view-all-btn">
                        View All Transactions →
                    </button>
                </div>
            </div>
        </div>
    );
}
