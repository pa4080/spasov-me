import React from "react";

import { cn } from "@/lib/cn-utils";

import styles from "./_main-layout.module.scss";

interface Props {
	children: React.ReactNode;
	className?: string;
}

const MainLayout: React.FC<Props> = ({ children, className }) => {
	return (
		<div className={cn(styles.mainLayout, styles.mainLayoutFlexContainer, className)}>
			{children}
		</div>
	);
};

export default MainLayout;
