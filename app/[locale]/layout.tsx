import { NextIntlClientProvider, useLocale, createTranslator } from "next-intl";
import { notFound } from "next/navigation";
import { Roboto_Slab, Inter } from "next/font/google";

import manifest from "@/public/manifest.json";
import { AppContextProvider } from "@/contexts/AppContext";
import AuthSessionProvider from "@/contexts/AuthSessionProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

// From this order here depends the priority of the font,
// the last one have the highest priority.
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
// The order here doesn't matter for the priority of the font.
const fontClassNames = [inter.className, robotoSlab.className];

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
		viewport: "width=device-width, initial-scale=1",
		robots: "index,follow",
		keywords: manifest.keywords,
		themeColor: manifest.theme_color,
		publisher: manifest.author,
		creator: manifest.author,
		colorScheme: "dark",
	};
}

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
			<body className={`${fontClassNames.join(" ")}`}>
				<AuthSessionProvider>
					<div className="app app_flex_container">
						<NextIntlClientProvider locale={locale} messages={messages}>
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
