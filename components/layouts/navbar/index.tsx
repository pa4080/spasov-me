import React from "react";

import ThemeSwitch from "@/components/layouts/theme/ThemeSwitch";

import styles from "./_navbar.module.scss";
import PublicMenu_Row from "./PublicMenu_Row";
import PublicMenu_Sheet from "./PublicMenu_Sheet";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
	return (
		<nav className={styles.navbar}>
			<PublicMenu_Row className="hidden sm:flex" />
			<PublicMenu_Sheet className="flex sm:hidden" />

			<div className="flex justify-end items-center gap-3 pt-1 -mr-1">
				<UserMenu />
				<ThemeSwitch classNameBtn="scale-75 bg-primary text-foreground-secondary" strokeWidth={3} />
			</div>
		</nav>
	);
};

export default Navbar;
