import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Copy, Check, AlertTriangle, Lock, Users, Brain, ExternalLink } from 'lucide-react';
import './Passport.css';

export default function Passport() {
    const { persona, analysis } = useApp();
    const [isGenerated, setIsGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    const { trustScore, consensus, confidenceLevel, riskTier, agents } = analysis;
    const agentResults = Object.values(agents);

    const handleGenerate = () => {
        setIsGenerated(true);
    };

    const handleCopy = () => {
        const shareUrl = `https://credence.app/verify/${persona.id}-${Date.now()}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate summary items from agent analysis
    const summaryItems = agentResults.map(agent => ({
        text: agent.reasoning.split('.')[0] + '.',
        verified: agent.status === 'positive',
        agent: agent.name.replace(' Agent', ''),
        icon: agent.icon,
    }));

    return (
        <div className="passport">
            <div className="passport-header">
                <div>
                    <h1>Trust Passport</h1>
                    <p className="subtitle">Generate a shareable reputation summary</p>
                </div>
            </div>

            {!isGenerated ? (
                <div className="passport-intro">
                    <div className="intro-card">
                        <div className="intro-icon">
                            <Shield size={48} />
                        </div>
                        <h2>Generate Your Trust Passport</h2>
                        <p>
                            Create a privacy-safe reputation summary to share
                            with landlords, lenders, or services.
                        </p>
                        <div className="intro-features">
                            <div className="feature">
                                <Check size={16} />
                                <span>Proves behavioral reliability</span>
                            </div>
                            <div className="feature">
                                <Lock size={16} />
                                <span>No bank balance exposed</span>
                            </div>
                            <div className="feature">
                                <ExternalLink size={16} />
                                <span>Easy to share via link</span>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
                            Generate Trust Passport
                        </button>
                    </div>
                </div>
            ) : (
                <div className="passport-content">
                    {/* Passport Card */}
                    <div className="passport-card">
                        <div className="passport-card-header">
                            <div className="passport-logo">
                                <Shield size={24} />
                                <span>Credence</span>
                            </div>
                            <div className="passport-badge">
                                <Check size={14} />
                                Verified
                            </div>
                        </div>

                        <div className="passport-score-section">
                            <div className="passport-score">
                                <span className="score-value">{trustScore}</span>
                                <span className="score-label">Trust Score</span>
                            </div>
                            <div className="passport-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Confidence</span>
                                    <span className="meta-value" data-level={confidenceLevel.toLowerCase()}>
                                        {confidenceLevel}
                                    </span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Risk Tier</span>
                                    <span className="meta-value">{riskTier}</span>
                                </div>
                            </div>
                        </div>

                        {/* Agent Consensus */}
                        <div className="passport-consensus">
                            <div className="consensus-header">
                                <Brain size={16} />
                                <span>AI Council Consensus</span>
                            </div>
                            <div className="consensus-bar">
                                <div
                                    className="consensus-fill"
                                    style={{ width: `${consensus}%` }}
                                    data-level={consensus >= 80 ? 'high' : consensus >= 60 ? 'medium' : 'low'}
                                />
                            </div>
                            <span className="consensus-text">{consensus}% agent alignment</span>
                        </div>

                        {/* Summary Items */}
                        <div className="passport-summary">
                            <h4>Behavioral Indicators</h4>
                            <div className="summary-list">
                                {summaryItems.slice(0, 4).map((item, index) => (
                                    <div key={index} className="summary-item" data-verified={item.verified}>
                                        <span className="summary-icon">{item.icon}</span>
                                        <div className="summary-content">
                                            <span className="summary-agent">{item.agent}</span>
                                            <span className="summary-text">{item.text}</span>
                                        </div>
                                        {item.verified ? (
                                            <Check size={16} className="verified-icon" />
                                        ) : (
                                            <AlertTriangle size={16} className="warning-icon" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="passport-privacy">
                            <Lock size={14} />
                            <span>
                                This passport shares behavioral signals only. No sensitive banking data is exposed.
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="passport-actions">
                        <div className="share-section">
                            <h3>Share Your Passport</h3>
                            <p>Copy the link below to share with landlords, lenders, or services.</p>
                            <div className="share-input">
                                <input
                                    type="text"
                                    value={`https://credence.app/verify/${persona.id.slice(0, 8)}`}
                                    readOnly
                                />
                                <button className="btn btn-primary" onClick={handleCopy}>
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </div>

                        <div className="info-section">
                            <h4>What verifiers see:</h4>
                            <ul>
                                <li>Your Trust Score ({trustScore}/100)</li>
                                <li>AI Council consensus ({consensus}%)</li>
                                <li>Behavioral indicator summary</li>
                                <li>Verification timestamp</li>
                            </ul>
                            <h4>What they don't see:</h4>
                            <ul>
                                <li>Bank account balances</li>
                                <li>Transaction details</li>
                                <li>Income amounts</li>
                                <li>Personal financial data</li>
                            </ul>
                        </div>
                    </div>

                    {/* Positioning Copy */}
                    <div className="passport-positioning">
                        <Users size={20} />
                        <div>
                            <p className="positioning-main">
                                Your trust score was determined by {agentResults.length} AI agents evaluating different financial behaviors.
                            </p>
                            <p className="positioning-sub">
                                Credence converts financial behavior into trust signals. Share proof of reliability, not your bank history.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
