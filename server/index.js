import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Import our new payments router module
import paymentRouter from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mount our functional payment endpoints onto our server routing tree
app.use('/api/payments', paymentRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'alive', message: 'Cepheus Engine is running smoothly.' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ success: true, message: 'Successfully connected to Supabase Cloud Database!', currentTableCount: data || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Cepheus Backend Engine live on: http://localhost:${PORT}`);
  console.log(`📡 Testing endpoints:`);
  console.log(`   - Health check: http://localhost:${PORT}/api/health`);
  console.log(`   - Database link: http://localhost:${PORT}/api/test-db`);
  console.log(`   - Razorpay Order Test: http://localhost:${PORT}/api/payments/test-booking-fee (POST)`);
  console.log(`==================================================\n`);
});