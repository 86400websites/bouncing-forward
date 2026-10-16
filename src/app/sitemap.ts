import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/lib/blog";

const routes = [
  "",
  "/book",
  "/course",
  "/compass-and-path",
  "/stories",
  "/about",
  "/assess",
  "/enterprise",
  "/contact",
  "/faq",
  "/all-in",
  "/blog",
  "/premium",
  ...POSTS.map((post) => `/blog/${post.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
