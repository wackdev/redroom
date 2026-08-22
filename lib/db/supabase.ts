import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient, SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
    !url.includes("placeholder") &&
    url.startsWith("http") &&
    key &&
    !key.includes("placeholder")
  );
}

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
}

function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "placeholder-anon-key"
  );
}

/**
 * Creates a standard browser-side Supabase client using @supabase/ssr.
 */
export function createClient(): SupabaseClient {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}

let browserClientInstance: SupabaseClient | null = null;

/**
 * Returns a shared browser client singleton.
 */
export function getBrowserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    return createClient();
  }
  if (!browserClientInstance) {
    browserClientInstance = createClient();
  }
  return browserClientInstance;
}

/**
 * Creates a server-side administrative client with service-role permissions if available.
 */
export function createAdminClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || getSupabaseAnonKey();
  return createSupabaseJsClient(getSupabaseUrl(), serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
