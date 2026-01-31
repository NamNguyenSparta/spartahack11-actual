import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import reputationRoutes from './routes/reputation.js';
import passportRoutes from './routes/passport.js';
import businessRoutes from './routes/business.js';
import insightsRoutes from './routes/insights.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Credence API',
        version: '2.0.0',
        features: ['multi-agent-trust-system'],
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/insights', insightsRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🏦 Credence API Server v2.0                         ║
  ║   Multi-Agent AI Trust System                         ║
  ║                                                       ║
  ║   → Port: ${PORT}                                        ║
  ║   → Mode: ${process.env.NODE_ENV || 'development'}                              ║
  ║   → AI Agents: 5 (Payment, Savings, Income,           ║
  ║                   Spending, Risk)                     ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});
