import type { MetadataRoute } from "next";

import { serviceCatalog } from "@/data/site-data";

const BASE_URL = "https://dormcare.web.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/layanan`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/promo`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/booking`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/panduan`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/syarat-ketentuan`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  const layananRoutes: MetadataRoute.Sitemap = serviceCatalog.map(
    (service) => ({
      url: `${BASE_URL}/layanan/${service.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...layananRoutes];
}
