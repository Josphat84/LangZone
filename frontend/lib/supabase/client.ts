import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

// Lazy initialization - only creates client when actually needed
function initSupabase() {
  // NEVER initialize during build/SSR
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Get credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate credentials exist
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing');
    return null;
  }

  // Create client only in browser with valid credentials
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return null;
  }
}

// Safe proxy that returns mock during build/SSR
export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    const client = initSupabase();
    
    // During build/SSR, return safe mocks
    if (!client) {
      if (prop === 'from') {
        return () => ({
          select: () => Promise.resolve({ data: [], error: null, count: 0 }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => Promise.resolve({ data: null, error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
        });
      }
      if (prop === 'channel') {
        return () => ({
          on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
        });
      }
      if (prop === 'removeChannel') {
        return () => {};
      }
      return undefined;
    }
    
    // In browser, return real client methods
    return client[prop as keyof SupabaseClient];
  },
});