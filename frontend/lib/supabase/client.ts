// frontend/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Keep one client per browser session
let supabase: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!supabase) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storageKey: 'home-platform-auth', // Add this unique key
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      }
    )
  }
  return supabase
}