import React from "react";

import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";

import { cn } from "@/lib/cn-utils";

interface Props {
	children: React.ReactNode;
	className?: string;
}

const MainLayout: React.FC<Props> = ({ children, className }) => {
	return (
		<div
			className={cn(
				"body-content min-h-screen",
				// "body-content overflow-x-hidden overflow-y-auto",
				"3xl:overflow-y-hidden 3xl:flex 3xl:flex-col 3xl:h-[100vh]",
				className
			)}
			id="content"
		>
			<header className="w-full sticky top-0 z-[15]">
				<Navbar />
			</header>
			<main className="flex-1 flex-grow overflow-x-hidden overflow-y-auto w-full px-6 xa:px-8 min-h-content">
				<span className="w-0 h-0 opacity-0 scroll-mt-40" id="scroll-to-top" />
				<div className="max-w-4xl mx-auto">{children}</div>
			</main>
			<footer className="w-full sticky bottom-0 z-[15] transition-transform duration-300 ease-in-out">
				<Footer />
			</footer>
		</div>
	);
};

export default MainLayout;
