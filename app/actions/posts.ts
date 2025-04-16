"use server";
import fs from "fs";
import path from "path";
import { getContentPath } from "@/utils/getContentPath";
import { getPostsPerPage, isPostFile, parsePostContent } from "@/utils/posts";
import type { PostData, PostDTo, PostsDTO } from "@/types/posts";

export async function getAllPosts({ page = 1 }: PostsDTO): Promise<PostData[]> {
  const __postsDir = getContentPath();
  const allDirents = fs.readdirSync(__postsDir, {
    recursive: true,
    withFileTypes: true,
  });
  const files = allDirents.filter((dirent) => isPostFile(dirent));
  const posts = getPostsPerPage(page, files);
  const metas = posts.map((dirent) =>
    parsePostContent(dirent, { excerpt: true }),
  );
  return metas;
}

export async function getPostBySlug({ postSlug }: PostDTo) {
  const __postsDir = getContentPath();
  const __indexPath = path.join(__postsDir, "slug.json");
  const slugMap = JSON.parse(fs.readFileSync(__indexPath).toString());
  const postFilename = slugMap[postSlug];
  // if it is wrong slug, return null to redirect
  if (postFilename === undefined) return null;

  const __postPath = path.join(__postsDir, slugMap[postSlug]);
  const post = parsePostContent(__postPath);
  return post;
}
