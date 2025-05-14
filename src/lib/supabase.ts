
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://igmmbbghxygeqjxxoenr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbW1iYmdoeHlnZXFqeHhvZW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzk5NjgsImV4cCI6MjA2MjgxNTk2OH0.xoCmN7PXEk7V8sW56f3DmiUX4qvY8BADcYDT5TQczK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
