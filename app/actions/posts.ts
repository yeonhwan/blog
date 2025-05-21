"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isMarkdownFile } from "root/lib/utils";
import { getContentPath } from "@/lib/utils";
import {
  sliceDataPerPage,
  sortPostsByDate,
  filterPostsByTag,
  filterPostsByPublish,
} from "@/lib/utils";
import type { IndexMap, PostData, PostDTO, PostsDTO } from "root/types";

export async function getAllTags(): Promise<string[]> {
  const __postsDir = getContentPath();
  const __indexPath = path.join(__postsDir, "index.json");

  const { tags } = JSON.parse(fs.readFileSync(__indexPath).toString());

  return tags;
}

export async function getAllPosts({
  page = 1,
  tag,
  ssg = false,
}: PostsDTO): Promise<{ data: PostData[]; total: number }> {
  const postsData = fetchAllPostsFromFS();

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

export async function getPostBySlug({ postSlug }: PostDTO): Promise<PostData | null> {
  return fetchPostFromFS(postSlug) as PostData;
}

const fetchAllPostsFromFS = () => {
  const __postsDir = getContentPath();
  const allDirents = fs.readdirSync(__postsDir, {
    recursive: true,
    withFileTypes: true,
  });
  const postEntries = allDirents.filter((dirent) => isMarkdownFile(dirent));
  const postsData = postEntries.map(({ parentPath, name }) => ({
    post: matter.read(`${parentPath}/${name}`, { excerpt: true }),
    fileName: name,
  })) as PostData[];
  return postsData;
};

const fetchPostFromFS = (slug: string) => {
  const __postsDir = getContentPath();
  const __indexPath = path.join(__postsDir, "index.json");
  const { slugs } = JSON.parse(fs.readFileSync(__indexPath).toString()) as IndexMap;
  const isFound = slugs.includes(slug);

  // if it is wrong slug, return null to redirect
  if (!isFound) return null;

  const fileName = `${slug}.md`;
  const __postPath = path.join(__postsDir, fileName);
  const post = matter.read(__postPath);
  return { post, fileName: __filename };
};
