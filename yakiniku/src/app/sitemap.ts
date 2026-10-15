import type { MetadataRoute } from "next";
import { MENU_PATH, site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", MENU_PATH].map((path) => ({
    url: new URL(path, site.url).toString(),
  }));
}
