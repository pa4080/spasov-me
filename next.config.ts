import type { NextConfig } from "next";

const IS_DEV_MODE = process.env.NODE_ENV === "development";
const IS_DEV_MODE_VERCEL = process.env.VERCEL_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "26mb", // https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit
    },
    reactCompiler: !IS_DEV_MODE,
    staleTimes: {
      dynamic: 30, // cache dynamic routes for 30s
      static: 604800, // cache static routes for 1 week
    },
  },
  // sassOptions: {
  //   scss: {
  //     api: "modern-compiler",
  //   },
  // },
  // sassOptions: {
  //   additionalData: `@import "app/_styles/globals-file-card.scss"; @import "globals-syntax-highlight.scss";`,
  // },
  images: {
    // unoptimized: true,
    dangerouslyAllowSVG: true,
    // https://nextjs.org/docs/messages/next-image-unconfigured-host
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.spasov.me",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const conditionalHeaders = IS_DEV_MODE_VERCEL
      ? [
          {
            source: "/:all*",
            locale: false as const,
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=10, s-maxage=10, must-revalidate",
              },
              {
                key: "Access-Control-Allow-Origin",
                value: "media.spasov.me",
              },
            ],
          },
        ]
      : [
          {
            source:
              "/:all*(png|jpg|jpeg|svg|webp|gif|jfif|avif|pdf|pptx|xlsx|csv|txt|docx|webm|mkv|avi|mp4|eot|ttf|woff|woff2)",
            locale: false as const,
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=604800, s-maxage=604800, must-revalidate",
              },
              {
                key: "Access-Control-Allow-Origin",
                value: "media.spasov.me",
              },
            ],
          },
        ];

    return [
      ...conditionalHeaders,
      {
        source: "/api/ai/openai",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "openvscode-3001.metalevel.tech",
    "localhost:3001",
    "localhost:3000",
    "localhost",
  ],
};

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
// 	enabled: process.env.NEXT_WITH_BUILDER_ANALYZER === "true",
// });
// module.exports = withBundleAnalyzer(nextConfig);

export default nextConfig;
