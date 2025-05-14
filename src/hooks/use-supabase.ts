
import { supabase } from '@/lib/supabase';

// Re-export supabase client for convenience
export const useSupabaseClient = () => supabase;

// Example function to test connection
export const testConnection = async () => {
  try {
    // Simple ping to verify connection
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connected successfully');
    return { success: true };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err };
  }
};
