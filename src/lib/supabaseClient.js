import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback for missing credentials to prevent app crash
const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here'

console.log('Supabase Config Debug:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValue: supabaseUrl?.substring(0, 10) + '...', // Log partial value for safety
  isDefault: supabaseUrl === 'your_supabase_url_here',
  isConfigured
})

if (!isConfigured) {
  console.warn('Supabase not configured. Please check your .env file.')
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => isConfigured

