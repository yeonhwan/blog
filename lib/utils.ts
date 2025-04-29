import * as __path from "path";
import { Dirent } from "fs";
import { fileURLToPath } from "url";

const getBaseName = (path: string) => {
  if (!path) throw new Error("Path is empty");
  const baseName = __path.basename(path);
  return baseName;
};

const isMarkdownFile = (dirent: Dirent) => {
  // if (!(dirent instanceof Dirent)) return false;
  const isFile = dirent.isFile();
  const isMarkdown = dirent.name.endsWith(".md");
  return isFile && isMarkdown;
};

// resolve any path entry based on project root
const resolvePathFromEntry = (entry: string | string[] | Dirent) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dir = __path.dirname(__filename);
  const root = __path.join(__dir, "..");

  if (!entry) throw new Error("Path is empty");
  if (entry instanceof Dirent) {
    // dirent has absolute path
    return __path.join(entry.parentPath, entry.name);
  } else if (Array.isArray(entry)) {
    return __path.resolve(root, ...entry);
  } else if (typeof entry === "string") {
    return __path.resolve(root, entry);
  } else {
    throw new Error("Unsupported entry type");
  }
};

const getContentPath = () => {
  if (typeof window !== "undefined")
    throw new Error("getContentPath can only be used in server context");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = __path.dirname(__filename);
  return resolvePathFromEntry([__dirname, "..", "contents", "posts"]);
};

export { resolvePathFromEntry, getContentPath, isMarkdownFile, getBaseName };
