"use client";

import { useTheme } from "next-themes";
import SunIcon from "@/assets/sun.svg";
import MoonIcon from "@/assets/moon.svg";

export default function ThemeSwitch() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  let currentTheme = theme === "system" ? resolvedTheme : theme;

  const handleThemeSwitch = (theme: string) => {
    setTheme(theme);
  };

  if (currentTheme === "dark")
    return (
      <SunIcon
        onClick={() => handleThemeSwitch("light")}
        className="w-mb-icon-size h-mb-icon-size stroke-neon-lime"
      />
    );
  else if (currentTheme === "light")
    return (
      <MoonIcon
        onClick={() => handleThemeSwitch("dark")}
        className="w-mb-icon-size h-mb-icon-size stroke-neon-indigo-100"
      />
    );
  else return null;
}
