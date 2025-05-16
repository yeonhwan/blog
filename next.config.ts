import type { NextConfig } from "next";
import { Compiler } from "webpack";
import { getContentPath } from "./lib/utils";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["next-mdx-remote"],
  eslint: { ignoreDuringBuilds: true },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config, { dev }) {
    //@ts-expect-error: type defs does not exist
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));
    fileLoaderRule.exclude = /\.svg$/i;

    //svgr config
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // if runs on dev:watch, HMR for posts directory after first bundle / after refresh
    if (dev) {
      config.plugins.push({
        apply: (compiler: Compiler) => {
          compiler.hooks.afterCompile.tap("WatchPostContents", (compilation) => {
            const postsDir = getContentPath();
            compilation.contextDependencies.add(postsDir);
          });
        },
      });
    }

    return config;
  },
};

export default nextConfig;
