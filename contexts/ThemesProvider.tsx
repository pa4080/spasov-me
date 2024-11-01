"use client";

import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const themes = ["light", "dark", "system", "light-brown"];

const ThemesProvider: React.FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <ThemeProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme="dark"
        themes={themes}
        // forcedTheme="dark"
      >
        {children}
      </ThemeProvider>
    )
  );
};

export default ThemesProvider;
