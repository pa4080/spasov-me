"use client";

import React from "react";

import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";

import LogIn_Button from "./UserMenu_LogIn_Button";
import LoggedIn_Menu from "./UserMenu_LoggedIn_Menu";

interface Props {
  className?: string;
}

const UserMenu: React.FC<Props> = ({ className }) => {
  const { authProviders, session } = useAppContext();

  return (
    <div className={cn("items-center justify-center gap-4 flex", className)}>
      {session?.user ? <LoggedIn_Menu /> : <LogIn_Button authProviders={authProviders} />}
    </div>
  );
};

export default UserMenu;
