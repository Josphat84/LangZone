// frontend/lib/supabase/client.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  // 1. SSR safe check: Return null if this runs on the server (during build/SSR)
  if (typeof window === "undefined") return null;

  // 2. Singleton pattern: Initialize only once
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase credentials missing");
      return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseInstance;
}

// **********************************
// NEW: Named export for 'supabase' to satisfy the import statement
// **********************************
export const supabase = getSupabaseClient();