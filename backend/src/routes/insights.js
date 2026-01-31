import express from 'express';
import scoringService from '../services/scoring.js';
import { mockPersonas } from '../services/mockData.js';

const router = express.Router();

// Get detailed insights/factors
router.get('/factors', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
        const rawData = persona.rawData;

        const signals = {
            paymentReliability: scoringService.calculatePaymentReliabilityScore(rawData.paymentReliability),
            savingsStability: scoringService.calculateSavingsStabilityScore(rawData.savingsStability),
            incomeConsistency: scoringService.calculateIncomeConsistencyScore(rawData.incomeConsistency),
            spendingStability: scoringService.calculateSpendingStabilityScore(rawData.spendingStability),
        };

        const factors = scoringService.generateFactors(signals);

        res.json({
            factors,
            breakdown: {
                positive: factors.filter(f => f.type === 'positive'),
                negative: factors.filter(f => f.type === 'negative'),
            },
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get insights' });
    }
});

// Get chart data for insights page
router.get('/charts', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];

        res.json({
            payments: persona.history.payments,
            savings: persona.history.savings,
            scoreHistory: persona.history.score,
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get chart data' });
    }
});

// Get volatility analysis
router.get('/volatility', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
        const rawData = persona.rawData;

        const spendingScore = scoringService.calculateSpendingStabilityScore(rawData.spendingStability);

        res.json({
            score: spendingScore.score,
            volatility: spendingScore.volatility,
            volatilityPercent: spendingScore.volatilityPercent,
            status: spendingScore.label,
            description: getVolatilityDescription(spendingScore.score),
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get volatility data' });
    }
});

function getVolatilityDescription(score) {
    if (score >= 85) return 'Your spending patterns are very consistent and predictable.';
    if (score >= 70) return 'Your spending patterns are consistent and predictable.';
    if (score >= 50) return 'Some spending spikes detected. Consider more consistent patterns.';
    return 'Variable spending patterns may impact your Trust Score.';
}

export default router;
