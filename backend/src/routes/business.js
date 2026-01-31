import express from 'express';
import scoringService from '../services/scoring.js';
import { mockPersonas } from '../services/mockData.js';

const router = express.Router();

// Get applicant data for business/underwriting view
router.get('/applicant/:personaId', async (req, res) => {
    try {
        const { personaId } = req.params;

        const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
        const rawData = persona.rawData;

        // Calculate scores
        const signals = {
            paymentReliability: scoringService.calculatePaymentReliabilityScore(rawData.paymentReliability),
            savingsStability: scoringService.calculateSavingsStabilityScore(rawData.savingsStability),
            incomeConsistency: scoringService.calculateIncomeConsistencyScore(rawData.incomeConsistency),
            spendingStability: scoringService.calculateSpendingStabilityScore(rawData.spendingStability),
        };

        const trustScore = scoringService.calculateTrustScore(signals);
        const confidenceLevel = scoringService.getConfidenceLevel(trustScore);
        const riskTier = scoringService.getRiskTier(trustScore);
        const factors = scoringService.generateFactors(signals);

        // Build underwriting-focused response
        res.json({
            applicant: {
                id: persona.id,
                name: persona.name,
                description: persona.description,
                avatar: persona.avatar,
            },
            assessment: {
                trustScore,
                confidenceLevel,
                riskTier,
                recommendation: getRecommendation(trustScore),
            },
            indicators: [
                {
                    key: 'paymentReliability',
                    label: 'Payment Reliability',
                    value: signals.paymentReliability.label,
                    score: signals.paymentReliability.score,
                    icon: '💳'
                },
                {
                    key: 'incomeConsistency',
                    label: 'Income Stability',
                    value: signals.incomeConsistency.label,
                    score: signals.incomeConsistency.score,
                    icon: '💼'
                },
                {
                    key: 'savingsStability',
                    label: 'Savings Buffer',
                    value: signals.savingsStability.label,
                    score: signals.savingsStability.score,
                    icon: '🏦'
                },
                {
                    key: 'spendingStability',
                    label: 'Spending Volatility',
                    value: signals.spendingStability.label,
                    score: signals.spendingStability.score,
                    icon: '📊'
                },
            ],
            factors,
            details: {
                paymentHistory: {
                    onTimeRate: `${Math.round((signals.paymentReliability.onTime / signals.paymentReliability.total) * 100)}%`,
                    onTime: signals.paymentReliability.onTime,
                    total: signals.paymentReliability.total,
                },
                savings: {
                    trend: signals.savingsStability.trend,
                    status: signals.savingsStability.label,
                },
                spending: {
                    volatility: signals.spendingStability.volatility,
                    stability: signals.spendingStability.label,
                },
            },
        });

    } catch (error) {
        console.error('Error fetching applicant data:', error);
        res.status(500).json({ error: 'Failed to get applicant data' });
    }
});

// List all applicants (for demo)
router.get('/applicants', (req, res) => {
    const applicants = Object.values(mockPersonas).map(p => {
        const rawData = p.rawData;
        const signals = {
            paymentReliability: scoringService.calculatePaymentReliabilityScore(rawData.paymentReliability),
            savingsStability: scoringService.calculateSavingsStabilityScore(rawData.savingsStability),
            incomeConsistency: scoringService.calculateIncomeConsistencyScore(rawData.incomeConsistency),
            spendingStability: scoringService.calculateSpendingStabilityScore(rawData.spendingStability),
        };
        const trustScore = scoringService.calculateTrustScore(signals);

        return {
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            trustScore,
            riskTier: scoringService.getRiskTier(trustScore),
        };
    });

    res.json({ applicants });
});

function getRecommendation(score) {
    if (score >= 80) return 'Strongly recommended for approval';
    if (score >= 65) return 'Recommended for approval with standard terms';
    if (score >= 50) return 'Consider approval with additional verification';
    if (score >= 35) return 'Additional documentation required';
    return 'Manual review recommended';
}

export default router;
