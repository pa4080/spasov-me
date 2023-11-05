import { NextIntlClientProvider, useLocale, createTranslator } from "next-intl";
import { notFound } from "next/navigation";

import { inter, roboto_slab, unicephalon, multivacGhost, multivacInterference } from "@/app/fonts";

import manifest from "@/public/manifest.json";
import { AppContextProvider } from "@/contexts/AppContext";
import AuthSessionProvider from "@/contexts/AuthSessionProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

import type { Viewport } from "next";

interface GenerateMetadata {
	params: {
		locale: string;
	};
}

export async function generateMetadata({ params: { locale } }: GenerateMetadata) {
	const messages = (await import(`@/messages/${locale}.json`)).default;
	const t = createTranslator({ locale, messages });

	return {
		title: `${t("Site.title")}`,
		description: t("Site.description"),
		manifest: "/manifest.json",
		robots: "index,follow",
		keywords: manifest.keywords,
		publisher: manifest.author,
		creator: manifest.author,
		icons: "/favicon.svg",
	};
}

export const viewport: Viewport = {
	themeColor: [
		{ color: manifest.theme_color, media: "(prefers-color-scheme: light)" },
		{ color: manifest.theme_color_dark, media: "(prefers-color-scheme: dark)" },
	],
	colorScheme: "light dark",
};

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

const LocaleLayout: React.FC<LocaleLayoutProps> = async ({ children, params }) => {
	// note the "locale" value is also available by "params.locale"
	const locale = useLocale();

	// Show a 404 error if the user requests an unknown locale
	if (params.locale !== locale) {
		notFound();
	}

	let messages;

	try {
		messages = (await import(`@/messages/${locale}.json`)).default;
	} catch (error) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body
				className={
					`${inter.className} ${inter.variable} ` +
					`${roboto_slab.variable} ${unicephalon.variable} ` +
					`${multivacGhost.variable} ${multivacInterference.variable}`
				}
			>
				<AuthSessionProvider>
					<div className="app app_flex_container">
						<NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Sofia">
							<AppContextProvider>
								<NavBar />
								<main className="content_container">
									<div className="content_wrapper">{children}</div>
								</main>
								<Footer />
								<Toaster />
							</AppContextProvider>
						</NextIntlClientProvider>
					</div>
				</AuthSessionProvider>
			</body>
		</html>
	);
};

export default LocaleLayout;
