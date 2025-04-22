import type { Metadata } from "next";
import "./globals.css";
import "./markdown.css";
import { FiraCode, NbgKR } from "./fonts/fonts";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "YH_Blog",
  description: "YH_Blog :: Yeonhwan's Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${FiraCode.variable} ${NbgKR.variable} antialiased bg-clean-white dark:bg-dark-ash text-deep-gray dark:text-text-white tablet:mx-[12.5%] laptop:mx-[20%] desktop:mx-[25%]`}
      >
        <ThemeProvider>
          <Header />

          <div className="flex flex-col mx-mb-x-gutter">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
