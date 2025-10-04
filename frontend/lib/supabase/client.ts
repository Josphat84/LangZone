// frontend/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates and exports a singleton instance of the Supabase Client for the browser.
 * * This uses the official createBrowserClient from @supabase/ssr, which 
 * is designed to work reliably with Next.js environment variables.
 * * It will automatically use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export const supabase = createBrowserClient(
  // The '!' tells TypeScript these variables exist (since you confirmed they are set).
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// You can now import it in your components like this:
// import { supabase } from '@/lib/supabase/client';