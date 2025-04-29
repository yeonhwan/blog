import { resolvePathFromEntry, getContentPath, isMarkdownFile } from "root/lib/utils";
import { IndexMap, PostData } from "root/types";
import { getPostPath } from "./builder";
import { readFromFile, readFromDir, readWithMatter } from "./io";

function getIndex(): IndexMap {
  const path = resolvePathFromEntry([getContentPath(), "index.json"]);
  const result = readFromFile(path, true);
  return result ? JSON.parse(result) : { tags: [], slugs: [] };
}

const getAllPostNames = (path: string): string[] => {
  const fileNames = readFromDir(path)
    .filter((dirent) => isMarkdownFile(dirent))
    .map((dirent) => dirent.name);
  return fileNames;
};

const getPost = (fileName: string): PostData => {
  const path = getPostPath(getContentPath(), fileName);
  const post = readWithMatter(path);
  return { post, fileName };
};

const getAllPosts = () => {
  const path = getContentPath();
  const postNames = getAllPostNames(path);
  return postNames.map((name) => getPost(name));
};

export { getIndex, getPost, getAllPosts };
