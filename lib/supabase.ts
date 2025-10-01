// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Keep your keys in environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Factory function to create a Supabase client
export function getSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey)
}
