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

// Import Snowflake service
import snowflakeService from './services/snowflake.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
    const health = {
        status: 'healthy',
        service: 'Credence API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        snowflake: { connected: false },
    };

    // Test Snowflake connection if not in mock mode
    if (process.env.USE_MOCK_DATA !== 'true') {
        try {
            const result = await snowflakeService.testConnection();
            health.snowflake = {
                connected: result.success,
                user: result.data?.USER,
                error: result.error,
            };
        } catch (error) {
            health.snowflake = { connected: false, error: error.message };
        }
    } else {
        health.snowflake = { connected: false, mode: 'mock_data' };
    }

    res.json(health);
});

// Snowflake test endpoint
app.get('/api/snowflake/test', async (req, res) => {
    try {
        const result = await snowflakeService.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initialize Snowflake schema
app.post('/api/snowflake/init', async (req, res) => {
    try {
        const result = await snowflakeService.initializeSchema();
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
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
app.listen(PORT, async () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🏦 Credence API Server                              ║
  ║   Financial Trust Platform Backend                    ║
  ║                                                       ║
  ║   → Port: ${PORT}                                        ║
  ║   → Mode: ${process.env.NODE_ENV || 'development'}                              ║
  ║   → Data: ${process.env.USE_MOCK_DATA === 'true' ? 'Mock Data' : 'Snowflake'}                             ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);

    // Test Snowflake connection on startup if not in mock mode
    if (process.env.USE_MOCK_DATA !== 'true') {
        console.log('🔄 Testing Snowflake connection...');
        try {
            const result = await snowflakeService.testConnection();
            if (result.success) {
                console.log('✅ Snowflake connection verified');
            } else {
                console.log('⚠️  Snowflake connection failed:', result.error);
                console.log('   Falling back to mock data mode');
            }
        } catch (error) {
            console.log('⚠️  Snowflake error:', error.message);
        }
    }
});
