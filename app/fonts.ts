/**
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/fonts
 */
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
// import { Inter, Roboto_Slab } from "next/font/google";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";

// export { GeistSans, GeistMono };

// export const inter = Inter({
// 	subsets: ["latin"],
// 	display: "swap",
// 	variable: "--font-inter",
// });

export const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});

// export const roboto_slab = Roboto_Slab({
// 	subsets: ["latin"],
// 	weight: ["500", "700"], // ["100", ..., "900"]
// 	style: ["normal"], // italic
// 	display: "swap",
// 	variable: "--font-roboto-slab",
// });

export const unicephalon = localFont({
	src: [
		{
			path: "../public/fonts/disaster-fonts/unicephalon.heavy.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/disaster-fonts/unicephalon.heavy.ttf",
			weight: "400",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-unicephalon",
});

// export const multivacInterference = localFont({
// 	src: [
// 		{
// 			path: "../public/fonts/disaster-fonts/multivac.interference.woff2",
// 			weight: "400",
// 			style: "normal",
// 		},
// 		{
// 			path: "../public/fonts/disaster-fonts/multivac.interference.ttf",
// 			weight: "400",
// 			style: "normal",
// 		},
// 	],
// 	display: "swap",
// 	variable: "--font-multivac-interference",
// });

// export const multivacGhost = localFont({
// 	src: [
// 		{
// 			path: "../public/fonts/disaster-fonts/multivac.ghost.woff2",
// 			weight: "400",
// 			style: "normal",
// 		},
// 		{
// 			path: "../public/fonts/disaster-fonts/multivac.ghost.ttf",
// 			weight: "400",
// 			style: "normal",
// 		},
// 	],
// 	display: "swap",
// 	variable: "--font-multivac-ghost",
// });
