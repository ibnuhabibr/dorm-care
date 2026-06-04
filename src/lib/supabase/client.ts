import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { MembershipLevel } from "@/data/site-data";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
}

export async function getUserMembership(userId: string): Promise<MembershipLevel> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return "bronze";

  const { data: profile } = await supabase
    .from("profiles")
    .select("member_level")
    .eq("id", userId)
    .single();

  const level = profile?.member_level;
  if (level === "silver" || level === "gold") return level;
  return "bronze";
}
