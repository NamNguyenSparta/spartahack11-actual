import { useState } from 'react';
import { Upload, Cpu, Shield, CheckCircle2, Loader2, ArrowRight, FileText, Database, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import './Verification.css';

const steps = [
    { id: 1, title: 'Import Data', icon: Upload, description: 'Import behavioral dataset' },
    { id: 2, title: 'Generate Score', icon: Cpu, description: 'Calculate trust score' },
    { id: 3, title: 'Verify & Publish', icon: Shield, description: 'Create blockchain proof' },
];

export default function Verification() {
    const { currentPersona, verificationStep, isVerifying, generatePassport, blockchainProof, passportGenerated } = useApp();
    const [localStep, setLocalStep] = useState(0);
    const [importing, setImporting] = useState(false);
    const [imported, setImported] = useState(false);
    const [scoring, setScoring] = useState(false);
    const [scored, setScored] = useState(false);
    const navigate = useNavigate();

    const handleImport = async () => {
        setImporting(true);
        await new Promise(r => setTimeout(r, 1500));
        setImporting(false);
        setImported(true);
        setLocalStep(1);
    };

    const handleScore = async () => {
        setScoring(true);
        await new Promise(r => setTimeout(r, 2000));
        setScoring(false);
        setScored(true);
        setLocalStep(2);
    };

    const handleVerify = async () => {
        await generatePassport();
        setLocalStep(3);
    };

    const currentStep = isVerifying ? verificationStep : localStep;

    return (
        <>
            <Header title="Verification Flow" subtitle="Generate your Credence Passport" />
            <div className="page-content">
                <div className="verification-container">
                    {/* Progress Steps */}
                    <div className="steps-progress">
                        {steps.map((step, idx) => (
                            <div key={step.id} className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id || (step.id === 3 && passportGenerated) ? 'completed' : ''}`}>
                                <div className="step-icon">
                                    {currentStep > step.id || (step.id === 3 && passportGenerated) ? (
                                        <CheckCircle2 size={24} />
                                    ) : (
                                        <step.icon size={24} />
                                    )}
                                </div>
                                <div className="step-info">
                                    <span className="step-title">{step.title}</span>
                                    <span className="step-desc">{step.description}</span>
                                </div>
                                {idx < steps.length - 1 && <div className="step-connector" />}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="step-content">
                        {localStep === 0 && !imported && (
                            <div className="card step-card">
                                <div className="step-card-icon"><Upload size={48} /></div>
                                <h2>Import Behavioral Data</h2>
                                <p>Connect your data sources to import verified behavioral signals. This includes rent payments, utility bills, savings patterns, and more.</p>
                                <div className="data-sources">
                                    <div className="data-source"><FileText size={20} /> Bank Statements</div>
                                    <div className="data-source"><Database size={20} /> Payment History</div>
                                    <div className="data-source"><Lock size={20} /> Utility Records</div>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={handleImport} disabled={importing}>
                                    {importing ? <><Loader2 size={18} className="spin" /> Importing...</> : <>Import Data <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        )}

                        {localStep === 1 && imported && !scored && (
                            <div className="card step-card">
                                <div className="step-card-icon emerald"><Cpu size={48} /></div>
                                <h2>Generate Trust Score</h2>
                                <p>Our proprietary algorithm analyzes your behavioral data to calculate a fair, transparent trust score.</p>
                                <div className="score-preview">
                                    <div className="preview-item">
                                        <span>Transactions Analyzed</span>
                                        <strong>{currentPersona.transactions.length}</strong>
                                    </div>
                                    <div className="preview-item">
                                        <span>Months of History</span>
                                        <strong>6</strong>
                                    </div>
                                    <div className="preview-item">
                                        <span>Behavior Signals</span>
                                        <strong>4</strong>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={handleScore} disabled={scoring}>
                                    {scoring ? <><Loader2 size={18} className="spin" /> Calculating...</> : <>Generate Score <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        )}

                        {localStep === 2 && scored && !passportGenerated && (
                            <div className="card step-card">
                                <div className="step-card-icon cyan"><Shield size={48} /></div>
                                <h2>Verify & Publish On-Chain</h2>
                                <p>Your trust score will be hashed and recorded on the Solana blockchain, creating an immutable proof of your verified behaviors.</p>
                                <div className="score-result">
                                    <div className="score-circle-lg">
                                        <span className="score-value-lg">{currentPersona.trustScore}</span>
                                    </div>
                                    <div className="score-result-info">
                                        <span className="score-label-lg">Your Trust Score</span>
                                        <span className="score-sublabel">Ready to verify</span>
                                    </div>
                                </div>
                                <div className="verification-note">
                                    <Lock size={16} />
                                    <span>Only proof hashes are stored on-chain. No personal data is exposed.</span>
                                </div>
                                <button className="btn btn-success btn-lg" onClick={handleVerify} disabled={isVerifying}>
                                    {isVerifying ? <><Loader2 size={18} className="spin" /> Verifying...</> : <>Create Proof & Verify <Shield size={18} /></>}
                                </button>
                            </div>
                        )}

                        {passportGenerated && blockchainProof && (
                            <div className="card step-card success-card">
                                <div className="success-icon"><CheckCircle2 size={64} /></div>
                                <h2>Passport Generated!</h2>
                                <p>Your Credence Passport has been verified and recorded on the blockchain.</p>
                                <div className="proof-summary">
                                    <div className="proof-row">
                                        <span>Passport ID</span>
                                        <code>{blockchainProof.passportId}</code>
                                    </div>
                                    <div className="proof-row">
                                        <span>Transaction</span>
                                        <code>{blockchainProof.transactionId.slice(0, 20)}...</code>
                                    </div>
                                    <div className="proof-row">
                                        <span>Network</span>
                                        <span>{blockchainProof.network}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('/passport')}>
                                    View Passport <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
