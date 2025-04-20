import type { Metadata } from "next";
import "./globals.css";
import "./markdown.css";
import { FiraCode, NbgKR } from "./fonts/fonts";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Yeonhwan's Blog",
  description: "Yeonhwan's Blog --",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${FiraCode.variable} ${NbgKR.variable} antialiased bg-dark-ash text-text-white mb-mb-y-gutter`}
      >
        <Header />

        <div className="flex flex-col mx-mb-x-gutter">{children}</div>
      </body>
    </html>
  );
}
