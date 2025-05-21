// contentPath is single source of truth -> only retrived from getContentPath

import matter from "gray-matter";
import { PostData, PostMeta, IndexMap, Result } from "root/types";
import { resolvePathFromEntry, getContentPath } from "root/lib/utils";
import { deleteFile, writeOrCreateFile } from "./io";

import {
  genNewIndex,
  genNewPost,
  genNewPostMeta,
  genNewSlugFromFilename,
  getPostPath,
  modifyPostMeta,
  validateSlug,
} from "./builder";
import { getIndex } from "./fetch";

const createPost = (title: string, date: Date): Result<PostData> => {
  try {
    const slug = genNewSlugFromFilename(title);
    const { slugs } = getIndex();
    validateSlug(slug, slugs);
    const newPostMeta = genNewPostMeta(title, slug, date);
    const newPostData = genNewPost(newPostMeta);
    const path = getPostPath(getContentPath(), newPostData.fileName);
    const content = matter.stringify(newPostData.post.content, newPostData.post.data);
    writeOrCreateFile(path, content);
    return { data: newPostData, success: true };
  } catch (error) {
    console.error("Post creation failed:", error);
    return { data: error, success: false };
  }
};

const updatePostMeta = (
  postData: PostData,
  key: keyof PostMeta,
  value: PostMeta[keyof PostMeta],
): Result<PostData> => {
  try {
    const { fileName, post } = postData;
    const newPost = modifyPostMeta(post, key, value);
    const path = getPostPath(getContentPath(), fileName);
    const content = matter.stringify(newPost.content, newPost.data);
    writeOrCreateFile(path, content);
    return { data: { post: newPost, fileName }, success: true };
  } catch (error) {
    console.error("Post update failed:", error);
    return { data: error, success: false };
  }
};

const updateIndex = (postDatas: PostData[]): Result<IndexMap> => {
  try {
    const index = genNewIndex(postDatas);
    const base = getContentPath();
    const indexPath = resolvePathFromEntry([base, "index.json"]);
    writeOrCreateFile(indexPath, JSON.stringify(index, null, 2));
    return { data: index, success: true };
  } catch (error) {
    console.error("Index update failed:", error);
    return { data: error, success: false };
  }
};

const deletePost = (fileName: string): Result<string> => {
  try {
    const path = getPostPath(getContentPath(), fileName);
    deleteFile(path);
    return { data: path, success: true };
  } catch (error) {
    console.error("Post deletion failed:", error);
    return { data: error, success: false };
  }
};

export { getIndex, createPost, updatePostMeta, updateIndex, deletePost };
