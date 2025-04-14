import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { join } from "node:path";

export const getContentPath = (): string => {
  if (typeof window !== "undefined")
    throw new Error("getContentPath can only be used in server context");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const contentPath = join(__dirname, "..", "..", "contents", "posts");

  return contentPath;
};
