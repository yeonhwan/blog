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
  filterPostsByPublish,
} from "@/utils/posts";
import type { PostData, PostDTO, PostsDTO } from "@/types";
export async function getAllTags(): Promise<string[]> {
  const __postsDir = getContentPath();
  const __tagPath = path.join(__postsDir, "tag.json");
  const tagMap = JSON.parse(fs.readFileSync(__tagPath).toString());

  return tagMap.data;
}

export async function getAllPosts({
  page = 1,
  tag,
  ssg = false,
}: PostsDTO): Promise<{ data: PostData[]; total: number }> {
  const __postsDir = getContentPath();
  const allDirents = fs.readdirSync(__postsDir, {
    recursive: true,
    withFileTypes: true,
  });
  const fileDirents = allDirents.filter((dirent) => isPostFile(dirent));
  const postsData = fileDirents.map((dirent) => parsePostContent(dirent, { excerpt: true }));

  if (ssg) return { data: postsData, total: postsData.length };

  const postsSortedByDate = sortPostsByDate(postsData);
  const postsFilteredByPublish = filterPostsByPublish(postsSortedByDate);

  if (tag) {
    const filterdPosts = filterPostsByTag(postsFilteredByPublish, tag);
    const { total, data } = sliceDataPerPage(page, filterdPosts);
    return { total, data };
  } else {
    const { total, data } = sliceDataPerPage(page, postsFilteredByPublish);
    return { total, data };
  }
}

export async function getPostBySlug({ postSlug }: PostDTO) {
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
