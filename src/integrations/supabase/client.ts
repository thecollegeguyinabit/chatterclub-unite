
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hswfcirxrwxoofxkprdy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzd2ZjaXJ4cnd4b29meGtwcmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDEzNjksImV4cCI6MjA2MDM3NzM2OX0.96xDWN7-Fnwb_gQyoqoSL0Sgs_A-94w_W15_FSDK40Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
