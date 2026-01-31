import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Activity, TrendingUp, DollarSign, Wallet, Shield, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './Simulator.css';

export default function Simulator() {
    const {
        analysis,
        simulatorData,
        updateSimulation,
        setSimulationActive,
        liveChat
    } = useApp();

    // Activate simulation mode on mount
    useEffect(() => {
        setSimulationActive(true);
        return () => setSimulationActive(false);
    }, [setSimulationActive]);

    const { trustScore } = analysis;

    return (
        <div className="simulator-page">
            <div className="sim-header">
                <div className="sim-title">
                    <Zap size={28} className="sim-icon" />
                    <div>
                        <h1>Live Trust Simulator</h1>
                        <p>Adjust financial variables and watch AI agents react in real-time.</p>
                    </div>
                </div>
                <div className="sim-score-badge">
                    <span>Live Trust Score</span>
                    <div className="live-score">{trustScore}</div>
                </div>
            </div>

            <div className="sim-grid">
                {/* CONTROLS PANEL */}
                <div className="sim-panel controls-panel">
                    <h2><Sliders size={18} /> Financial Inputs</h2>

                    <div className="control-group">
                        <div className="control-label">
                            <span className="label-icon"><Wallet size={16} /></span>
                            <span>Monthly Income</span>
                            <span className="control-val">${simulatorData.monthlyIncome}</span>
                        </div>
                        <input
                            type="range"
                            min="1000" max="15000" step="100"
                            value={simulatorData.monthlyIncome}
                            onChange={(e) => updateSimulation('monthlyIncome', parseInt(e.target.value))}
                            className="sim-slider income-slider"
                        />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span className="label-icon"><DollarSign size={16} /></span>
                            <span>Savings Balance</span>
                            <span className="control-val">${simulatorData.savingsBalance}</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="50000" step="500"
                            value={simulatorData.savingsBalance}
                            onChange={(e) => updateSimulation('savingsBalance', parseInt(e.target.value))}
                            className="sim-slider savings-slider"
                        />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span className="label-icon"><TrendingUp size={16} /></span>
                            <span>Investment Portfolio</span>
                            <span className="control-val">${simulatorData.investmentValue}</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100000" step="1000"
                            value={simulatorData.investmentValue}
                            onChange={(e) => updateSimulation('investmentValue', parseInt(e.target.value))}
                            className="sim-slider invest-slider"
                        />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span className="label-icon"><Shield size={16} /></span>
                            <span>Payment Reliability</span>
                            <span className="control-val">{simulatorData.paymentReliability}%</span>
                        </div>
                        <input
                            type="range"
                            min="50" max="100" step="1"
                            value={simulatorData.paymentReliability}
                            onChange={(e) => updateSimulation('paymentReliability', parseInt(e.target.value))}
                            className="sim-slider payment-slider"
                        />
                    </div>
                </div>

                {/* AGENT FEED PANEL */}
                <div className="sim-panel feed-panel">
                    <h2><Activity size={18} /> Live Agent Feed</h2>
                    <div className="chat-stream">
                        {liveChat.length === 0 ? (
                            <p className="empty-chat">Adjust inputs to trigger agent analysis...</p>
                        ) : (
                            liveChat.map(msg => (
                                <div key={msg.id} className="chat-bubble" style={{ borderLeftColor: msg.color }}>
                                    <div className="bubble-header">
                                        <span className="bubble-icon">{msg.icon}</span>
                                        <span className="bubble-agent" style={{ color: msg.color }}>{msg.agent}</span>
                                        <span className="bubble-time">Just now</span>
                                    </div>
                                    <p className="bubble-msg">{msg.msg}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* SCORE VISUALIZATION PANEL */}
                <div className="sim-panel score-panel">
                    <div className="score-viz">
                        <svg viewBox="0 0 200 120" className="gauge">
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke={trustScore > 75 ? '#10b981' : trustScore > 50 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="20"
                                strokeLinecap="round"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 * (1 - trustScore / 100)}
                                className="gauge-fill"
                            />
                        </svg>
                        <div className="gauge-value">{trustScore}</div>
                    </div>

                    <div className="agent-breakdown-mini">
                        {Object.values(analysis.agents).map(agent => (
                            <div key={agent.id} className="mini-stat">
                                <span>{agent.icon}</span>
                                <div className="mini-bar-bg">
                                    <div
                                        className="mini-bar-fill"
                                        style={{ width: `${agent.score}%`, background: agent.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
