import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bookingRoutes from './routes/bookings.js';
import webhookRoutes from './routes/webhooks.js';
import paymentRouter from './routes/payments.js';
import trackingRoutes from './routes/tracking.js';
import sheetsRoutes from './routes/sheets.js';
import institutionsRoutes from './routes/institutions.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. ROBUST CORS CONFIGURATION (Fixes the Network Error)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Specifically handle preflight requests
app.options('*', cors());

app.use(express.json());

// 2. SUPABASE INITIALIZATION
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

<<<<<<< HEAD
// 3. ROUTE MOUNTING
app.use('/api/bookings', bookingRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payments', paymentRouter); // Now mounted correctly
=======
// Mount our functional endpoints onto our server routing tree
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRouter);
app.use('/api/tracking', trackingRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/sheets', sheetsRoutes);
app.use('/api/institutions', institutionsRoutes);
app.use('/api/admin', adminRoutes);
>>>>>>> 698ee07 (Refactor client to React Router declarative paths and integrate full-stack tracking and telemetry engines)

// 4. HEALTH CHECK ENDPOINTS
app.get('/api/health', (req, res) => {
    res.json({
        status: 'alive',
        message: 'Cepheus Engine is running smoothly.',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('count', {
            count: 'exact',
            head: true
        });
        if (error) throw error;
        res.json({
            success: true,
            message: 'Successfully connected to Supabase Cloud Database!',
            currentTableCount: data || 0
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

<<<<<<< HEAD
// 5. START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    🚀 Cepheus Backend Engine live!
    📡 Port: ${PORT}
    🔗 URL: http://localhost:${PORT}
    `);
});
=======
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Cepheus Backend Engine live on: http://localhost:${PORT}`);
  console.log(`📡 Testing endpoints:`);
  console.log(`   - Health check: http://localhost:${PORT}/api/health`);
  console.log(`   - Database link: http://localhost:${PORT}/api/test-db`);
  console.log(`   - Razorpay Order Test: http://localhost:${PORT}/api/payments/test-booking-fee (POST)`);
  console.log(`==================================================\n`);
});
>>>>>>> 698ee07 (Refactor client to React Router declarative paths and integrate full-stack tracking and telemetry engines)
