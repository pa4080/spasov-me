"use client";
import React, { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import { Moon, Sun, SunMoon } from "lucide-react";

import messages from "@/messages/en.json";

import { cn } from "@/lib/cn-utils";

import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ThemeSwitch: React.FC = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={messages.Theme.themeSelector}
					className="btn_ui hover:text-backgrounds relative"
					name={messages.Theme.themeSelector}
					size="icon"
					variant="outline"
				>
					<Sun
						className={cn("h-[1.5rem] w-[1.5rem]", theme && theme === "light" ? "block" : "hidden")}
					/>
					<Moon
						className={cn("h-[1.5rem] w-[1.5rem]", theme && theme === "dark" ? "block" : "hidden")}
					/>
					<SunMoon
						className={cn(
							"h-[1.5rem] w-[1.5rem]",
							theme && theme === "system" ? "block" : "hidden"
						)}
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="p-4">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					{messages.Theme.light}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>{messages.Theme.dark}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					{messages.Theme.system}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ThemeSwitch;
