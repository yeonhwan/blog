import type { Metadata } from "next";
import "./globals.css";
import { FiraCode, NbgKR } from "./fonts/fonts";

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
      <body className={`${FiraCode.variable} ${NbgKR.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
