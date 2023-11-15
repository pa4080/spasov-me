"use client";

import React from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";
import messages from "@/messages/en.json";

import SiteLogo from "@/components/logo/SiteLogo";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
	menuItems: string[];
}

const PublicMenu_Sheet: React.FC<Props> = ({ className, menuItems }) => {
	const currentPathName = usePathname();

	return (
		<div className={cn(styles.publicMenu, className)}>
			<Sheet>
				<SheetTrigger
					aria-label={messages.NavBar.altMenuButton}
					className={cn(
						styles.navItemCommon,
						"outline-none focus-visible:outline-none focus:outline-none"
					)}
				>
					<SiteLogo
						autoBreak={false}
						className="emphasize_drop_shadow"
						style={{ width: "152px", height: "auto" }}
					/>
				</SheetTrigger>

				<SheetContent className="flex flex-col items-start justify-start gap-10 h-full" side="left">
					<SheetHeader>
						<SheetClose>
							<SiteLogo
								autoBreak={false}
								className="emphasize_drop_shadow"
								style={{ width: "152px", height: "auto" }}
							/>
						</SheetClose>
					</SheetHeader>

					<div className="flex flex-col gap-8 pl-2">
						{menuItems.map((path, index) => (
							<Link
								key={index}
								className={cn(
									"emphasize_drop_shadow",
									currentPathName === Route.public[path as keyof typeof Route.public]
										? "text-accent"
										: "text-foreground"
								)}
								href={Route.public[path as keyof typeof Route.public]}
								tabIndex={-1}
							>
								<SheetClose
									className={cn(
										// The SheetClose overrides the CSS from the module so we can't use a specific class here
										"font-unicephalon !tracking-widest text-[18px] hover:text-ring active:text-ring-secondary hover:transition-colors"
									)}
								>
									{messages.NavBar[path as keyof typeof messages.NavBar]}
								</SheetClose>
							</Link>
						))}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default PublicMenu_Sheet;
