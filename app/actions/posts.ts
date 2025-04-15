"use server";
import fs from "fs";
import path from "path";
import { getContentPath } from "@/utils/getContentPath";
import { getPostsPerPage, getPostsMeta } from "@/utils/posts";
import matter from "gray-matter";
import type { PostDTo, PostsDTO } from "@/types/posts";

/**
 * @PostDTO
 *
 * return all posts meta per page to render Posts page
 **/

export async function getAllPosts({ page = 1, sort = "DESC" }: PostsDTO) {
  const __postsDir = getContentPath();
  const allDirents = fs.readdirSync(__postsDir, {
    recursive: true,
    withFileTypes: true,
  });
  const files = allDirents.filter(
    (dirent) => dirent.isFile() && dirent.name.endsWith(".md"),
  );
  const posts = getPostsPerPage(page, files);
  const metas = getPostsMeta(posts);
  return metas;
}

export async function getPostBySlug({ postSlug }: PostDTo) {
  const __postsDir = getContentPath();
  const __indexPath = path.join(__postsDir, "slug.json");
  const index = JSON.parse(fs.readFileSync(__indexPath).toString());
  const __postPath = path.join(__postsDir, index[postSlug]);
  const post = matter.read(__postPath);
  return post;
}
