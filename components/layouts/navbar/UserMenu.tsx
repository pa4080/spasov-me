"use client";

import React from "react";

import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";

import LogIn_Button from "./UserMenu_LogIn_Button";
import LoggedIn_Menu from "./UserMenu_LoggedIn_Menu";

interface Props {
  className?: string;
  appVersion?: React.ReactNode;
}

const UserMenu: React.FC<Props> = ({ className, appVersion }) => {
  const { authProviders, session } = useAppContext();

  return (
    <div className={cn("items-center justify-center gap-4 flex", className)}>
      {session?.user ? (
        <LoggedIn_Menu appVersion={appVersion} />
      ) : (
        <LogIn_Button authProviders={authProviders} />
      )}
    </div>
  );
};

export default UserMenu;
