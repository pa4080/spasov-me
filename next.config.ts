import type { NextConfig } from "next";

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
  // experimental: {
  //   turbo: {
  //     useSwcCss: false,
  //   },
  // },
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
    return process.env.VERCEL_ENV === "development"
      ? [
          {
            source: "/:all*",
            locale: false,
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
            locale: false,
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
  },
};

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
// 	enabled: process.env.NEXT_WITH_BUILDER_ANALYZER === "true",
// });
// module.exports = withBundleAnalyzer(nextConfig);

export default nextConfig;
