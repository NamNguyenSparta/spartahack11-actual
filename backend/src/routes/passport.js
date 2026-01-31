import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import scoringService from '../services/scoring.js';
import { mockPersonas } from '../services/mockData.js';

const router = express.Router();

// In-memory passport storage (use Redis/DB in production)
const passports = new Map();

// Generate a new Trust Passport
router.post('/generate', async (req, res) => {
    try {
        const { personaId = 'responsible-student' } = req.body;

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

        // Generate passport
        const passportId = uuidv4();
        const passport = {
            id: passportId,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            personaName: persona.name,
            trustScore,
            confidenceLevel,
            summary: generateSummary(signals),
            shareUrl: `https://credence.app/verify/${passportId}`,
        };

        // Store passport
        passports.set(passportId, passport);

        res.json({
            success: true,
            passport,
        });

    } catch (error) {
        console.error('Error generating passport:', error);
        res.status(500).json({ error: 'Failed to generate passport' });
    }
});

// Get passport by ID (for verification)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const passport = passports.get(id);

        if (!passport) {
            return res.status(404).json({ error: 'Passport not found' });
        }

        // Check expiration
        if (new Date(passport.expiresAt) < new Date()) {
            return res.status(410).json({ error: 'Passport has expired' });
        }

        res.json({
            valid: true,
            passport,
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve passport' });
    }
});

// Revoke a passport
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (passports.has(id)) {
        passports.delete(id);
        res.json({ success: true, message: 'Passport revoked' });
    } else {
        res.status(404).json({ error: 'Passport not found' });
    }
});

// Generate summary items from signals
function generateSummary(signals) {
    const items = [];

    if (signals.paymentReliability.score >= 70) {
        items.push({ text: 'Consistent rent payments', verified: true });
    }
    if (signals.savingsStability.score >= 70) {
        items.push({ text: 'Stable savings pattern', verified: true });
    }
    if (signals.spendingStability.score >= 70) {
        items.push({ text: 'Low spending volatility', verified: true });
    }
    if (signals.incomeConsistency.score >= 70) {
        items.push({ text: 'Regular income deposits', verified: true });
    }
    if (signals.paymentReliability.score < 70) {
        items.push({ text: 'Some late payments detected', verified: false });
    }
    if (signals.savingsStability.score < 50) {
        items.push({ text: 'Low savings buffer', verified: false });
    }

    return items;
}

export default router;
