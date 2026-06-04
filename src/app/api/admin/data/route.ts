import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // Get emails from auth.users
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const emailById: Record<string, string> = {};
  for (const u of authUsers?.users || []) {
    if (u.id) emailById[u.id] = u.email || "";
  }

  const userIds = (profiles || []).map((p) => p.id);
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .in("user_id", userIds)
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const ordersByUser: Record<string, typeof orders> = {};
  for (const o of orders || []) {
    if (!ordersByUser[o.user_id]) ordersByUser[o.user_id] = [];
    ordersByUser[o.user_id].push(o);
  }

  const users = (profiles || []).map((p) => ({
    ...p,
    email: emailById[p.id] || "",
    orders: ordersByUser[p.id] || [],
    total_spent: (ordersByUser[p.id] || []).reduce(
      (sum: number, o: any) => sum + (o.status !== "cancelled" ? o.total_amount : 0), 0
    ),
    total_orders: (ordersByUser[p.id] || []).length,
  }));

  return NextResponse.json({ users, orders });
}
