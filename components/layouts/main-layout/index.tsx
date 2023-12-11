import React from "react";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer/Footer";

import { cn } from "@/lib/cn-utils";

import styles from "./_main-layout.module.scss";

interface Props {
	children: React.ReactNode;
	className?: string;
}

const MainLayout: React.FC<Props> = ({ children, className }) => {
	return (
		<div className={cn(styles.mainLayout, className)}>
			<Navbar />
			<main className={styles.contentContainer}>
				<div className={styles.contentWrapper}>
					{/* <div id="main-content" /> */}
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
