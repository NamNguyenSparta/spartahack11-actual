import { Building2, Shield, CheckCircle2, AlertCircle, TrendingUp, User, FileText, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './BusinessView.css';

export default function BusinessView() {
    const { currentPersona, getStatusColor, getRiskColor } = useApp();

    const indicators = [
        { key: 'paymentReliability', label: 'Payment Reliability', icon: '💳' },
        { key: 'incomeConsistency', label: 'Income Stability', icon: '💼' },
        { key: 'savingsStability', label: 'Savings Buffer', icon: '🏦' },
        { key: 'spendingStability', label: 'Spending Volatility', icon: '📊' },
    ];

    const getRiskDescription = () => {
        if (currentPersona.trustScore >= 80) {
            return 'This applicant demonstrates excellent financial reliability patterns.';
        } else if (currentPersona.trustScore >= 60) {
            return 'This applicant shows moderate reliability with some areas for review.';
        } else {
            return 'This applicant has areas of concern that may require additional verification.';
        }
    };

    return (
        <div className="business-view">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Applicant Review</h1>
                    <p>Underwriting dashboard for trust verification</p>
                </div>
                <div className="business-badge">
                    <Building2 size={16} />
                    Business View
                </div>
            </div>

            {/* Applicant Overview */}
            <div className="applicant-card card">
                <div className="applicant-header">
                    <div className="applicant-info">
                        <div className="applicant-avatar">
                            <User size={28} />
                        </div>
                        <div>
                            <h2>{currentPersona.name}</h2>
                            <p className="applicant-desc">{currentPersona.description}</p>
                        </div>
                    </div>
                    <div className="applicant-actions">
                        <button className="btn btn-success">
                            <CheckCircle2 size={16} />
                            Approve
                        </button>
                        <button className="btn btn-secondary">
                            <FileText size={16} />
                            Request More Info
                        </button>
                    </div>
                </div>

                <div className="applicant-stats">
                    <div className="stat-box trust-score">
                        <span className="stat-label">Applicant Trust Score</span>
                        <span className="stat-value">{currentPersona.trustScore}</span>
                    </div>
                    <div className="stat-box risk-tier">
                        <span className="stat-label">Risk Tier</span>
                        <span className={`stat-value ${getRiskColor(currentPersona.riskTier)}`}>
                            {currentPersona.riskTier}
                        </span>
                    </div>
                    <div className="stat-box confidence">
                        <span className="stat-label">Confidence Level</span>
                        <span className={`stat-value ${getStatusColor(currentPersona.trustScore)}`}>
                            {currentPersona.confidenceLevel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Behavioral Indicators */}
            <section className="indicators-section">
                <h2>Behavioral Indicators</h2>
                <div className="indicators-grid">
                    {indicators.map((indicator) => {
                        const signal = currentPersona.signals[indicator.key];
                        const statusColor = getStatusColor(signal.score);
                        return (
                            <div key={indicator.key} className="indicator-card card">
                                <div className="indicator-header">
                                    <span className="indicator-icon">{indicator.icon}</span>
                                    <span className="indicator-label">{indicator.label}</span>
                                </div>
                                <div className="indicator-value">
                                    <div className={`indicator-status ${statusColor}`}>
                                        {signal.label}
                                    </div>
                                    <span className="indicator-score">{signal.score}/100</span>
                                </div>
                                <div className="progress">
                                    <div
                                        className={`progress-bar progress-bar-${statusColor}`}
                                        style={{ width: `${signal.score}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Why Trustworthy Section */}
            <section className="trust-section">
                <div className="card trust-card">
                    <div className="trust-header">
                        <div>
                            <h2>Why this applicant is trustworthy</h2>
                            <p>{getRiskDescription()}</p>
                        </div>
                        <Shield className="trust-icon" size={32} />
                    </div>

                    <div className="trust-factors">
                        {currentPersona.factors.map((factor, i) => (
                            <div key={i} className={`trust-factor ${factor.type}`}>
                                {factor.type === 'positive' ? (
                                    <CheckCircle2 size={18} className="factor-icon" />
                                ) : (
                                    <XCircle size={18} className="factor-icon" />
                                )}
                                <span>{factor.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Signal Details */}
            <section className="details-section">
                <h2>Signal Details</h2>
                <div className="details-grid">
                    <div className="detail-card card">
                        <div className="detail-header">
                            <span className="detail-icon">💳</span>
                            <h3>Payment History</h3>
                        </div>
                        <div className="detail-stats">
                            <div className="detail-stat">
                                <span className="value">{currentPersona.signals.paymentReliability.onTime}</span>
                                <span className="label">On-Time</span>
                            </div>
                            <div className="detail-stat">
                                <span className="value">{currentPersona.signals.paymentReliability.total - currentPersona.signals.paymentReliability.onTime}</span>
                                <span className="label">Late</span>
                            </div>
                            <div className="detail-stat">
                                <span className="value">{Math.round((currentPersona.signals.paymentReliability.onTime / currentPersona.signals.paymentReliability.total) * 100)}%</span>
                                <span className="label">On-Time Rate</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-card card">
                        <div className="detail-header">
                            <span className="detail-icon">💰</span>
                            <h3>Savings Analysis</h3>
                        </div>
                        <div className="detail-stats">
                            <div className="detail-stat">
                                <span className="value">{currentPersona.signals.savingsStability.trend}</span>
                                <span className="label">6-Month Trend</span>
                            </div>
                            <div className="detail-stat">
                                <span className={`value ${getStatusColor(currentPersona.signals.savingsStability.score)}`}>
                                    {currentPersona.signals.savingsStability.label}
                                </span>
                                <span className="label">Buffer Status</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-card card">
                        <div className="detail-header">
                            <span className="detail-icon">📊</span>
                            <h3>Spending Pattern</h3>
                        </div>
                        <div className="detail-stats">
                            <div className="detail-stat">
                                <span className="value">{currentPersona.signals.spendingStability.volatility}</span>
                                <span className="label">Volatility</span>
                            </div>
                            <div className="detail-stat">
                                <span className={`value ${getStatusColor(currentPersona.signals.spendingStability.score)}`}>
                                    {currentPersona.signals.spendingStability.label}
                                </span>
                                <span className="label">Stability</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Sources */}
            <div className="sources-card card">
                <h3>Data Sources</h3>
                <p>This trust assessment is based on behavioral signals from verified financial sources:</p>
                <div className="sources-list">
                    <span className="source-badge">Rent Payment History</span>
                    <span className="source-badge">Utility Bill Payments</span>
                    <span className="source-badge">Income Deposits</span>
                    <span className="source-badge">Savings Balance Trends</span>
                    <span className="source-badge">Recurring Subscriptions</span>
                </div>
                <p className="sources-note">
                    Credence could integrate with: Plaid (banking), Property APIs, Payroll APIs, Utility Providers
                </p>
            </div>
        </div>
    );
}
