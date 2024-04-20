import "@/env";
import React from "react";

// import { Analytics } from "@vercel/analytics/react";

import { inter, unicephalon } from "@/app/fonts";
import MainLayout from "@/components/layouts/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { AppContextProvider } from "@/contexts/AppContext";
import AuthSessionProvider from "@/contexts/AuthSessionProvider";
import RecaptchaContextProvider from "@/contexts/RecaptchaContextProvider";
import ThemesProvider from "@/contexts/ThemesProvider";
import manifest from "@/public/manifest.json";

import "./globals.scss";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
	title: manifest.name,
	description: manifest.description,
	manifest: "/manifest.json",
	robots: "index,follow",
	keywords: manifest.keywords,
	publisher: manifest.author,
	creator: manifest.author,
	icons: "/favicon.svg",
};

export const viewport: Viewport = {
	themeColor: [
		{ color: manifest.theme_color, media: "(prefers-color-scheme: light)" },
		{ color: manifest.theme_color_dark, media: "(prefers-color-scheme: dark)" },
	],
	colorScheme: "light dark",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
	return (
		<html suppressHydrationWarning lang="en">
			<body
				className={
					`${inter.className} ${unicephalon.variable} `
					// `{GeistSans.className} ${GeistSans.variable} ${GeistMono.variable}`
				}
			>
				<AuthSessionProvider>
					<AppContextProvider>
						<RecaptchaContextProvider>
							<ThemesProvider>
								<MainLayout>{children}</MainLayout>
								<Toaster />
							</ThemesProvider>
						</RecaptchaContextProvider>
					</AppContextProvider>
				</AuthSessionProvider>
				{/* {process.env.VERCEL_ENV === "production" && <Analytics />} */}
			</body>
		</html>
	);
};

export default RootLayout;
