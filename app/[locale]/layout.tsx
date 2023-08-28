import { NextIntlClientProvider, useLocale, createTranslator } from "next-intl";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth-options";

import { AppContextProvider } from "@/contexts/AppContext";

import AuthSessionProvider from "@/contexts/AuthSessionProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

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
	};
}

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

const LocaleLayout: React.FC<LocaleLayoutProps> = async ({ children, params }) => {
	const locale = useLocale();

	// const session = await getServerSession(authOptions);
	// console.log(session);

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
			<body className={inter.className}>
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
