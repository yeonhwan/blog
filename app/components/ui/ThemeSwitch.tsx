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

  return (
    <div>
      <SunIcon
        onClick={() => handleThemeSwitch("light")}
        className="w-mb-icon-size h-mb-icon-size stroke-neon-lime dark:block hidden"
      />

      <MoonIcon
        onClick={() => handleThemeSwitch("dark")}
        className="w-mb-icon-size h-mb-icon-size block dark:hidden stroke-neon-blue-300"
      />
    </div>
  );
}
