import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { getContentPath, getSlugMap } from "./utils.js";

// ------------------------------------------------------

/**
 * @path : string
 * @data: {id: string, title: string}
 *
 *  create index.json or update index.json
 *  for newly updated posts
 *
 * **/
const upsertSlugMap = (data) => {
  const slugMap = getSlugMap();
  const slugPath = path.join(getContentPath(), "slug.json");

  const { slug, fileName } = data;
  slugMap[slug] = fileName;

  fs.writeFileSync(slugPath, JSON.stringify(slugMap), "utf-8");
};

/**
 * @meta : FrontMatter
 * @path : string
 *
 * write new meta info into exsting post
 * **/
const writeNewPostWithMeta = (meta, path) => {
  const newPost = matter.stringify(meta.content, meta.data);
  fs.writeFileSync(path, newPost, "utf-8");
};

/**
 * @path : string
 *
 * returns post meta + path object
 *
 *  data: Frontmatter
 *  content: content
 *  path : path
 *
 * **/
const getAllPosts = () => {
  const __postsDir = getContentPath();
  const files = fs
    .readdirSync(__postsDir, {
      recursive: true,
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"));

  const postPaths = files.map((file) => `${file.parentPath}/${file.name}`);

  const postsMeta = postPaths.map((postPath) => {
    const meta = matter.read(postPath);
    const fileName = path.basename(postPath);
    return { ...meta, fileName };
  });
  return postsMeta;
};

/**
 * @path : string
 *
 * returns post meta + path object
 *
 *  data: Frontmatter
 *  content: content
 *  path : path
 *
 * **/
const getLatestPost = (path) => {
  const allPostsMeta = getAllPosts(path);
  const sortedPosts = allPostsMeta.toSorted((a, b) => {
    return new Date(b.data.date) - new Date(a.data.date);
  });
  return sortedPosts[0];
};

export { writeNewPostWithMeta, upsertSlugMap, getAllPosts, getLatestPost };
