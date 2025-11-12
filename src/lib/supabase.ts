import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize supabase client safely: don't throw during module import
// if env vars are missing or malformed. Instead, export `null` and
// let the app handle the absence of the client at runtime.
let _supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables; supabase client not initialized.');
} else {
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