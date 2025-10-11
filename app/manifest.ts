// in app/manifest.ts
import { type MetadataRoute } from "next";

import { APP_NAME, META_DESCRIPTION, META_TITLE } from "./_layout.constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: META_TITLE,
    short_name: APP_NAME,
    description: META_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    theme_color: "#548ada",
    background_color: "#787878",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icons/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
