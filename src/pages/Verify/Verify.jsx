import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Search, CheckCircle2, XCircle, Clock, Hash, ExternalLink, Loader2 } from 'lucide-react';
import './Verify.css';

export default function Verify() {
    const navigate = useNavigate();
    const [passportId, setPassportId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        if (!passportId.trim()) return;

        setVerifying(true);

        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo, randomly show success or not found
        if (passportId.startsWith('CRD-')) {
            setResult({
                found: true,
                passportId: passportId,
                reputationScore: Math.floor(Math.random() * 30) + 70,
                timestamp: new Date().toISOString(),
                txSignature: 'Demo' + Array.from({ length: 80 }, () =>
                    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[Math.floor(Math.random() * 58)]
                ).join(''),
                verified: true,
            });
        } else {
            setResult({ found: false });
        }

        setVerifying(false);
    };

    return (
        <div className="verify">
            <header className="verify-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div className="header-center">
                    <Shield size={20} />
                    <span>Verify Passport</span>
                </div>
                <div />
            </header>

            <main className="verify-main">
                <div className="verify-card card">
                    <div className="verify-icon">
                        <Search size={40} />
                    </div>
                    <h1>Verify a Credence Passport</h1>
                    <p>Enter a Passport ID to verify its authenticity on the Solana blockchain.</p>

                    <div className="verify-input-group">
                        <input
                            type="text"
                            className="input verify-input mono"
                            placeholder="Enter Passport ID (e.g., CRD-XXXXXXXX)"
                            value={passportId}
                            onChange={(e) => setPassportId(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleVerify}
                            disabled={verifying || !passportId.trim()}
                        >
                            {verifying ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
                        </button>
                    </div>

                    <p className="verify-hint">
                        Try entering any ID starting with "CRD-" for a demo
                    </p>
                </div>

                {/* Results */}
                {result && (
                    <div className={`result-card card ${result.found ? 'verified' : 'not-found'}`}>
                        {result.found ? (
                            <>
                                <div className="result-header">
                                    <CheckCircle2 size={48} className="result-icon success" />
                                    <h2>Passport Verified</h2>
                                    <p>This passport is authentic and anchored on Solana</p>
                                </div>

                                <div className="result-details">
                                    <div className="result-item">
                                        <Hash size={16} />
                                        <span className="label">Passport ID</span>
                                        <span className="value mono">{result.passportId}</span>
                                    </div>
                                    <div className="result-item">
                                        <Shield size={16} />
                                        <span className="label">Trust Score</span>
                                        <span className="value score">{result.reputationScore}</span>
                                    </div>
                                    <div className="result-item">
                                        <Clock size={16} />
                                        <span className="label">Anchored At</span>
                                        <span className="value">{new Date(result.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="result-item">
                                        <ExternalLink size={16} />
                                        <span className="label">Transaction</span>
                                        <a
                                            href={`https://explorer.solana.com/tx/${result.txSignature}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="value link"
                                        >
                                            View on Explorer →
                                        </a>
                                    </div>
                                </div>

                                <div className="result-badge">
                                    <CheckCircle2 size={16} />
                                    Integrity verified • Hash match confirmed
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="result-header">
                                    <XCircle size={48} className="result-icon error" />
                                    <h2>Passport Not Found</h2>
                                    <p>No passport with this ID was found on the Solana blockchain.</p>
                                </div>
                                <div className="result-tips">
                                    <p>Make sure you:</p>
                                    <ul>
                                        <li>Entered the correct Passport ID</li>
                                        <li>The passport was generated on Solana Devnet</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
