// Supabase client - uses real Supabase if env vars are configured, otherwise falls back to local storage
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabaseClient: ReturnType<typeof import("@supabase/supabase-js").createClient> | null = null;

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (supabaseClient) return supabaseClient;
  
  const { createClient } = await import("@supabase/supabase-js");
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}
