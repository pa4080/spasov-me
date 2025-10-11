import { type MetadataRoute } from "next";

import { BASE_URL } from "./_layout.constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "", // or add disallowed paths here
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
