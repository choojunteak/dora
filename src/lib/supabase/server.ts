import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  hasSupabasePublicEnv
} from "@/lib/supabase/env";

const SUPABASE_READ_TIMEOUT_MS = 5000;

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_READ_TIMEOUT_MS);

  return fetch(input, {
    ...init,
    signal: init?.signal ?? controller.signal
  }).finally(() => clearTimeout(timeout));
}

export function hasSupabaseServerEnv() {
  return hasSupabasePublicEnv();
}

export function createServerSupabaseClient(): SupabaseClient<Database> | null {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabasePublishableKey();

  if (!supabaseUrl || !supabaseKey) {
    // Missing public Supabase env values means server reads should keep using mock data.
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: fetchWithTimeout
    }
  });
}
