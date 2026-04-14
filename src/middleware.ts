import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/booking",
  "/riwayat",
  "/transaksi",
  "/profil",
  "/notifikasi",
];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Legacy English routes → redirect to Indonesian equivalents
const redirectMap: Record<string, string> = {
  "/about": "/tentang",
  "/contact": "/kontak",
  "/services": "/layanan",
  "/profile": "/profil",
  "/terms": "/syarat-ketentuan",
  "/auth/login": "/auth/masuk",
  "/checkout": "/booking",
  "/admin/orders": "/admin/pesanan",
  "/admin/services": "/admin/layanan",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle legacy route redirects
  for (const [from, to] of Object.entries(redirectMap)) {
    if (pathname === from || pathname.startsWith(from + "/")) {
      const newPath = pathname.replace(from, to);
      return NextResponse.redirect(new URL(newPath, request.url), 301);
    }
  }

  // 2. Auth checks are handled client-side via Zustand session store
  //    since we're using client-side auth with Supabase.
  //    The middleware here is primarily for route redirects.
  //    Full server-side auth protection would require Supabase SSR setup.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
