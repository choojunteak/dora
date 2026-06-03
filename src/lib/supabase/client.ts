import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  hasSupabasePublicEnv
} from "@/lib/supabase/env";

export function hasSupabaseBrowserEnv() {
  return hasSupabasePublicEnv();
}

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabasePublishableKey();

  if (!supabaseUrl || !supabaseKey) {
    // MVP fallback: missing public Supabase env values means the app should keep using mock data.
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}
