// Scoring weights for Trust Score calculation
export const WEIGHTS = {
    paymentReliability: 0.40,
    savingsStability: 0.25,
    incomeConsistency: 0.20,
    spendingStability: 0.15,
};

// Calculate individual pillar scores
export function calculatePaymentReliabilityScore(data) {
    const { on_time_count, total_count } = data;
    if (total_count === 0) return { score: 50, label: 'No Data' };

    const score = Math.round((on_time_count / total_count) * 100);
    return {
        score,
        label: getScoreLabel(score),
        onTime: on_time_count,
        total: total_count,
    };
}

export function calculateSavingsStabilityScore(data) {
    const { growth_percent, avg_balance } = data;

    // Score based on growth trend and balance size
    let score = 50; // Base score

    // Add points for positive growth (max +30)
    if (growth_percent > 0) {
        score += Math.min(30, growth_percent * 3);
    } else {
        score += Math.max(-20, growth_percent * 2);
    }

    // Add points for healthy average balance (max +20)
    if (avg_balance >= 1000) score += 20;
    else if (avg_balance >= 500) score += 15;
    else if (avg_balance >= 200) score += 10;
    else if (avg_balance >= 100) score += 5;

    score = Math.min(100, Math.max(0, Math.round(score)));

    return {
        score,
        label: getScoreLabel(score),
        trend: `${growth_percent >= 0 ? '+' : ''}${growth_percent}%`,
        avgBalance: avg_balance,
    };
}

export function calculateIncomeConsistencyScore(data) {
    const { months_with_income, avg_deposit, deposit_stddev, source } = data;

    // Score based on regularity of income
    let score = 50;

    // Add points for consistent monthly income (max +30)
    score += months_with_income * 5;

    // Add points for low variability (max +20)
    const variability = deposit_stddev / (avg_deposit || 1);
    if (variability < 0.1) score += 20;
    else if (variability < 0.2) score += 15;
    else if (variability < 0.3) score += 10;
    else if (variability < 0.5) score += 5;

    score = Math.min(100, Math.max(0, Math.round(score)));

    return {
        score,
        label: getScoreLabel(score),
        type: source || 'Unknown',
        monthsTracked: months_with_income,
    };
}

export function calculateSpendingStabilityScore(data) {
    const { volatility_percent } = data;

    // Lower volatility = higher score
    let score = 100 - (volatility_percent || 0);
    score = Math.min(100, Math.max(0, Math.round(score)));

    let volatility = 'Very High';
    if (volatility_percent <= 10) volatility = 'Very Low';
    else if (volatility_percent <= 20) volatility = 'Low';
    else if (volatility_percent <= 35) volatility = 'Moderate';
    else if (volatility_percent <= 50) volatility = 'High';

    return {
        score,
        label: getScoreLabel(score),
        volatility,
        volatilityPercent: volatility_percent,
    };
}

// Calculate overall Trust Score
export function calculateTrustScore(signals) {
    let score = 0;

    for (const [key, weight] of Object.entries(WEIGHTS)) {
        score += (signals[key]?.score || 0) * weight;
    }

    return Math.round(score);
}

// Get label based on score
function getScoreLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Moderate';
    if (score >= 35) return 'Needs Work';
    return 'Poor';
}

// Get confidence level
export function getConfidenceLevel(trustScore) {
    if (trustScore >= 75) return 'High';
    if (trustScore >= 50) return 'Medium';
    return 'Low';
}

// Get risk tier for business view
export function getRiskTier(trustScore) {
    if (trustScore >= 80) return 'Low Risk';
    if (trustScore >= 65) return 'Low-Medium Risk';
    if (trustScore >= 50) return 'Medium Risk';
    if (trustScore >= 35) return 'Medium-High Risk';
    return 'High Risk';
}

// Generate scoring factors/insights
export function generateFactors(signals) {
    const factors = [];

    // Payment reliability factors
    if (signals.paymentReliability) {
        const pr = signals.paymentReliability;
        if (pr.onTime >= pr.total * 0.9) {
            factors.push({ text: `${pr.onTime}/${pr.total} payments on time`, type: 'positive' });
        } else if (pr.onTime < pr.total) {
            const late = pr.total - pr.onTime;
            factors.push({ text: `${late} late payment${late > 1 ? 's' : ''} detected`, type: 'negative' });
        }
    }

    // Savings factors
    if (signals.savingsStability) {
        const ss = signals.savingsStability;
        if (ss.trend && ss.trend.startsWith('+')) {
            factors.push({ text: `Stable savings growth (${ss.trend})`, type: 'positive' });
        } else if (ss.score < 50) {
            factors.push({ text: 'Low savings buffer detected', type: 'negative' });
        }
    }

    // Income factors
    if (signals.incomeConsistency) {
        const ic = signals.incomeConsistency;
        if (ic.score >= 70) {
            factors.push({ text: 'Regular income deposits', type: 'positive' });
        } else if (ic.score < 50) {
            factors.push({ text: 'Irregular income pattern', type: 'negative' });
        }
    }

    // Spending factors
    if (signals.spendingStability) {
        const sp = signals.spendingStability;
        if (sp.volatility === 'Low' || sp.volatility === 'Very Low') {
            factors.push({ text: 'Consistent spending patterns', type: 'positive' });
        } else if (sp.volatility === 'High' || sp.volatility === 'Very High') {
            factors.push({ text: 'High spending volatility detected', type: 'negative' });
        }
    }

    return factors;
}

export default {
    WEIGHTS,
    calculatePaymentReliabilityScore,
    calculateSavingsStabilityScore,
    calculateIncomeConsistencyScore,
    calculateSpendingStabilityScore,
    calculateTrustScore,
    getConfidenceLevel,
    getRiskTier,
    generateFactors,
};
