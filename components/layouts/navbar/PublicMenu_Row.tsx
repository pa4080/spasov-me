"use client";

import React from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";

import SiteLogo from "@/components/layouts/logo/SiteLogo";

import { msgs } from "@/messages";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
}

const PublicMenu_Row: React.FC<Props> = ({ className }) => {
	const t = msgs("Navigation");

	type tType = Parameters<typeof t>[0];

	const currentPathName = usePathname();
	const menuItems: string[] = Object.keys(Route.public);

	return (
		<div className={`${styles.publicMenu} ${className}`}>
			<Link
				as={Route.public.HOME.uri}
				className={`${styles.navItemCommon} emphasize_drop_shadow`}
				// This is a workaround for a Next.js bug, where
				// the home page is not rerendered after 404 error
				// which is rendered on the the same URI.
				href={Route.public.HOME.uri}
				style={{}}
			>
				<SiteLogo
					autoBreak={false}
					className={currentPathName === Route.public.HOME.uri ? "hover:saturate-200" : ""}
					hover={currentPathName !== Route.public.HOME.uri}
					style={{ width: "152px", height: "auto" }}
				/>
			</Link>

			{menuItems.map((path, index) => {
				const pathAsKey = path as keyof typeof Route.public;

				if (
					Route.public[pathAsKey].uri !== Route.public.HOME.uri &&
					Route.public[pathAsKey].visible
				) {
					return (
						<Link
							key={index}
							className={cn(
								styles.navItemRow,
								styles.navItemCommon,
								"emphasize_drop_shadow",
								`${
									currentPathName !== Route.public[pathAsKey].uri
										? "text-foreground-primary"
										: "text-accent"
								}`
							)}
							href={Route.public[pathAsKey].uri}
						>
							{t(path as tType)}
						</Link>
					);
				}
			})}
		</div>
	);
};

export default PublicMenu_Row;
