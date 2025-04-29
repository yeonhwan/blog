//⚠️ to be integrated with utils and to be renamed into lib

import matter from "gray-matter";
import { createFilenameFromTitle } from "./utils";
import { IndexMap, NameWithPath, PostMetaWithExtra } from "../types";
import { getContentPath } from "../../lib/utils";
import { PostMeta } from "../../app/types";
import { deleteFile, readFromDir, readWithMatter, writeOrCreateFile } from "../../lib/io";
import { getBaseName, isMarkdownFile, resolvePathFromEntry } from "../../lib/utils";

//  test stratgies (mostly arleady done)
//  0. mkdir('/tmp'), writeFile('/tmp/a.md') -> dummy -> pass into matter.read -> return result
//  1. mock getPostPath to return a '/tmp' path
//  2. mock readWithMatter
// all functions need to return its results
// the problem is readWithMatter -> this is pure action when it accepts a path

const getPostPath = (postName: string) => {
  const contentPath = getContentPath();
  const path = resolvePathFromEntry([contentPath, postName]);
  return path;
};

const getPostFromName = (postName: string) => {
  const path = getPostPath(postName);
  // this is action but this can be mocked
  // matter is pure parsing engine
  // preapre ready environment and read with it fileSync and pass it as a string
  return readWithMatter<PostMeta>(path);
};

const updatePostState2 = (postName: string, state: boolean) => {
  const post = getContentPath(postName);
  // what  to be tested newly
  const newPost = { data: { ...post.data, publish: state }, content: post.content };
  writeOrCreateFile(path, matter.stringify(newPost.content, newPost.data), false);
  return newPost;
};

// const updatePostState = (postName: string, state: boolean) => {
//   const contentPath = getContentPath();
//   const path = resolvePathFromEntry([contentPath, postName]);
//   // this is action
//   const post = readWithMatter<PostMeta>(path);
//   // what  to be tested newly
//   const newMeta = { ...post.data, publish: state };
//   writeOrCreateFile(path, matter.stringify(post.content, newMeta), false);
// };

const deletePost2 = (postName: string) => {
  const path = getPostPath(postName);
  deleteFile(path);
  return path;
};

// const deletePost = (postName: string) => {
//   const contentPath = getContentPath();
//   const path = resolvePathFromEntry([contentPath, postName]);
//   deleteFile(path);
// };

const upsertIndexMap2 = (data: IndexMap, option: "slug" | "tag") => {
  const contentPath = getContentPath();
  const path = resolvePathFromEntry([contentPath, `${option}.json`]);
  writeOrCreateFile(path, JSON.stringify(data, null, 2), false);
  return data;
};

// const upsertIndexMap = (data: IndexMap, option: "slug" | "tag") => {
//   const contentPath = getContentPath();
//   const path = resolvePathFromEntry([contentPath, `${option}.json`]);
//   writeOrCreateFile(path, JSON.stringify(data, null, 2), false);
// };

const createNewPost = (meta: PostMeta, fileName: string): NameWithPath => {
  const path = getPostPath(fileName);
  const newPost = matter.stringify("#콘텐츠 내용을 작성해 주세요.", meta);
  writeOrCreateFile(path, newPost);
  return { ...newPost, fileName };
};

// const createNewPostWithMeta = (meta: PostMeta): NameWithPath => {
//   const contentPath = getContentPath();
//   const fileName = createFilenameFromTitle(meta.title);
//   const targetPath = resolvePathFromEntry([contentPath, fileName]);
//   const newPost = matter.stringify("#콘텐츠 내용을 작성해 주세요.", meta);
//   writeOrCreateFile(targetPath, newPost);
//   return { fileName, postPath: targetPath };
// };

// mock readFromDir -> readDirSync('/tmp')
const getAllPosts2 = (): PostMetaWithExtra<{ fileName: string }>[] => {
  const contentPath = getContentPath();
  const postsDirent = readFromDir(contentPath).filter((dirent) => isMarkdownFile(dirent));
  return postsDirent.map((entry) => {
    const path = resolvePathFromEntry(entry);
    const post = readWithMatter<PostMeta>(path, { excerpt: true });
    return { ...post, fileName: getBaseName(path) };
  });
};

// const getAllPosts = (): PostMetaWithExtra<{ fileName: string }>[] => {
//   const contentPath = getContentPath();
//   const postsDirent = readFromDir(contentPath).filter((dirent) => isMarkdownFile(dirent));
//   return postsDirent.map((entry) => {
//     const path = resolvePathFromEntry(entry);
//     const { data } = readWithMatter<PostMeta>(path, { excerpt: true });
//     return { data, fileName: getBaseName(path) };
//   });
// };

// to be added
// generateMeta
// generateNewIndexesh

export { getAllPosts, upsertIndexMap, createNewPostWithMeta, deletePost, updatePostState };
