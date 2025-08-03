import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const SUPABASE_URL = 'https://mdcknijwhqpkxnrlgtwm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY2tuaWp3aHFwa3hucmxndHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NzgxMDQsImV4cCI6MjA2OTI1NDEwNH0.3IlVLeX1RE4TN9gWDzbqmYxO1UtsFOz2YWyL_fI5oRw'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase;