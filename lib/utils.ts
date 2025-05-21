import { Dirent } from "fs";

const isMarkdownFile = (dirent: Dirent) => {
  const isFile = dirent.isFile();
  const isMarkdown = dirent.name.endsWith(".md");
  return isFile && isMarkdown;
};

export { isMarkdownFile };
