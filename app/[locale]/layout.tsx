import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Inter } from "next/font/google";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth-options";

import { AppContextProvider } from "@/contexts/AppContext";

import AuthSessionProvider from "@/contexts/AuthSessionProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
	const t = await getTranslations();

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
								<main className="flex-1 flex-grow overflow-x-hidden overflow-y-auto">
									{children}
								</main>
								<Footer />
							</AppContextProvider>
						</NextIntlClientProvider>
					</div>
				</AuthSessionProvider>
			</body>
		</html>
	);
};

export default LocaleLayout;
