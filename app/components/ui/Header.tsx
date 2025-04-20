"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/base/Drawer";
import LinkText from "../base/LinkText";
import TerminalIcon from "@/assets/terminal.svg";
import SwitchIcon from "@/assets/switch_sun.svg";
import HamburgerIcon from "@/assets/hamburger.svg";
import { useState } from "react";
import { useAutoBlur } from "@/hooks/useAutoBlur";
import { usePathname } from "next/navigation";
import Link from "next/link";

const ROUTE_LIST = ["posts", "about", "snippets"];

export default function Header() {
  const [isNavOpen, setNavOpen] = useState(false);
  const triggerRef = useAutoBlur<HTMLButtonElement>(isNavOpen);
  const pathname = usePathname().split("/")[1];

  return (
    <header
      inert={isNavOpen ? true : undefined}
      tabIndex={isNavOpen ? -1 : undefined}
      className="w-full h-mb-header-height tablet:h-tb-header-height flex justify-between sticky top-0 items-center bg-dark-ash py-mb-y-gutter z-50 px-mb-x-gutter"
    >
      <Link href="/posts" className="flex items-center gap-1">
        <p className="text-mb-h2 laptop:text-dt-h1 text-neon-green-100 font-fira font-bold">YH</p>
        <TerminalIcon className="w-mb-icon-size h-mb-icon-size laptop:w-dt-icon-size laptop:h-dt-icon-size fill-neon-green-100 scale-80" />
      </Link>

      {/* >=tablet navbar */}
      <div className="hidden w-fit gap-5 tablet:flex justify-between items-center">
        <SwitchIcon className="w-mb-icon-size h-mb-icon-size fill-neon-lime" />
        {ROUTE_LIST.map((route) => (
          <LinkText
            className="font-medium"
            onClick={() => setNavOpen(false)}
            key={route}
            isCurrent={route === pathname}
            title={route}
          />
        ))}
      </div>

      {/* mobile navbar */}
      <div className="flex w-fit gap-5 tablet:hidden">
        <SwitchIcon className="w-mb-icon-size h-mb-icon-size fill-neon-lime" />
        <Drawer open={isNavOpen} onOpenChange={setNavOpen} direction="right">
          <DrawerTrigger ref={triggerRef}>
            <HamburgerIcon className="w-mb-icon-size h-mb-icon-size fill-text-gray" />
          </DrawerTrigger>
          <DrawerContent className="w-screen bg-dark-black border-none flex flex-col justify-center">
            <div className="hidden">
              <DrawerTitle>Navigation Bar</DrawerTitle>
            </div>
            <div className="flex flex-col w-full h-fit gap-4 ml-10">
              {ROUTE_LIST.map((route) => (
                <LinkText
                  onClick={() => setNavOpen(false)}
                  key={route}
                  isCurrent={route === pathname}
                  title={route}
                />
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
