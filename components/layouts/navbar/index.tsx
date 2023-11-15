import React from "react";

import { Route } from "@/routes";

import ThemeSwitch from "@/components/theme/ThemeSwitch";

import styles from "./_navbar.module.scss";
import PublicMenu_Row from "./PublicMenu_Row";
import PublicMenu_Sheet from "./PublicMenu_Sheet";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
	const menuItems: string[] = Object.keys(Route.public);

	return (
		<nav className={styles.navbar}>
			<PublicMenu_Row className="hidden sm:flex" menuItems={menuItems} />
			<PublicMenu_Sheet className="flex sm:hidden" menuItems={menuItems} />

			<div className="flex justify-end items-center gap-3 pt-1 -mr-1">
				<UserMenu />
				<ThemeSwitch classNameBtn="scale-75 bg-primary" />
			</div>
		</nav>
	);
};

export default Navbar;
