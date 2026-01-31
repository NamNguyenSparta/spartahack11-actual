import { useState } from 'react';
import { Wallet, GraduationCap, Home, Car, CreditCard, Clock, CheckCircle2, AlertCircle, ArrowRight, FileText, Calculator, TrendingDown, DollarSign } from 'lucide-react';
import Header from '../../components/Layout/Header';
import { useApp } from '../../context/AppContext';
import './Loans.css';

const loanTypes = [
    { id: 'student', name: 'Student Loan', icon: GraduationCap, rate: '4.99%', maxAmount: '$50,000', color: '#8b5cf6' },
    { id: 'personal', name: 'Personal Loan', icon: Wallet, rate: '7.49%', maxAmount: '$25,000', color: '#ec4899' },
    { id: 'home', name: 'Home Loan', icon: Home, rate: '6.25%', maxAmount: '$500,000', color: '#06b6d4' },
    { id: 'auto', name: 'Auto Loan', icon: Car, rate: '5.49%', maxAmount: '$75,000', color: '#10b981' },
];

const activeLoans = [
    { id: 1, type: 'Student Loan', lender: 'Federal Aid', amount: 12500, remaining: 8750, rate: 4.5, monthlyPayment: 185, nextPayment: '2026-02-15', status: 'current' },
    { id: 2, type: 'Personal Loan', lender: 'Credence Finance', amount: 5000, remaining: 2100, rate: 7.2, monthlyPayment: 245, nextPayment: '2026-02-01', status: 'current' },
];

const financialAid = [
    { id: 1, name: 'Pell Grant', type: 'Grant', amount: 7395, status: 'Approved', disbursed: true },
    { id: 2, name: 'Michigan Merit Award', type: 'Scholarship', amount: 2500, status: 'Approved', disbursed: true },
    { id: 3, name: 'Work-Study Program', type: 'Employment', amount: 3000, status: 'Active', disbursed: false },
    { id: 4, name: 'Emergency Fund', type: 'Grant', amount: 1000, status: 'Pending', disbursed: false },
];

export default function Loans() {
    const { currentPersona } = useApp();
    const [activeTab, setActiveTab] = useState('overview');

    const totalDebt = activeLoans.reduce((sum, loan) => sum + loan.remaining, 0);
    const totalAid = financialAid.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.amount, 0);

    return (
        <>
            <Header title="Loans & Financial Aid" subtitle="Manage your loans and aid packages" />
            <div className="page-content">
                <div className="loans-layout">
                    {/* Stats Row */}
                    <div className="loans-stats">
                        <div className="loan-stat-card debt">
                            <div className="stat-icon"><TrendingDown size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Total Outstanding Debt</span>
                                <span className="stat-value">${totalDebt.toLocaleString()}</span>
                                <span className="stat-sub">2 active loans</span>
                            </div>
                        </div>
                        <div className="loan-stat-card aid">
                            <div className="stat-icon"><DollarSign size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Total Financial Aid</span>
                                <span className="stat-value">${totalAid.toLocaleString()}</span>
                                <span className="stat-sub">2025-2026 Academic Year</span>
                            </div>
                        </div>
                        <div className="loan-stat-card payment">
                            <div className="stat-icon"><Clock size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Next Payment Due</span>
                                <span className="stat-value">Feb 1, 2026</span>
                                <span className="stat-sub">$430 total</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="loans-tabs">
                        <button className={`loan-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            Overview
                        </button>
                        <button className={`loan-tab ${activeTab === 'apply' ? 'active' : ''}`} onClick={() => setActiveTab('apply')}>
                            Apply for Loan
                        </button>
                        <button className={`loan-tab ${activeTab === 'aid' ? 'active' : ''}`} onClick={() => setActiveTab('aid')}>
                            Financial Aid
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === 'overview' && (
                        <div className="loans-content">
                            <div className="active-loans card">
                                <div className="card-header">
                                    <h3>Active Loans</h3>
                                    <a href="#" className="view-link">View All</a>
                                </div>
                                {activeLoans.map((loan) => (
                                    <div key={loan.id} className="loan-item">
                                        <div className="loan-info">
                                            <div className="loan-icon">
                                                {loan.type === 'Student Loan' ? <GraduationCap size={20} /> : <Wallet size={20} />}
                                            </div>
                                            <div>
                                                <span className="loan-name">{loan.type}</span>
                                                <span className="loan-lender">{loan.lender}</span>
                                            </div>
                                        </div>
                                        <div className="loan-progress-wrap">
                                            <div className="loan-amounts">
                                                <span>${loan.remaining.toLocaleString()} remaining</span>
                                                <span className="loan-total">of ${loan.amount.toLocaleString()}</span>
                                            </div>
                                            <div className="loan-progress">
                                                <div className="progress-fill" style={{ width: `${((loan.amount - loan.remaining) / loan.amount) * 100}%` }} />
                                            </div>
                                        </div>
                                        <div className="loan-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Rate</span>
                                                <span className="detail-value">{loan.rate}%</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Monthly</span>
                                                <span className="detail-value">${loan.monthlyPayment}</span>
                                            </div>
                                        </div>
                                        <div className="loan-status">
                                            <span className={`status-badge ${loan.status}`}>
                                                <CheckCircle2 size={14} /> {loan.status}
                                            </span>
                                            <button className="btn btn-primary btn-sm">Pay Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment History */}
                            <div className="payment-history card">
                                <div className="card-header">
                                    <h3>Payment History</h3>
                                </div>
                                <div className="history-summary">
                                    <div className="history-stat">
                                        <span className="history-value">24</span>
                                        <span className="history-label">On-Time Payments</span>
                                    </div>
                                    <div className="history-stat">
                                        <span className="history-value">1</span>
                                        <span className="history-label">Late Payment</span>
                                    </div>
                                    <div className="history-stat">
                                        <span className="history-value">96%</span>
                                        <span className="history-label">Payment Score</span>
                                    </div>
                                </div>
                                <p className="history-note">Your excellent payment history positively impacts your Credence Trust Score!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'apply' && (
                        <div className="apply-section">
                            <div className="loan-types-grid">
                                {loanTypes.map((type) => (
                                    <div key={type.id} className="loan-type-card card">
                                        <div className="type-icon" style={{ background: `${type.color}15`, color: type.color }}>
                                            <type.icon size={28} />
                                        </div>
                                        <h3>{type.name}</h3>
                                        <div className="type-details">
                                            <div className="type-detail">
                                                <span className="label">Starting Rate</span>
                                                <span className="value">From {type.rate}</span>
                                            </div>
                                            <div className="type-detail">
                                                <span className="label">Up to</span>
                                                <span className="value">{type.maxAmount}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary w-full">Apply Now <ArrowRight size={16} /></button>
                                    </div>
                                ))}
                            </div>

                            <div className="eligibility-card card">
                                <div className="eligibility-header">
                                    <Calculator size={24} />
                                    <div>
                                        <h3>Check Your Eligibility</h3>
                                        <p>See what loans you qualify for based on your Credence Trust Score</p>
                                    </div>
                                </div>
                                <div className="eligibility-score">
                                    <span className="score-label">Your Trust Score</span>
                                    <span className="score-value">{currentPersona.trustScore}</span>
                                    <span className="score-status">Eligible for premium rates!</span>
                                </div>
                                <button className="btn btn-secondary btn-lg w-full">
                                    <FileText size={18} /> View Pre-Approved Offers
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'aid' && (
                        <div className="aid-section">
                            <div className="card">
                                <div className="card-header">
                                    <h3>Financial Aid Package</h3>
                                    <span className="badge badge-purple">2025-2026</span>
                                </div>
                                <div className="aid-list">
                                    {financialAid.map((aid) => (
                                        <div key={aid.id} className="aid-item">
                                            <div className="aid-info">
                                                <div className={`aid-icon ${aid.type.toLowerCase()}`}>
                                                    {aid.type === 'Grant' ? '🎓' : aid.type === 'Scholarship' ? '🏆' : '💼'}
                                                </div>
                                                <div>
                                                    <span className="aid-name">{aid.name}</span>
                                                    <span className="aid-type">{aid.type}</span>
                                                </div>
                                            </div>
                                            <span className="aid-amount">${aid.amount.toLocaleString()}</span>
                                            <span className={`aid-status ${aid.status.toLowerCase()}`}>
                                                {aid.status === 'Approved' && <CheckCircle2 size={14} />}
                                                {aid.status === 'Pending' && <Clock size={14} />}
                                                {aid.status === 'Active' && <AlertCircle size={14} />}
                                                {aid.status}
                                            </span>
                                            <span className={`disbursed ${aid.disbursed ? 'yes' : 'no'}`}>
                                                {aid.disbursed ? 'Disbursed' : 'Pending'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="aid-total">
                                    <span>Total Aid Package</span>
                                    <span className="total-amount">${financialAid.reduce((s, a) => s + a.amount, 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="card apply-aid-card">
                                <h3>Need More Help?</h3>
                                <p>Apply for additional financial aid, emergency funds, or work-study opportunities.</p>
                                <button className="btn btn-primary btn-lg">Apply for Additional Aid</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
