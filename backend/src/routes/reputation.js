import express from 'express';
import snowflakeService from '../services/snowflake.js';
import scoringService from '../services/scoring.js';
import { mockPersonas } from '../services/mockData.js';

const router = express.Router();

// Get full reputation data (score + pillars)
router.get('/score', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        // Use mock data if enabled
        if (process.env.USE_MOCK_DATA === 'true') {
            const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
            const rawData = persona.rawData;

            // Calculate scores from raw data
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

            return res.json({
                personaId: persona.id,
                personaName: persona.name,
                personaAvatar: persona.avatar,
                trustScore,
                confidenceLevel,
                riskTier,
                signals,
                factors,
                history: persona.history,
            });
        }

        // Use Snowflake for real data
        const userId = req.query.userId || 'demo-user';

        const [paymentData, savingsData, incomeData, spendingData] = await Promise.all([
            snowflakeService.getPaymentReliability(userId),
            snowflakeService.getSavingsStability(userId),
            snowflakeService.getIncomeConsistency(userId),
            snowflakeService.getSpendingStability(userId),
        ]);

        const signals = {
            paymentReliability: scoringService.calculatePaymentReliabilityScore(paymentData),
            savingsStability: scoringService.calculateSavingsStabilityScore(savingsData),
            incomeConsistency: scoringService.calculateIncomeConsistencyScore(incomeData),
            spendingStability: scoringService.calculateSpendingStabilityScore(spendingData),
        };

        const trustScore = scoringService.calculateTrustScore(signals);
        const confidenceLevel = scoringService.getConfidenceLevel(trustScore);
        const riskTier = scoringService.getRiskTier(trustScore);
        const factors = scoringService.generateFactors(signals);

        res.json({
            userId,
            trustScore,
            confidenceLevel,
            riskTier,
            signals,
            factors,
        });

    } catch (error) {
        console.error('Error fetching reputation score:', error);
        res.status(500).json({ error: 'Failed to calculate reputation score' });
    }
});

// Get pillar breakdown only
router.get('/pillars', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        if (process.env.USE_MOCK_DATA === 'true') {
            const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
            const rawData = persona.rawData;

            const signals = {
                paymentReliability: scoringService.calculatePaymentReliabilityScore(rawData.paymentReliability),
                savingsStability: scoringService.calculateSavingsStabilityScore(rawData.savingsStability),
                incomeConsistency: scoringService.calculateIncomeConsistencyScore(rawData.incomeConsistency),
                spendingStability: scoringService.calculateSpendingStabilityScore(rawData.spendingStability),
            };

            return res.json({ signals, weights: scoringService.WEIGHTS });
        }

        // Snowflake implementation...
        res.status(501).json({ error: 'Snowflake mode not fully implemented' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get pillar data' });
    }
});

// Get score history
router.get('/history', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        if (process.env.USE_MOCK_DATA === 'true') {
            const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
            return res.json(persona.history);
        }

        const userId = req.query.userId || 'demo-user';
        const [payments, savings] = await Promise.all([
            snowflakeService.getPaymentHistory(userId),
            snowflakeService.getSavingsHistory(userId),
        ]);

        res.json({ payments, savings });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get history data' });
    }
});

// List available personas (demo mode)
router.get('/personas', (req, res) => {
    const personas = Object.values(mockPersonas).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        avatar: p.avatar,
    }));
    res.json({ personas });
});

export default router;
