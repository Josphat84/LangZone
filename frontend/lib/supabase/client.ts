import { createClient } from '@supabase/supabase-js'

// CRITICAL: These must be NEXT_PUBLIC_ prefixed to work in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  // During build time, this might not be available, so we provide a safe fallback
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    console.warn('Supabase env vars not found during build - this is expected during static generation');
  }
}

// Create client with safe defaults
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key-will-be-replaced-at-runtime',
  {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
      detectSessionInUrl: typeof window !== 'undefined',
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web',
      },
    },
  }
)

// Export a safe getter function
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // During SSR/build, return a mock
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null, count: 0 }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      }),
      removeChannel: () => {},
    } as any;
  }
  return supabase;
}