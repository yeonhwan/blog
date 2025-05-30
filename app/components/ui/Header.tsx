"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/base/Drawer";
import LinkText from "../base/LinkText";
import TerminalIcon from "@/assets/terminal.svg";
import HamburgerIcon from "@/assets/hamburger.svg";
import { useState } from "react";
import { useAutoBlur } from "@/hooks/useAutoBlur";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";

const ROUTE_LIST = ["posts", "about"];

export default function Header() {
  const [isNavOpen, setNavOpen] = useState(false);
  const triggerRef = useAutoBlur<HTMLButtonElement>(isNavOpen);
  let pathname = usePathname().split("/")[1];
  if (pathname === "") pathname = "posts";

  return (
    <header
      inert={isNavOpen ? true : undefined}
      tabIndex={isNavOpen ? -1 : undefined}
      className="w-full h-mb-header-height tablet:h-tb-header-height flex justify-between sticky top-0 items-center bg-clean-white dark:bg-dark-ash py-mb-y-gutter z-50 px-mb-x-gutter transition-colors duration-75"
    >
      <Link href="/" className="flex items-center gap-1">
        <p className="text-mb-h2 laptop:text-dt-h1 text-neon-blue-100 dark:text-neon-green-100 font-mono font-bold">
          YH
        </p>
        <TerminalIcon className="w-mb-icon-size h-mb-icon-size laptop:w-dt-icon-size laptop:h-dt-icon-size fill-neon-blue-100 dark:fill-neon-green-100 scale-80" />
      </Link>

      {/* >=tablet navbar */}
      <nav className="hidden w-fit gap-5 tablet:flex justify-between items-center">
        <ThemeSwitch />
        {ROUTE_LIST.map((route) => (
          <LinkText
            className="font-medium"
            onClick={() => setNavOpen(false)}
            key={route}
            isCurrent={route === pathname}
            title={route}
          />
        ))}
      </nav>

      {/* mobile navbar */}
      <aside className="flex w-fit gap-5 tablet:hidden">
        <ThemeSwitch />
        <Drawer open={isNavOpen} onOpenChange={setNavOpen} direction="right">
          <DrawerTrigger ref={triggerRef}>
            <HamburgerIcon className="w-mb-icon-size h-mb-icon-size fill-deep-gray dark:fill-text-gray hover:cursor-pointer" />
          </DrawerTrigger>
          <DrawerContent className="w-screen bg-clean-white dark:bg-dark-black border-none flex flex-col justify-center">
            <div className="hidden">
              <DrawerTitle>Navigation Bar</DrawerTitle>
            </div>
            <div className="flex flex-col w-full h-fit gap-4 ml-10">
              {ROUTE_LIST.map((route) => (
                <LinkText
                  className="text-dt-h2"
                  onClick={() => setNavOpen(false)}
                  key={route}
                  isCurrent={route === pathname}
                  title={route}
                />
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </aside>
    </header>
  );
}
