import React from "react";

import { signOut } from "next-auth/react";

import messages from "@/messages/en.json";
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

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
}

const LoggedIn_Menu: React.FC<Props> = ({ className = "-mr-4" }) => (
	<NavigationMenu className={cn(styles.loggedInMenu, className)} viewportPosition="right-4">
		<NavigationMenuList>
			<NavigationMenuItem>
				<NavigationMenuTrigger
					chevronLeft
					aria-label={messages.NavBar.loggedInUserMenu}
					className="text-accent-secondary active:text-accent-secondary focus:text-accent-secondary focus-visible:text-accent-secondary"
				>
					<IconEmbedSvg type="sidebar-flip" />
				</NavigationMenuTrigger>

				<NavigationMenuContent className="w-56">
					<NavigationMenu_NextLink_Styled
						className={styles.userMenuItem}
						desc={messages.NavBar.filesDescription}
						href={Route.private.FILES}
						title={messages.NavBar.files}
					/>

					<NavigationMenu_NextLink_Styled
						className={styles.userMenuItem}
						desc={messages.NavBar.themeDescription}
						href={Route.private.THEME}
						title={messages.NavBar.theme}
					/>

					<NavigationMenu_NextLink_Styled
						className={styles.userMenuItem}
						desc={messages.NavBar.pagesEditDescription}
						href={Route.private.PAGES}
						title={messages.NavBar.pagesEdit}
					/>

					<NavigationMenu_NextLink_Styled
						className={styles.userMenuItem}
						desc={messages.NavBar.signOutDescription}
						href="#"
						title={messages.NavBar.signOut}
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

export default LoggedIn_Menu;
