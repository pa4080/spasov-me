import React from "react";

import ThemeSwitch from "@/components/layouts/theme/ThemeSwitch";

import PublicMenu_Desktop from "./PublicMenu_Desktop";
import PublicMenu_Mobile from "./PublicMenu_Mobile";
import Search_Button from "./Search_Button";
import UserMenu from "./UserMenu";
import styles from "./_navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar} id="top-navbar">
      <PublicMenu_Desktop className="hidden mb:flex items-center justify-center gap-4 pb-0" />
      <PublicMenu_Mobile className="flex mb:hidden items-center justify-center gap-4 pb-0" />

      <div className="flex justify-end items-center gap-3 pt-1 -mr-1">
        <UserMenu />
        <Search_Button />
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
