import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, Brain, Users, TrendingUp, TrendingDown } from 'lucide-react';
import './BusinessView.css';

export default function BusinessView() {
    const { currentPersona: persona, analysis, getStatusColor, getStatusLabel } = useApp();

    const { trustScore, consensus, confidenceLevel, riskTier, agents } = analysis;
    const agentResults = Object.values(agents);

    // Determine risk level styling
    const getRiskStyle = (tier) => {
        if (tier.includes('Low Risk') && !tier.includes('Medium')) {
            return { color: 'var(--success-600)', bg: 'var(--success-50)' };
        }
        if (tier.includes('Low-Medium')) {
            return { color: 'var(--success-600)', bg: 'var(--success-50)' };
        }
        if (tier.includes('Medium') && !tier.includes('High')) {
            return { color: 'var(--warning-600)', bg: 'var(--warning-50)' };
        }
        return { color: 'var(--error-600)', bg: 'var(--error-50)' };
    };

    const riskStyle = getRiskStyle(riskTier);

    // Prepare chart data from agent scores
    const agentChartData = agentResults.map(agent => ({
        name: agent.name.replace(' Agent', '').split(' ')[0],
        score: agent.score,
        icon: agent.icon,
    }));

    if (!persona || !analysis) {
        return <div className="p-8 text-center">Loading Underwriting Data...</div>;
    }

    return (
        <div className="business-view" key={persona.id}>
            {/* Header */}
            <div className="business-header">
                <div>
                    <h1>Underwriting Report</h1>
                    <p className="subtitle">AI-Powered Risk Assessment for Landlords & Lenders</p>
                </div>
                <div className="report-badge">
                    <Shield size={16} />
                    AI Council Verified
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card score">
                    <span className="summary-label">Trust Score</span>
                    <span className="summary-value">{trustScore}</span>
                    <span className="summary-subtext">out of 100</span>
                </div>
                <div className="summary-card risk">
                    <span className="summary-label">Risk Tier</span>
                    <span className="summary-value" style={{ color: riskStyle.color }}>
                        {riskTier}
                    </span>
                    <span className="summary-subtext">Based on {agentResults.length} AI agents</span>
                </div>
                <div className="summary-card confidence">
                    <span className="summary-label">Confidence Level</span>
                    <span className="summary-value" data-level={confidenceLevel.toLowerCase()}>
                        {confidenceLevel}
                    </span>
                    <span className="summary-subtext">{consensus}% agent consensus</span>
                </div>
                <div className="summary-card recommendation">
                    <span className="summary-label">Recommendation</span>
                    <span className="summary-value">
                        {trustScore >= 70 ? 'Approve' : trustScore >= 50 ? 'Review' : 'Caution'}
                    </span>
                    <span className="summary-subtext">
                        {trustScore >= 70 ? 'Low risk applicant' : trustScore >= 50 ? 'Manual review advised' : 'Higher risk profile'}
                    </span>
                </div>
            </div>

            {/* AI Council Analysis */}
            <div className="card council-analysis">
                <div className="card-header">
                    <div className="header-title">
                        <Brain size={20} />
                        <h2>AI Trust Council Analysis</h2>
                    </div>
                    <div className="header-meta">
                        <Users size={14} />
                        {agentResults.length} Agents · {consensus}% Consensus
                    </div>
                </div>

                <p className="card-description">
                    Each AI agent evaluates the applicant from a specialized perspective.
                    The final assessment is a weighted consensus of all agents.
                </p>

                <div className="agent-analysis-grid">
                    {agentResults.map((agent) => (
                        <div key={agent.id} className="agent-analysis-card" data-status={agent.status}>
                            <div className="agent-header">
                                <span className="agent-icon">{agent.icon}</span>
                                <div className="agent-info">
                                    <span className="agent-name">{agent.name.replace(' Agent', '')}</span>
                                    <span className="agent-role">{agent.role}</span>
                                </div>
                                <div className="agent-score">
                                    <span className="score-value">{agent.score}</span>
                                    <span className="score-label">Score</span>
                                </div>
                            </div>
                            <p className="agent-assessment">{agent.reasoning}</p>
                            <div className="agent-footer">
                                <div className="confidence-indicator">
                                    <span>Confidence:</span>
                                    <div className="confidence-bar">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: `${agent.confidence}%` }}
                                        />
                                    </div>
                                    <span>{agent.confidence}%</span>
                                </div>
                                <span className="contribution-badge">+{agent.contribution} pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Consensus Visualization */}
            <div className="consensus-section">
                <div className="card consensus-card">
                    <h3>Agent Score Distribution</h3>
                    <p className="card-subtitle">Individual agent assessments</p>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={agentChartData} layout="vertical">
                                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar
                                    dataKey="score"
                                    fill="var(--primary-500)"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card alignment-card">
                    <h3>Council Alignment</h3>
                    <p className="card-subtitle">How closely agents agree</p>
                    <div className="alignment-display">
                        <div className="alignment-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" className="alignment-bg" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    className="alignment-progress"
                                    style={{
                                        strokeDasharray: `${(consensus / 100) * 283} 283`,
                                        stroke: consensus >= 80 ? 'var(--success-500)' : consensus >= 60 ? 'var(--warning-500)' : 'var(--error-500)',
                                    }}
                                />
                            </svg>
                            <span className="alignment-value">{consensus}%</span>
                        </div>
                        <div className="alignment-explanation">
                            {consensus >= 80 ? (
                                <>
                                    <CheckCircle size={18} className="success-icon" />
                                    <span>Strong consensus. Agents largely agree on this assessment.</span>
                                </>
                            ) : consensus >= 60 ? (
                                <>
                                    <AlertTriangle size={18} className="warning-icon" />
                                    <span>Moderate consensus. Some variation in agent opinions.</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={18} className="error-icon" />
                                    <span>Low consensus. Agents have differing perspectives.</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Factors Summary */}
            <div className="card risk-factors">
                <h3>Risk Factor Summary</h3>
                <p className="card-subtitle">Key indicators identified by the AI council</p>

                <div className="factors-table">
                    <div className="factors-row header">
                        <span>Factor</span>
                        <span>Agent</span>
                        <span>Assessment</span>
                        <span>Impact</span>
                    </div>
                    {agentResults.map((agent) => (
                        <div key={agent.id} className="factors-row">
                            <span className="factor-name">{agent.focus}</span>
                            <span className="factor-agent">
                                <span className="agent-icon-sm">{agent.icon}</span>
                                {agent.name.replace(' Agent', '')}
                            </span>
                            <span className="factor-assessment">{agent.reasoning.split('.')[0]}.</span>
                            <span className="factor-impact" data-status={agent.status}>
                                {agent.status === 'positive' ? (
                                    <><TrendingUp size={14} /> Positive</>
                                ) : agent.status === 'neutral' ? (
                                    <><AlertTriangle size={14} /> Neutral</>
                                ) : (
                                    <><TrendingDown size={14} /> Negative</>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Disclosure */}
            <div className="business-footer">
                <p>
                    This report was generated by Credence's Multi-Agent AI Trust System.
                    The assessment is based on behavioral financial data analysis by {agentResults.length} specialized AI agents.
                    Final decisions should incorporate additional verification as needed.
                </p>
            </div>
        </div>
    );
}
