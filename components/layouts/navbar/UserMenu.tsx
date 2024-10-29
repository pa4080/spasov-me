"use client";

import React from "react";

import { useAppContext } from "@/contexts/AppContext";
import { useClearHyphens } from "@/hooks/useClearHyphens";
import { useCodeCopyButton } from "@/hooks/useCodeCopyButton";
import { useScrollToAboutEntry } from "@/hooks/useScrollToEntry";

import LogIn_Button from "./UserMenu_LogIn_Button";
import LoggedIn_Menu from "./UserMenu_LoggedIn_Menu";
import styles from "./_navbar.module.css";

interface Props {
  className?: string;
}

const UserMenu: React.FC<Props> = ({ className }) => {
  const { authProviders, session } = useAppContext();

  useClearHyphens();
  useCodeCopyButton();
  useScrollToAboutEntry();

  return (
    <div className={`${styles.userMenu} ${className}`}>
      {session?.user ? <LoggedIn_Menu /> : <LogIn_Button authProviders={authProviders} />}
    </div>
  );
};

export default UserMenu;
