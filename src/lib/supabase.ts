// Importing the Supabase client only when needed avoids noisy warnings
// in production on static hosts. We still support initializing the
// client when env vars are present, but only warn during development.
import { createClient } from '@supabase/supabase-js';

// Support both VITE_* and common NEXT_PUBLIC_* env var names so users who
// set their variables with different prefixes (for example when migrating
// from Next.js) still have a working client. Vite exposes env vars via
// import.meta.env at build time.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize supabase client safely: don't throw during module import
// if env vars are missing or malformed. Instead, export `null` and
// let the app handle the absence of the client at runtime.
let _supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid noisy warnings on production/public sites. Only warn during
  // development so local devs get helpful messages while visitors on
  // your published site won't see the console warning.
  if (import.meta.env.DEV) {
    console.warn('Missing Supabase environment variables; supabase client not initialized. Expected VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  }
} else {
  // Log which env vars were consumed (non-sensitive info) for easier debugging
  try {
    console.info('Initializing Supabase client with URL:', supabaseUrl ? '(provided)' : '(missing)');
  } catch (e) { /* noop */ }
  try {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    // If createClient throws (for example due to malformed URL), log and continue.
    // This prevents a hard crash during module import which results in a blank page.
    // Downstream code should check `supabase` for null before using it.
    // eslint-disable-next-line no-console
    console.error('Failed to create Supabase client:', err);
    _supabase = null;
  }
}

export const supabase = _supabase;

// Database schema types
export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          user_id?: string;
          wallet_address?: string;
          context: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          wallet_address?: string;
          context: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallet_address?: string;
          context?: any;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          content: string;
          role: 'user' | 'assistant';
          timestamp: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          content: string;
          role: 'user' | 'assistant';
          timestamp?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          content?: string;
          role?: 'user' | 'assistant';
          timestamp?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          wallet_address?: string;
          source: string;
          interests: string[];
          messages: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          wallet_address?: string;
          source: string;
          interests?: string[];
          messages?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          wallet_address?: string;
          source?: string;
          interests?: string[];
          messages?: string[];
        };
      };
      analytics_events: {
        Row: {
          id: string;
          event: string;
          properties: any;
          session_id?: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          event: string;
          properties: any;
          session_id?: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          event?: string;
          properties?: any;
          session_id?: string;
          timestamp?: string;
        };
      };
    };
  };
}