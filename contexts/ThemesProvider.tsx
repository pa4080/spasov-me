import { ThemeProvider } from "@wrksz/themes/next";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const themes = ["light", "dark", "system", "light-brown"];

const ThemesProvider: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      defaultTheme="dark"
      themes={themes}
      // forcedTheme="dark"
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemesProvider;
