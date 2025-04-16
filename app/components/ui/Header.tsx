"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/base/Drawer";
import LinkText from "../base/LinkText";
import TerminalIcon from "@/assets/terminal.svg";
import SwitchIcon from "@/assets/switch_sun.svg";
import HamburgerIcon from "@/assets/hamburger.svg";
import { useState } from "react";
import { useAutoBlur } from "@/hooks/useAutoBlur";
import { usePathname } from "next/navigation";

const ROUTE_LIST = ["posts", "about", "snippets"];

export default function Header() {
  const [isNavOpen, setNavOpen] = useState(false);
  const triggerRef = useAutoBlur<HTMLButtonElement>(isNavOpen);
  const pathname = usePathname().split("/")[1];

  return (
    <header
      inert={isNavOpen ? true : undefined}
      tabIndex={isNavOpen ? -1 : undefined}
      className="w-full h-mb-header-height flex justify-between sticky top-0 items-center bg-dark-ash"
    >
      <div className="flex items-center gap-2">
        <p className="text-mb-h2 text-neon-green-100 font-fira font-bold">
          Yeonhwan
        </p>
        <TerminalIcon className="w-mb-icon-size h-mb-icon-size fill-neon-green-100" />
      </div>
      <div className="flex w-fit gap-5">
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
