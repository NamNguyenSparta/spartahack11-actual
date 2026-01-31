// ============================================
// AI AGENT DEFINITIONS
// ============================================
export const AI_AGENTS = {
    payment: {
        id: 'payment',
        name: 'Payment Reliability Agent',
        role: 'Conservative Risk Evaluator',
        icon: '💳',
        focus: 'Rent and bill payment history',
        weight: 0.25,
        personality: 'conservative',
        color: 'var(--blue-500)',
    },
    savings: {
        id: 'savings',
        name: 'Savings Stability Agent',
        role: 'Long-term Planner',
        icon: '🏦',
        focus: 'Savings growth and financial cushion',
        weight: 0.20,
        personality: 'cautious',
        color: 'var(--green-500)',
    },
    income: {
        id: 'income',
        name: 'Income Consistency Agent',
        role: 'Income Risk Assessor',
        icon: '💼',
        focus: 'Deposit regularity and income volatility',
        weight: 0.15,
        personality: 'analytical',
        color: 'var(--purple-500)',
    },
    spending: {
        id: 'spending',
        name: 'Spending Behavior Agent',
        role: 'Behavioral Economist',
        icon: '📊',
        focus: 'Spending volatility and unusual spikes',
        weight: 0.15,
        personality: 'observant',
        color: 'var(--orange-500)',
    },
    investment: {
        id: 'investment',
        name: 'Investment Strategist Agent',
        role: 'Wealth Builder',
        icon: '📈',
        focus: 'Asset diversity and portfolio health',
        weight: 0.15,
        personality: 'forward-thinking',
        color: 'var(--cyan-500)',
    },
    risk: {
        id: 'risk',
        name: 'Risk Personality Agent',
        role: 'Overall Risk Sentiment',
        icon: '🎯',
        focus: 'Holistic risk assessment and trends',
        weight: 0.10,
        personality: 'balanced',
        color: 'var(--red-500)',
    },
};

// ============================================
// PILLAR CALCULATIONS
// ============================================

export function calculatePaymentReliabilityScore(data) {
    // If data is just a percentage (from simulator), use it directly
    if (typeof data === 'number') {
        return {
            score: data,
            label: getStatusLabel(data),
            onTime: Math.round((data / 100) * 12),
            total: 12,
        };
    }

    const { onTime, total } = data;
    const score = Math.round((onTime / total) * 100);

    return {
        score,
        label: getStatusLabel(score),
        onTime,
        total,
    };
}

export function calculateSavingsStabilityScore(data) {
    // Simulator input handling
    if (typeof data.balance !== 'undefined') {
        let score = Math.min(100, Math.max(0, (data.balance / 5000) * 100)); // Cap at 5k for max score demo
        return {
            score: Math.round(score),
            label: getStatusLabel(score),
            trend: '+2.0%',
            avgBalance: data.balance,
        };
    }

    const { trend, avgBalance } = data;
    const trendValue = parseFloat(trend);

    let score = 50;
    if (trendValue > 0) {
        score = Math.min(100, 60 + trendValue * 4);
    } else {
        score = Math.max(20, 50 + trendValue * 3);
    }

    if (avgBalance > 1000) score = Math.min(100, score + 10);
    if (avgBalance < 300) score = Math.max(20, score - 15);

    return {
        score: Math.round(score),
        label: getStatusLabel(Math.round(score)),
        trend,
        avgBalance,
    };
}

export function calculateIncomeConsistencyScore(data) {
    // Simulator input handling
    if (typeof data.amount !== 'undefined') {
        let score = Math.min(100, Math.max(0, (data.amount / 4000) * 100)); // Cap at 4k/mo
        return {
            score: Math.round(score),
            label: getStatusLabel(score),
            monthsTracked: 6,
            type: 'Salary',
        };
    }

    const { months, source } = data;
    let score = Math.min(100, 50 + months * 8);
    if (source.toLowerCase().includes('salary')) score = Math.min(100, score + 10);
    if (source.toLowerCase().includes('variable')) score = Math.max(30, score - 15);

    return {
        score: Math.round(score),
        label: getStatusLabel(Math.round(score)),
        monthsTracked: months,
        type: source,
    };
}

export function calculateSpendingStabilityScore(data) {
    // Simulator input handling
    if (typeof data === 'number') {
        // Input is volatility score (lower is better, but slider usually sets "goodness", so let's assume input is SCORE)
        return {
            score: data,
            label: getStatusLabel(data),
            volatility: data > 80 ? 'Low' : 'Medium',
            volatilityRaw: 100 - data,
        };
    }

    const { volatility, pattern } = data;
    let score = 100 - volatility;
    if (pattern === 'predictable') score = Math.min(100, score + 5);
    if (pattern === 'erratic') score = Math.max(30, score - 10);

    return {
        score: Math.round(Math.max(0, Math.min(100, score))),
        label: getStatusLabel(Math.round(score)),
        volatility: volatility < 20 ? 'Low' : volatility < 40 ? 'Medium' : 'High',
        volatilityRaw: volatility,
    };
}

export function calculateInvestmentHealthScore(data) {
    if (!data) return { score: 50, label: 'Moderate', diversity: 'None' };

    // Simulator input
    if (typeof data.totalValue !== 'undefined') {
        let score = Math.min(100, Math.max(0, (data.totalValue / 10000) * 100)); // Cap at 10k
        return {
            score: Math.round(score),
            label: getStatusLabel(score),
            diversity: 'Mixed Portfolio',
            value: data.totalValue
        }
    }

    const { totalValue, diversity } = data;
    let score = Math.min(100, (totalValue / 5000) * 80); // Base score on value
    if (diversity === 'High') score += 20;
    if (diversity === 'Medium') score += 10;

    return {
        score: Math.round(Math.min(100, score)),
        label: getStatusLabel(score),
        diversity,
        value: totalValue
    };
}

// ============================================
// AGENT ANALYSIS ENGINE
// ============================================

function generateAgentReasoning(agentId, score, signals) {
    const reasoningTemplates = {
        payment: {
            high: [`Perfect payment history.`, `Zero missed payments detected.`, `Rock-solid bill payment reliability.`],
            medium: [`Generally pays on time, but some delays.`, `Good habits, minor slips recently.`],
            low: [`Multiple late payments found.`, `Significant payment reliability issues.`, `Missed deadlines are hurting this score.`],
        },
        savings: {
            high: [`Impressive financial runway built.`, `Strong cash reserves for emergencies.`],
            medium: [`Savings exist but could be thicker.`, `Moderate buffer against shocks.`],
            low: [`Living paycheck to paycheck?`, `Dangerous lack of liquidity detected.`],
        },
        income: {
            high: [`Income stream is precise and reliable.`, `Steady airflow into accounts.`],
            medium: [`Some fluctuation in monthly deposits.`, `Income is decent but variable.`],
            low: [`Income is highly volatile.`, `Unpredictable earning patterns caused alerts.`],
        },
        spending: {
            high: [`Very disciplined spending control.`, `No impulse buying spikes detected.`],
            medium: [`Occasional splurge weeks detected.`, `Spending is mostly controlled.`],
            low: [`Erratic spending spikes detected.`, `High volatility in outflows.`],
        },
        investment: {
            high: [`Portfolio shows sophisticated asset allocation.`, `Strong wealth-building velocity.`, `Diversified assets reduce long-term risk.`],
            medium: [`Beginning to build asset base.`, `Some investments present, room to grow.`],
            low: [`Minimal asset accumulation detected.`, `Capital is stagnant in checking.`],
        },
        risk: {
            high: [`Overall profile indicates very low risk.`, `Ideal candidate for premium trust tiers.`],
            medium: [`Balanced risk profile.`, `Standard risk metrics observed.`],
            low: [`Elevated risk factors across the board.`, `Caution recommended.`]
        }
    };

    const tier = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
    const templates = reasoningTemplates[agentId][tier] || reasoningTemplates[agentId]['medium'];
    return templates[Math.floor(Math.random() * templates.length)];
}

function runAgentAnalysis(agentId, signals) {
    const agent = AI_AGENTS[agentId];
    let score = 50;
    let confidence = 0.7;

    switch (agentId) {
        case 'payment': score = signals.paymentReliability.score; break;
        case 'savings': score = signals.savingsStability.score; break;
        case 'income': score = signals.incomeConsistency.score; break;
        case 'spending': score = signals.spendingStability.score; break;
        case 'investment': score = signals.investmentHealth?.score || 50; break;
        case 'risk':
            const avgScore = (
                signals.paymentReliability.score +
                signals.savingsStability.score +
                signals.incomeConsistency.score +
                signals.spendingStability.score +
                (signals.investmentHealth?.score || 50)
            ) / 5;
            score = Math.round(avgScore);
            break;
    }

    const reasoning = generateAgentReasoning(agentId, score, signals);
    const contribution = Math.round(score * agent.weight);

    return {
        ...agent,
        score: Math.round(score),
        contribution,
        confidence: 85 + Math.floor(Math.random() * 10), // Simulated confidence
        reasoning,
        status: score >= 75 ? 'positive' : score >= 50 ? 'neutral' : 'negative',
    };
}

export function runMultiAgentAnalysis(signals) {
    const agentResults = {};
    let totalWeightedScore = 0;

    Object.keys(AI_AGENTS).forEach(agentId => {
        const result = runAgentAnalysis(agentId, signals);
        agentResults[agentId] = result;
        totalWeightedScore += result.score * AI_AGENTS[agentId].weight;
    });

    const scores = Object.values(agentResults).map(a => a.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length;
    const consensus = Math.round(100 - (Math.sqrt(variance) / 50) * 100);

    return {
        agents: agentResults,
        trustScore: Math.round(totalWeightedScore),
        consensus: Math.max(0, Math.min(100, consensus)),
        confidenceLevel: consensus >= 80 ? 'High' : consensus >= 60 ? 'Medium' : 'Low',
        riskTier: getRiskTier(Math.round(totalWeightedScore)),
    };
}

// Generate real-time chat reaction for simulator
export function generateLiveReaction(changedFactor, newValue, previousValue) {
    const diff = newValue - previousValue;
    const direction = diff > 0 ? 'up' : 'down';

    if (Math.abs(diff) < 5) return null; // Ignore small changes

    const reactions = {
        payment: {
            up: ["Finally seeing some consistency in payments.", "Reliability factor increasing."],
            down: ["Missed payments are a major red flag!", "Payment reliability is crashing."]
        },
        savings: {
            up: ["Liquidity buffer expanding. Excellent.", "That's a healthy safety net forming."],
            down: ["Cash reserves are draining fast!", "We are entering a liquidity danger zone."]
        },
        income: {
            up: ["Income velocity is accelerating.", "Strong cash flow detected."],
            down: ["Income dropping. Stability is compromised.", "Cash flow interruption detected."]
        },
        investment: {
            up: ["Asset allocation looking very strong.", "Wealth building velocity achieved."],
            down: ["Portfolio value dropping.", "Asset base is shrinking."]
        }
    };

    const agentName = changedFactor; // e.g. 'savings'
    if (!reactions[agentName]) return null;

    const possibleLines = reactions[agentName][direction];
    const statement = possibleLines[Math.floor(Math.random() * possibleLines.length)];

    return {
        agent: AI_AGENTS[agentName].name,
        icon: AI_AGENTS[agentName].icon,
        statement,
        sentiment: direction === 'up' ? 'positive' : 'negative',
        timestamp: new Date().toLocaleTimeString(),
    };
}

// ... existing helpers ...
export function getRiskTier(score) {
    if (score >= 80) return 'Low Risk';
    if (score >= 65) return 'Low-Medium Risk';
    if (score >= 50) return 'Medium Risk';
    if (score >= 35) return 'Medium-High Risk';
    return 'High Risk';
}

export function getStatusLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Moderate';
    if (score >= 35) return 'Needs Work';
    return 'Poor';
}
