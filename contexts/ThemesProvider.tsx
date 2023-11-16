"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

interface Props {
	children: React.ReactNode;
}

const themes = ["light", "dark", "system", "light-brown"];

const ThemesProvider: React.FC<Props> = ({ children }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<ThemeProvider
			disableTransitionOnChange
			attribute="class"
			defaultTheme="dark"
			themes={themes}
			// forcedTheme="dark"
		>
			{children}
		</ThemeProvider>
	);
};

export default ThemesProvider;
