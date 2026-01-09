import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create a mock response for when Supabase is not configured
const mockResponse = {
  data: null,
  error: { message: 'Supabase is not configured. Please set environment variables.' },
};

// Create a mock Supabase client for build time / when env vars are missing
const createMockClient = (): any => {
  const mockQueryBuilder = () => ({
    select: () => mockQueryBuilder(),
    insert: () => mockQueryBuilder(),
    update: () => mockQueryBuilder(),
    delete: () => mockQueryBuilder(),
    eq: () => mockQueryBuilder(),
    neq: () => mockQueryBuilder(),
    order: () => mockQueryBuilder(),
    limit: () => mockQueryBuilder(),
    single: () => Promise.resolve(mockResponse),
    then: (resolve: Function) => resolve(mockResponse),
  });

  return {
    from: () => mockQueryBuilder(),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
};

// Export the real client if configured, otherwise export mock client
export const supabase: SupabaseClient | ReturnType<typeof createMockClient> = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  : createMockClient();

