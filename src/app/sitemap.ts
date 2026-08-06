import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes = [
  "",
  "/book",
  "/course",
  "/compass-and-path",
  "/stories",
  "/about",
  "/assess",
  "/workshops",
  "/contact",
  "/all-in",
  "/blog",
  "/podcast",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
