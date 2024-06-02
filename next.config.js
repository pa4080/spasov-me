/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const nextConfig = {
	reactStrictMode: true,
	// trailingSlash: true,
	output: "standalone",
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
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
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
						source: "/:all*(svg|jpg|png|webp|webm|mkv|avi|mp4|eot|svg|ttf|woff|woff2)",
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

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/order
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
// 	enabled: process.env.NEXT_WITH_BUILDER_ANALYZER === "true",
// });
// module.exports = withBundleAnalyzer(nextConfig);

module.exports = nextConfig;
