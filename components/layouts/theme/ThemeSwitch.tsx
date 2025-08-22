"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { msgs } from "@/messages";

const ThemeSwitch: React.FC = () => {
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
          className="h-8 w-9 -ml-1 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:bg-accent-secondary/20 bg-accent-secondary/20 hover:brightness-110 active:brightness-75 transition-all duration-300"
          name={t("themeSelector")}
          size="icon"
          variant="ghost"
        >
          <IconEmbedSvg
            className={`${theme && (theme === "light" || theme === "light-brown") ? "block" : "hidden"}`}
            type="sun"
          />
          <IconEmbedSvg
            className={`${theme && theme === "dark" ? "block" : "hidden"}`}
            type="moon"
          />
          <IconEmbedSvg
            className={`${theme && theme === "system" ? "block" : "hidden"}`}
            type="moon-over-sun"
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
