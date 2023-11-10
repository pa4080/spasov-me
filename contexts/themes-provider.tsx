"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

interface Props {
  children: React.ReactNode;
}

const ThemesProvider: React.FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      // forcedTheme="dark"
      defaultTheme="dark"
      themes={["light", "dark", "system"]}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemesProvider;
