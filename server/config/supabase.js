import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 1. Ensure env variables load first thing at startup
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// 2. Point this directly to your service role key variable
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ [Supabase Warning] Missing connection credentials inside your environment layout.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);