import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key);
}
