"use server";
import fs from "fs";
import path from "path";
import { getContentPath } from "@/utils/getContentPath";
import {
  sliceDirentsPerPage,
  isPostFile,
  parsePostContent,
  sortPostsByDate,
} from "@/utils/posts";
import type { PostData, PostDTo, PostsDTO } from "@/types/posts";

export async function getAllPosts({
  page = 1,
}: PostsDTO): Promise<{ data: PostData[]; total: number }> {
  const __postsDir = getContentPath();
  const allDirents = fs.readdirSync(__postsDir, {
    recursive: true,
    withFileTypes: true,
  });
  const files = allDirents.filter((dirent) => isPostFile(dirent));
  const { total, data: postsDirent } = sliceDirentsPerPage(page, files);
  const posts = postsDirent.map((dirent) =>
    parsePostContent(dirent, { excerpt: true }),
  );
  return { total, data: sortPostsByDate(posts) };
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
