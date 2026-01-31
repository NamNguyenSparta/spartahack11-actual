import express from 'express';
import jwt from 'jsonwebtoken';
import { mockUsers } from '../services/mockData.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Demo mode - accept any credentials
        if (process.env.USE_MOCK_DATA === 'true') {
            const token = jwt.sign(
                { userId: 'demo-user', email: email || 'demo@credence.app' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: 'demo-user',
                    email: email || 'demo@credence.app',
                    name: 'Demo User',
                },
            });
        }

        // Production: Validate against real user database
        // TODO: Implement real authentication
        res.status(401).json({ error: 'Invalid credentials' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Demo login (no credentials needed)
router.post('/demo', async (req, res) => {
    const token = jwt.sign(
        { userId: 'demo-user', email: 'demo@credence.app', isDemo: true },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        token,
        user: mockUsers['demo-user'],
    });
});

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
            valid: true,
            user: {
                id: decoded.userId,
                email: decoded.email,
            },
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
