import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/", "/profil/", "/transaksi", "/riwayat", "/notifikasi"],
    },
    sitemap: "https://dormcare.web.id/sitemap.xml",
  };
}
