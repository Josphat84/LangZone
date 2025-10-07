// frontend/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null
let isInitializing = false

export function getSupabaseClient() {
  // Prevent concurrent initializations
  if (isInitializing) {
    while (isInitializing) {
      // Wait for initialization to complete
    }
    return supabase!
  }

  if (!supabase) {
    isInitializing = true
    
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storageKey: 'home-platform-auth',
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      }
    )
    
    isInitializing = false
  }
  
  return supabase
}
