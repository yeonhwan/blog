import { Post } from "root/types";
import fs, { Dirent } from "fs";
import matter from "gray-matter";
import { resolvePathFromEntry } from "root/lib/utils";

type Entry = string | string[] | Dirent;

const readFromDir = (path: string) => {
  if (!path) throw new Error("Path is empty");
  const dir = resolvePathFromEntry(path);
  return fs.readdirSync(dir, { withFileTypes: true, recursive: true });
};

function readFromFile(entry: Entry, supressError: boolean = false) {
  if (!entry) throw new Error("Path is empty");
  const path = resolvePathFromEntry(entry);
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, "utf-8").toString();
  } else {
    if (!supressError) throw new Error(`File not found: ${path}`);
    return null;
  }
}

const writeOrCreateFile = (entry: Entry, data: string, append: boolean = false) => {
  if (!entry) throw new Error("Path is empty");
  const path = resolvePathFromEntry(entry);
  const file = readFromFile(path, true);
  if (file !== null) {
    fs.writeFileSync(path, data, { encoding: "utf-8", flag: append ? "a" : "w" });
  } else {
    fs.writeFileSync(path, data, { encoding: "utf-8" });
  }
};

const deleteFile = (entry: Entry) => {
  if (!entry) throw new Error("Path is empty");
  const path = resolvePathFromEntry(entry);
  const file = readFromFile(path);
  if (!file) throw new Error("File not found");
  else fs.unlinkSync(path);
};

type ParsingOption = Parameters<typeof matter.read>["1"] | undefined;
const readWithMatter = (entry: Dirent | string, opts?: ParsingOption) => {
  const path = resolvePathFromEntry(entry);
  const data = matter.read(path, opts);
  return data as Post;
};

export { readFromDir, readFromFile, writeOrCreateFile, deleteFile, readWithMatter };
