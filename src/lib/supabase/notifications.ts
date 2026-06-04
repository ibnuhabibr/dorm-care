import { getSupabaseBrowserClient } from "./client";
import type { NotificationItem } from "@/data/site-data";

export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    judul: n.title,
    pesan: n.message || "",
    waktu: n.created_at,
    kategori: (n.type === "order" ? "order" : n.type === "promo" ? "promo" : "akun") as NotificationItem["kategori"],
    sudahDibaca: n.is_read,
  }));
}

export async function markNotificationRead(notificationId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return 0;
  return count || 0;
}
