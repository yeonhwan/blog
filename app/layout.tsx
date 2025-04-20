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
        className={`${FiraCode.variable} ${NbgKR.variable} antialiased bg-dark-ash text-text-white mx-mb-x-gutter my-mb-y-gutter`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
