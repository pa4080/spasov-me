"use client";

import React from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";
import messages from "@/messages/en.json";

import SiteLogo from "@/components/logo/SiteLogo";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
	menuItems: string[];
}

const PublicMenu_Row: React.FC<Props> = ({ className, menuItems }) => {
	const currentPathName = usePathname();

	return (
		<div className={cn(styles.publicMenuWrapper, className)}>
			{menuItems.map((path, index) => {
				const pathAsKey = path as keyof typeof Route.public;

				if (Route.public[pathAsKey] === Route.public.HOME) {
					return (
						<Link
							key={index}
							as={Route.public.HOME}
							className={cn(styles.navItemCommon, "emphasize_drop_shadow", "text-mlt-gray-3")}
							href={"/" + messages.NavBar.HOME.toLocaleLowerCase()}
							style={{}}
						>
							<SiteLogo
								autoBreak={false}
								hover={currentPathName !== Route.public.HOME}
								style={{ width: "152px", height: "auto" }}
							/>
						</Link>
					);
				} else {
					return (
						<Link
							key={index}
							className={cn(
								styles.navItem,
								styles.navItemCommon,
								"emphasize_drop_shadow",
								`tracking-menu-items tracking-widest ${
									currentPathName !== Route.public[pathAsKey]
										? "text-mlt-gray-3"
										: "text-mlt-blue-bright"
								}`
							)}
							href={Route.public[pathAsKey]}
						>
							{messages.NavBar[path as keyof typeof messages.NavBar]}
						</Link>
					);
				}
			})}
		</div>
	);
};

export default PublicMenu_Row;
