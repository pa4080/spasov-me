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
		<div className={cn(styles.publicMenuWrapper, className)}>
			<Sheet>
				<SheetTrigger
					className={cn(
						styles.navItemCommon,
						"emphasize_drop_shadow",
						"text-mlt-gray-3 outline-none focus-visible:outline-none focus:outline-none"
					)}
				>
					{/* <SiteLogo manualBreak style={{ width: "120px", height: "auto" }} /> */}
					<SiteLogo
						autoBreak={false}
						hover={currentPathName !== Route.public.HOME}
						style={{ width: "152px", height: "auto" }}
					/>
				</SheetTrigger>

				<SheetContent className="flex flex-col items-start justify-start gap-10 h-full" side="left">
					<SheetHeader>
						<SheetClose>
							{/* <SiteLogo manualBreak style={{ width: "120px", height: "auto" }} /> */}
							<SiteLogo
								autoBreak={false}
								hover={currentPathName !== Route.public.HOME}
								style={{ width: "152px", height: "auto" }}
							/>
						</SheetClose>
					</SheetHeader>

					<div className="flex flex-col gap-6">
						{menuItems.map((path, index) => (
							<Link
								key={index}
								className={cn(
									styles.navItemCommon,
									styles.navItemSideMenu,
									"emphasize_drop_shadow",
									currentPathName === Route.public[path as keyof typeof Route.public]
										? "text-accent"
										: "text-foreground"
								)}
								href={Route.public[path as keyof typeof Route.public]}
								tabIndex={-1}
							>
								<SheetClose className="border-x-8 border-y-2 border-transparent tracking-wide">
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
