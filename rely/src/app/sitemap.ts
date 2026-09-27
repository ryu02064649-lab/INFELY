import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/request/"].map((path) => ({
    url: new URL(path, site.url).toString(),
  }));
}
