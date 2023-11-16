"use client";
import React, { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import { Moon, Sun, SunMoon } from "lucide-react";

import { cn } from "@/lib/cn-utils";

import { msgs } from "@/messages";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
	classNameBtn?: string;
	strokeWidth?: number;
}

const ThemeSwitch: React.FC<Props> = ({ classNameBtn, strokeWidth }) => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const t = msgs("Theme");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={t("themeSelector")}
					className={cn(
						"hover:text-backgrounds relative group transition-colors duration-200",
						classNameBtn
					)}
					name={t("themeSelector")}
					size="icon"
					variant="outline"
				>
					<Sun
						className={cn(
							"h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200",
							theme && theme === "light" ? "block" : "hidden"
						)}
						strokeWidth={strokeWidth}
					/>
					<Sun
						className={cn(
							"h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200",
							theme && theme === "light-brown" ? "block" : "hidden"
						)}
						strokeWidth={strokeWidth}
					/>
					<Moon
						className={cn(
							"h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200",
							theme && theme === "dark" ? "block" : "hidden"
						)}
						strokeWidth={strokeWidth}
					/>
					<SunMoon
						className={cn(
							"h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200",
							theme && theme === "system" ? "block" : "hidden"
						)}
						strokeWidth={strokeWidth}
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="p-4">
				<DropdownMenuItem onClick={() => setTheme("light")}>{t("light")}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("light-brown")}>{t("ltBrown")}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>{t("dark")}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>{t("system")}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ThemeSwitch;
