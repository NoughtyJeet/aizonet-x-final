
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

// Proxy to handle lazy initialization and provide clear error messages
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Return a dummy object that mimics SupabaseClient behavior
        // but returns empty/null results to trigger fallbacks gracefully
        const dummyClient: any = {
          auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signOut: async () => ({ error: null })
          },
          from: () => ({
            select: () => ({
              order: () => ({
                eq: () => ({
                  single: async () => ({ data: null, error: { code: 'PGRST116', message: 'Credentials missing' } }),
                  then: (cb: any) => cb({ data: [], error: null })
                }),
                then: (cb: any) => cb({ data: [], error: null })
              }),
              eq: () => ({
                single: async () => ({ data: null, error: { code: 'PGRST116', message: 'Credentials missing' } }),
                then: (cb: any) => cb({ data: [], error: null })
              }),
              then: (cb: any) => cb({ data: [], error: null })
            }),
            upsert: () => ({
              select: () => ({
                single: async () => ({ data: null, error: new Error('Credentials missing') })
              }),
              then: (cb: any) => cb({ data: null, error: new Error('Credentials missing') })
            }),
            insert: () => ({
              then: (cb: any) => cb({ data: null, error: new Error('Credentials missing') })
            }),
            delete: () => ({
              eq: () => ({
                then: (cb: any) => cb({ error: new Error('Credentials missing') })
              })
            })
          })
        };
        return dummyClient[prop];
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return Reflect.get(_supabase, prop, receiver);
  }
});
