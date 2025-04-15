"use server";
import { getContentPath } from "@/utils/getContentPath";
import fs from "fs";
import { getPostsPerPage, getPostsMeta } from "@/utils/posts";
import type { PostDTO } from "@/types/posts";

/**
 * @PostDTO
 *
 * return all posts meta per page to render Posts page
 **/

export async function getAllPosts({ page = 1, sort = "DESC" }: PostDTO) {
  const currentPath = getContentPath();
  const allDirents = fs.readdirSync(currentPath, {
    recursive: true,
    withFileTypes: true,
  });
  const files = allDirents.filter((dirent) => dirent.isFile());
  const posts = getPostsPerPage(page, files);
  const metas = getPostsMeta(posts);
  return metas;
}
