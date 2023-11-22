import React from "react";

import { signOut } from "next-auth/react";

import { cn } from "@/lib/cn-utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenu_NextLink_Styled,
} from "@/components/ui/navigation-menu";
import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { Route } from "@/routes";

import { msgs } from "@/messages";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
}

const LoggedIn_Menu: React.FC<Props> = ({ className = "-mr-4" }) => {
	const t = msgs("Navigation");

	type tType = Parameters<typeof t>[0];

	return (
		<NavigationMenu className={cn(styles.loggedInMenu, className)} viewportPosition="-right-4">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger
						chevronLeft
						aria-label={t("loggedInUserMenu")}
						className="text-accent-secondary active:text-accent-secondary focus:text-accent-secondary focus-visible:text-accent-secondary"
					>
						<IconEmbedSvg type="sidebar-flip" />
					</NavigationMenuTrigger>

					<NavigationMenuContent className="w-56">
						{Object.keys(Route.admin).map((key) => (
							<NavigationMenu_NextLink_Styled
								key={key}
								className={styles.userMenuItem}
								desc={t(`${key}_DESC` as tType)}
								href={Route.admin[key as keyof typeof Route.admin]}
								title={t(key as tType)}
							/>
						))}

						<div className="w-full h-0.5 bg-primary my-1" />

						<NavigationMenu_NextLink_Styled
							className={styles.userMenuItem}
							desc={t("signOutDescription")}
							href="#"
							title={t("signOut")}
							onClick={(e) => {
								e.preventDefault();
								signOut();
							}}
						/>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default LoggedIn_Menu;
