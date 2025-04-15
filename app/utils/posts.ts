import type { Dirent } from "node:fs";
import matter from "gray-matter";
import type { PostMeta } from "@/types/posts";

const POST_PER_PAGE = 5;

export const getPostsPerPage = (page: number, posts: Dirent[]) => {
  const start = (page - 1) * POST_PER_PAGE;
  const end = start + POST_PER_PAGE;
  return posts.slice(start, end);
};

export const getPostsMeta = (posts: Dirent[]): PostMeta[] => {
  return posts.map((post) => {
    const filePath = `${post.parentPath}/${post.name}`;
    return matter.read(filePath).data as PostMeta;
  });
};
