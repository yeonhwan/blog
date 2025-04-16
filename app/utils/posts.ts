import { Dirent } from "node:fs";
import type { PostData, PostMeta } from "@/types/posts";
import matter, { GrayMatterOption } from "gray-matter";

const POST_PER_PAGE = 5;

export const isPostFile = (dirent: Dirent) => {
  return (
    dirent.isFile() &&
    dirent.name.endsWith(".md") &&
    dirent.name !== "slug.json"
  );
};

export const getPostsPerPage = (page: number, posts: Dirent[]) => {
  const start = (page - 1) * POST_PER_PAGE;
  const end = start + POST_PER_PAGE;
  return posts.slice(start, end);
};

type ParsingOption = Parameters<typeof matter.read>["1"] | undefined;

export const parsePostContent = (
  direntOrPath: Dirent | string,
  opts?: ParsingOption,
): PostData => {
  let filePath = "";
  if (direntOrPath instanceof Dirent) {
    filePath = `${direntOrPath.parentPath}/${direntOrPath.name}`;
  } else {
    filePath = direntOrPath;
  }
  const data: unknown = matter.read(filePath, opts);
  return data as PostData;
};
