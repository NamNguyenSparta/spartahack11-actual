import { CheckCircle2, Shield, Link2, ExternalLink, Copy, Info, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getScoreRating } from '../../data/mockData';
import Header from '../../components/Layout/Header';
import './Passport.css';

export default function Passport() {
    const { currentPersona, blockchainProof, passportGenerated, judgeView } = useApp();
    const rating = getScoreRating(currentPersona.trustScore);
    const proof = blockchainProof || (currentPersona.passportStatus === 'verified' ? {
        proofHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        timestamp: currentPersona.verificationDate + 'T14:32:00.000Z',
        transactionId: 'Hx7qP2nMvK9sL4wR8tY6uJ3fG5hB1mC0xZ2vN4kE7dA9pS6qW8rT3yU5iO0aD2gF',
        passportId: currentPersona.passportId,
        network: 'Solana Devnet',
        blockNumber: 234567891,
        status: 'confirmed',
    } : null);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (!passportGenerated && currentPersona.passportStatus !== 'verified') {
        return (
            <>
                <Header title="Credence Passport" subtitle="Share your verified trust signals" />
                <div className="page-content">
                    <div className="passport-empty">
                        <Shield size={64} className="empty-icon" />
                        <h2>No Passport Generated</h2>
                        <p>Generate your Credence Passport to share verified trust signals with landlords and lenders.</p>
                        <a href="/verify" className="btn btn-primary btn-lg">Generate Passport</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Credence Passport" subtitle="Your verified trust profile" />
            <div className="page-content">
                <div className="passport-container">
                    {/* Passport Card */}
                    <div className="passport-card">
                        <div className="passport-header">
                            <div className="passport-logo">
                                <Shield size={32} />
                                <span>Credence</span>
                            </div>
                            <div className="verified-badge">
                                <CheckCircle2 size={16} />
                                Verified On-Chain
                            </div>
                        </div>

                        <div className="passport-profile">
                            <div className="passport-avatar">{currentPersona.avatar}</div>
                            <div className="passport-info">
                                <h2>{currentPersona.name}</h2>
                                <p>{currentPersona.type}</p>
                            </div>
                        </div>

                        <div className="passport-score">
                            <div className="score-big" style={{ color: rating.color }}>{currentPersona.trustScore}</div>
                            <div className="score-meta">
                                <span className="score-label-big">Trust Score</span>
                                <span className="score-rating" style={{ color: rating.color }}>{rating.label}</span>
                            </div>
                        </div>

                        <div className="passport-behaviors">
                            <h4>Verified Behaviors</h4>
                            <div className="behavior-grid">
                                <div className="behavior-item">
                                    <span className="behavior-name">Rent Reliability</span>
                                    <span className="behavior-value">{currentPersona.behaviors.rentReliability.label}</span>
                                </div>
                                <div className="behavior-item">
                                    <span className="behavior-name">Utilities</span>
                                    <span className="behavior-value">{currentPersona.behaviors.utilitiesConsistency.label}</span>
                                </div>
                                <div className="behavior-item">
                                    <span className="behavior-name">Savings</span>
                                    <span className="behavior-value">{currentPersona.behaviors.savingsStability.label}</span>
                                </div>
                                <div className="behavior-item">
                                    <span className="behavior-name">Spending</span>
                                    <span className="behavior-value">{currentPersona.behaviors.spendingVolatility.label}</span>
                                </div>
                            </div>
                        </div>

                        <div className="passport-id">
                            <span>Passport ID:</span>
                            <code>{proof?.passportId || currentPersona.passportId}</code>
                        </div>
                    </div>

                    {/* Verification Details */}
                    <div className="verification-panel">
                        <div className="card">
                            <h3><Lock size={18} /> Privacy Notice</h3>
                            <div className="privacy-notice">
                                <p>This passport <strong>does not reveal</strong> your private banking details, transaction amounts, or account numbers.</p>
                                <p>Only verified behavioral signals and proof receipts are shared.</p>
                            </div>
                        </div>

                        <div className="card">
                            <h3><Link2 size={18} /> On-Chain Verification</h3>
                            {proof && (
                                <div className="proof-details">
                                    <div className="proof-item">
                                        <span className="proof-label">Proof Hash</span>
                                        <div className="proof-value-row">
                                            <code className="proof-hash">{proof.proofHash.slice(0, 20)}...{proof.proofHash.slice(-8)}</code>
                                            <button className="btn-icon" onClick={() => copyToClipboard(proof.proofHash)}><Copy size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="proof-item">
                                        <span className="proof-label">Transaction ID</span>
                                        <div className="proof-value-row">
                                            <code className="proof-tx">{proof.transactionId.slice(0, 16)}...{proof.transactionId.slice(-8)}</code>
                                            <button className="btn-icon" onClick={() => copyToClipboard(proof.transactionId)}><Copy size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="proof-item">
                                        <span className="proof-label">Network</span>
                                        <span className="proof-value">{proof.network}</span>
                                    </div>
                                    <div className="proof-item">
                                        <span className="proof-label">Block</span>
                                        <span className="proof-value">#{proof.blockNumber.toLocaleString()}</span>
                                    </div>
                                    <div className="proof-item">
                                        <span className="proof-label">Timestamp</span>
                                        <span className="proof-value">{new Date(proof.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="proof-item">
                                        <span className="proof-label">Status</span>
                                        <span className="proof-status confirmed">✓ Confirmed</span>
                                    </div>
                                </div>
                            )}
                            <a href="#" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                                <ExternalLink size={16} /> View on Explorer
                            </a>
                        </div>

                        {judgeView && (
                            <div className="card judge-card">
                                <h3>👨‍⚖️ Judge View - Score Logic</h3>
                                <div className="judge-content">
                                    <p><strong>Score Components:</strong></p>
                                    <ul>
                                        <li>Payment Reliability (40%): {((currentPersona.behaviors.rentReliability.score + currentPersona.behaviors.utilitiesConsistency.score) / 2).toFixed(0)}%</li>
                                        <li>Savings Stability (30%): {currentPersona.behaviors.savingsStability.score}%</li>
                                        <li>Spending Consistency (20%): {currentPersona.behaviors.spendingVolatility.score}%</li>
                                        <li>Income Stability (10%): {currentPersona.behaviors.incomeStability.score}%</li>
                                    </ul>
                                    <p><strong>Verification:</strong> Behavior JSON is hashed → stored on Solana Devnet → Transaction ID issued.</p>
                                </div>
                            </div>
                        )}

                        <div className="share-section">
                            <button className="btn btn-primary btn-lg w-full">
                                <Link2 size={18} /> Share Passport Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
