import localFont from "next/font/local";

// Fira Code Variable
export const FiraCode = localFont({
  preload: true,
  src: "./FiraCode.woff2",
  variable: "--font-fira",
});

// 나눔 바른 고딕
export const NbgKR = localFont({
  preload: true,
  src: [
    {
      path: "./NBG_bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./NBG_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./NBG_light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-nbg",
});
