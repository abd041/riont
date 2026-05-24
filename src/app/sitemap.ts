import type { MetadataRoute } from "next";
import { getStorefrontSitemapEntries } from "@/server/services/catalog-sitemap.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const entries = await getStorefrontSitemapEntries();

  return entries.map((entry) => ({
    url: `${base}/${entry.locale}${entry.path === "" ? "" : entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.path.includes("/products/") ? "weekly" : "daily",
    priority: entry.path === "" ? 1 : entry.path === "/products" ? 0.9 : 0.7,
  }));
}
