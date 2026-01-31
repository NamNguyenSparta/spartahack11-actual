import express from 'express';
import * as scoringService from '../services/scoring.js';
import { mockPersonas } from '../services/mockData.js';

const router = express.Router();

// Get full reputation data with multi-agent analysis
router.get('/score', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.query;

        const persona = mockPersonas[personaId] || mockPersonas['responsible-student'];
        const rawData = persona.rawData;

        // Run multi-agent analysis
        const signals = {
            paymentReliability: scoringService.calculatePaymentReliabilityScore(rawData.paymentReliability),
            savingsStability: scoringService.calculateSavingsStabilityScore(rawData.savingsStability),
            incomeConsistency: scoringService.calculateIncomeConsistencyScore(rawData.incomeConsistency),
            spendingStability: scoringService.calculateSpendingStabilityScore(rawData.spendingStability),
        };

        // Run AI agent analysis
        const agentAnalysis = scoringService.runMultiAgentAnalysis(signals);

        return res.json({
            personaId: persona.id,
            personaName: persona.name,
            personaAvatar: persona.avatar,
            ...agentAnalysis,
            signals,
            history: persona.history,
        });

    } catch (error) {
        console.error('Error fetching reputation score:', error);
        res.status(500).json({ error: 'Failed to calculate reputation score' });
    }
});

// Get agent discussion
router.get('/discussion', async (req, res) => {
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

        const agentAnalysis = scoringService.runMultiAgentAnalysis(signals);
        const discussion = scoringService.generateAgentDiscussion(agentAnalysis.agents);

        return res.json({
            personaId: persona.id,
            discussion,
            consensus: agentAnalysis.consensus,
        });

    } catch (error) {
        console.error('Error generating discussion:', error);
        res.status(500).json({ error: 'Failed to generate agent discussion' });
    }
});

// Get list of available agents
router.get('/agents', (req, res) => {
    res.json({
        agents: scoringService.AI_AGENTS,
        totalAgents: Object.keys(scoringService.AI_AGENTS).length,
    });
});

export default router;
