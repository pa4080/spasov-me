"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { msgs } from "@/messages";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  classNameBtn?: string;
  strokeWidth?: number;
}

const ThemeSwitch: React.FC<Props> = ({ classNameBtn, strokeWidth }) => {
  const t = msgs("Theme");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t("themeSelector")}
          className={`hover:text-backgrounds relative group transition-colors duration-200 ${classNameBtn}`}
          name={t("themeSelector")}
          size="icon"
          variant="outline"
        >
          <Sun
            className={`h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200 ${
              theme && theme === "light" ? "block" : "hidden"
            }`}
            strokeWidth={strokeWidth}
          />
          <Sun
            className={`h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200 ${
              theme && theme === "light-brown" ? "block" : "hidden"
            }`}
            strokeWidth={strokeWidth}
          />
          <Moon
            className={`h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200 ${
              theme && theme === "dark" ? "block" : "hidden"
            }`}
            strokeWidth={strokeWidth}
          />
          <SunMoon
            className={`h-[1.5rem] w-[1.5rem] group-hover:text-background transition-colors duration-200 ${
              theme && theme === "system" ? "block" : "hidden"
            }`}
            strokeWidth={strokeWidth}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-4">
        <DropdownMenuItem onClick={() => setTheme("light")}>{t("light")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-brown")}>{t("ltBrown")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{t("dark")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{t("system")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitch;
