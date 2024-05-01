import React from "react";

import ThemeSwitch from "@/components/layouts/theme/ThemeSwitch";

import PublicMenu_Desktop from "./PublicMenu_Desktop";
import PublicMenu_Mobile from "./PublicMenu_Mobile";
import UserMenu from "./UserMenu";
import styles from "./_navbar.module.scss";

const Navbar: React.FC = () => {
	return (
		<nav className={styles.navbar}>
			<PublicMenu_Desktop className="hidden sm:flex" />
			<PublicMenu_Mobile className="flex sm:hidden" />

			<div className="flex justify-end items-center gap-3 pt-1 -mr-1">
				<UserMenu />
				<ThemeSwitch classNameBtn="scale-75 bg-primary text-foreground-secondary" strokeWidth={2} />
			</div>
		</nav>
	);
};

export default Navbar;
