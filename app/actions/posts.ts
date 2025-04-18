"use server";
import fs from "fs";
import path from "path";
import { getContentPath } from "@/utils/getContentPath";
import {
  sliceDataPerPage,
  isPostFile,
  parsePostContent,
  sortPostsByDate,
  filterPostsByTag,
} from "@/utils/posts";
import type { PostData, PostDTo, PostsDTO } from "@/types/posts";

export async function getAllTags(): Promise<string[]> {
  const __postsDir = getContentPath();
  const __tagPath = path.join(__postsDir, "tag.json");
  const tagMap = JSON.parse(fs.readFileSync(__tagPath).toString());

  return tagMap.data;
}

export async function getAllPosts({
  page = 1,
  tag,
}: PostsDTO): Promise<{ data: PostData[]; total: number }> {
  const __postsDir = getContentPath();
  const allDirents = fs.readdirSync(__postsDir, {
    recursive: true,
    withFileTypes: true,
  });
  const fileDirents = allDirents.filter((dirent) => isPostFile(dirent));
  let data;

  if (tag) {
    const postsData = fileDirents.map((dirent) => parsePostContent(dirent, { excerpt: true }));
    const filterdPosts = filterPostsByTag(postsData, tag);
    const { total, data: posts } = sliceDataPerPage(page, filterdPosts);
    return { total, data: sortPostsByDate(posts) };
  } else {
    const { total, data: postsDirent } = sliceDataPerPage(page, fileDirents);
    const posts = postsDirent.map((dirent) => parsePostContent(dirent, { excerpt: true }));
    return { total, data: sortPostsByDate(posts) };
  }
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
