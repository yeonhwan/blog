import localFont from "next/font/local";

export const IBMMono = localFont({
  preload: true,
  display: "swap",
  src: [
    {
      path: "./assets/fonts/mono/mono_bol.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/mono/mono_sembol.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./assets/fonts/mono/mono.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/mono/mono_light.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--ibm-mono",
});

export const IBMSans = localFont({
  preload: true,
  display: "swap",
  src: [
    {
      path: "./assets/fonts/sans/sans_bol.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/sans/sans_sembol.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./assets/fonts/sans/sans.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/sans/sans_light.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--ibm-sans",
});
