import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubpxlhfkxqjrsgnwlzh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YnB4bGhma3hxanJzZ253bHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2MzA0MDAsImV4cCI6MjAyNDIwNjQwMH0.0QQlODHpkEKVQJ-h-Zj4SVEQyIXhf0tHM1zRXh8Vp-s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
});