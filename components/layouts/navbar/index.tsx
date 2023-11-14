import React from "react";

import { Route } from "@/routes";

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

			<UserMenu />
		</nav>
	);
};

export default Navbar;
