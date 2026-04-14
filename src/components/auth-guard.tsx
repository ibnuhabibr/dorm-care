"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/state/session-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const PROTECTED_ROUTES = ["/booking", "/riwayat", "/transaksi", "/profil", "/notifikasi"];
const ADMIN_ROUTES = ["/admin"];

/**
 * Client-side auth guard. Wraps protected pages to redirect
 * unauthenticated users to /auth/masuk.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSessionStore((s) => s.user);

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // Sync Supabase Auth with Zustand
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        useSessionStore.getState().setUser({
          id: session.user.id,
          nama: session.user.user_metadata.first_name 
            ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name || ''}`.trim()
            : session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          noHp: session.user.user_metadata.whatsapp || "",
          role: session.user.email?.includes("admin") ? "admin" : "user",
          membership: "bronze",
        });
      } else if (event === "SIGNED_OUT") {
        useSessionStore.getState().logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isProtected && !user) {
      router.replace(`/auth/masuk?redirect=${encodeURIComponent(pathname)}`);
    }
    if (isAdmin && (!user || user.role !== "admin")) {
      router.replace("/auth/masuk");
    }
  }, [user, isProtected, isAdmin, pathname, router]);

  // Show nothing while redirecting
  if ((isProtected || isAdmin) && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
          <p className="text-sm text-neutral-500">Memeriksa sesi login...</p>
        </div>
      </div>
    );
  }

  if (isAdmin && user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
          <p className="text-sm text-neutral-500">Akses ditolak...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
