/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const nextConfig = {
	reactStrictMode: true,
	// trailingSlash: true,
	images: {
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
		],
	},
	/**
	env: {
		HOT_JAR_ID: process.env.HOT_JAR_ID,
		OPTIMIZE_ID: process.env.OPTIMIZE_ID,
		GOOGLE_SITE_VERIFICATION_ID: process.env.GOOGLE_SITE_VERIFICATION_ID,
		GTAG: process.env.GTAG,
		REACT_APP_GATAG: process.env.REACT_APP_GATAG,
	},
	*/

	// async rewrites() {
	// 	return process.env.VERCEL_ENV === "development"
	// 		? [
	// 				{
	// 					source: "/api/:path*",
	// 					destination: "https://openvscode-3001.metalevel.tech/api/:path*",
	// 				},
	// 		  ]
	// 		: [];
	// },
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	async headers() {
		return process.env.VERCEL_ENV === "development"
			? []
			: [
					{
						source: "/:all*(svg|jpg|png|webp|webm|mkv|avi|mp4|eot|svg|ttf|woff|woff2)",
						locale: false,
						headers: [
							{
								key: "Cache-Control",
								value: "public, max-age=604800, s-maxage=604800, must-revalidate",
							},
						],
					},
				];
	},
};

module.exports = nextConfig;
