import { Dirent } from "node:fs";
import type { PostData } from "root/types";
import matter from "gray-matter";

const POST_PER_PAGE = 5;

export const isPostFile = (dirent: Dirent) => {
  return dirent.isFile() && dirent.name.endsWith(".md") && dirent.name !== "slug.json";
};

export const sliceDataPerPage = <T>(page: number, data: T[]): { data: T[]; total: number } => {
  const start = (page - 1) * POST_PER_PAGE;
  const end = start + POST_PER_PAGE;
  const total = Math.ceil(data.length / POST_PER_PAGE);
  if (page < 0 || page > total) throw new Error("Page out of range");
  return {
    total,
    data: data.slice(start, end),
  };
};

export const filterPostsByPublish = (posts: PostData[]) => {
  return posts.filter((post) => post.data.publish === true);
};

export const filterPostsByTag = (posts: PostData[], tag: string) => {
  return posts.filter((post) => post.data.tags.includes(tag));
};

export const sortPostsByDate = (posts: PostData[]): PostData[] => {
  return posts.toSorted((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
};

type ParsingOption = Parameters<typeof matter.read>["1"] | undefined;

export const parsePostContent = (direntOrPath: Dirent | string, opts?: ParsingOption): PostData => {
  let filePath = "";
  if (direntOrPath instanceof Dirent) {
    filePath = `${direntOrPath.parentPath}/${direntOrPath.name}`;
  } else {
    filePath = direntOrPath;
  }
  const data: unknown = matter.read(filePath, opts);
  return data as PostData;
};
