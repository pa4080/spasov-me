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
				"body-content overflow-x-hidden overflow-y-auto sm:overflow-y-hidden sm:flex sm:flex-col sm:h-[100vh]",
				className
			)}
			id="content"
		>
			<Navbar />
			<main className="flex-1 flex-grow overflow-x-hidden overflow-y-auto w-full px-6 xa:px-8 min-h-content">
				<span className="w-0 h-0 opacity-0" id="scroll-to-top" />
				<div className="max-w-4xl mx-auto">{children}</div>
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
