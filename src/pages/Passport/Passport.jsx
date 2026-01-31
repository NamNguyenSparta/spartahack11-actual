import { useState } from 'react';
import { Shield, CheckCircle2, Copy, Link2, Share2, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Passport.css';

export default function Passport() {
    const { currentPersona, passportGenerated, generatePassport, getStatusColor } = useApp();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://credence.app/verify/${currentPersona.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerate = () => {
        generatePassport();
    };

    // Summary items based on persona
    const getSummaryItems = () => {
        const items = [];
        if (currentPersona.signals.paymentReliability.score >= 70) {
            items.push({ text: 'Consistent rent payments', verified: true });
        }
        if (currentPersona.signals.savingsStability.score >= 70) {
            items.push({ text: 'Stable savings pattern', verified: true });
        }
        if (currentPersona.signals.spendingStability.score >= 70) {
            items.push({ text: 'Low spending volatility', verified: true });
        }
        if (currentPersona.signals.incomeConsistency.score >= 70) {
            items.push({ text: 'Regular income deposits', verified: true });
        }
        if (currentPersona.signals.paymentReliability.score < 70) {
            items.push({ text: 'Some late payments detected', verified: false });
        }
        if (currentPersona.signals.savingsStability.score < 50) {
            items.push({ text: 'Low savings buffer', verified: false });
        }
        return items;
    };

    if (!passportGenerated) {
        return (
            <div className="passport">
                <div className="page-header">
                    <div>
                        <h1>Trust Passport</h1>
                        <p>Generate a shareable reputation summary</p>
                    </div>
                </div>

                <div className="passport-empty">
                    <div className="empty-icon">
                        <Shield size={64} />
                    </div>
                    <h2>Generate Your Trust Passport</h2>
                    <p>Create a privacy-safe reputation summary to share with landlords, lenders, or services.</p>
                    <div className="empty-features">
                        <div className="feature-item">
                            <CheckCircle2 size={18} />
                            <span>Proves behavioral reliability</span>
                        </div>
                        <div className="feature-item">
                            <Lock size={18} />
                            <span>No bank balance exposed</span>
                        </div>
                        <div className="feature-item">
                            <Share2 size={18} />
                            <span>Easy to share via link</span>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
                        Generate Trust Passport
                    </button>
                </div>
            </div>
        );
    }

    const summaryItems = getSummaryItems();

    return (
        <div className="passport">
            <div className="page-header">
                <div>
                    <h1>Trust Passport</h1>
                    <p>Share proof of reliability, not your bank history.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={handleCopy}>
                        {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            </div>

            {/* Passport Card */}
            <div className="passport-card">
                <div className="passport-header">
                    <div className="passport-logo">
                        <div className="logo-icon">
                            <Shield size={24} />
                        </div>
                        <div>
                            <span className="logo-name">Credence</span>
                            <span className="logo-subtitle">Trust Passport</span>
                        </div>
                    </div>
                    <div className="passport-badge">
                        <CheckCircle2 size={14} />
                        Verified
                    </div>
                </div>

                {/* Score Section */}
                <div className="passport-score-section">
                    <div className="passport-score">
                        <span className="score-value">{currentPersona.trustScore}</span>
                        <span className="score-label">Trust Score</span>
                    </div>
                    <div className="score-meta">
                        <div className={`confidence ${getStatusColor(currentPersona.trustScore)}`}>
                            <strong>Confidence Level:</strong> {currentPersona.confidenceLevel}
                        </div>
                        <div className="persona-info">
                            <span className="avatar">{currentPersona.avatar}</span>
                            <span>{currentPersona.name}</span>
                        </div>
                    </div>
                </div>

                {/* Reputation Summary */}
                <div className="passport-summary">
                    <h3>Reputation Summary</h3>
                    <div className="summary-list">
                        {summaryItems.map((item, i) => (
                            <div key={i} className={`summary-item ${item.verified ? 'verified' : 'warning'}`}>
                                {item.verified ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy Notice */}
                <div className="privacy-notice">
                    <Lock size={16} />
                    <p>This passport proves financial behavior patterns, not bank balances or transactions.</p>
                </div>

                {/* Share Section */}
                <div className="passport-share">
                    <div className="share-link">
                        <Link2 size={16} />
                        <span className="share-url">credence.app/verify/{currentPersona.id}</span>
                    </div>
                    <button className="btn btn-primary" onClick={handleCopy}>
                        <Share2 size={16} />
                        Share Passport
                    </button>
                </div>
            </div>

            {/* What This Proves */}
            <div className="proof-section">
                <h2>What This Passport Proves</h2>
                <div className="proof-grid">
                    <div className="proof-card card">
                        <CheckCircle2 size={24} className="proof-icon success" />
                        <h4>Behavioral Reliability</h4>
                        <p>Pattern-based analysis of payment history and financial consistency.</p>
                    </div>
                    <div className="proof-card card">
                        <Lock size={24} className="proof-icon info" />
                        <h4>Privacy Protected</h4>
                        <p>No raw transaction data, account numbers, or exact balances shared.</p>
                    </div>
                    <div className="proof-card card">
                        <Shield size={24} className="proof-icon purple" />
                        <h4>Trust Infrastructure</h4>
                        <p>Built for landlords, lenders, and services who need trust signals.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
