import { getSlugMap, getTagMap, createNewSlugFromTitle, revalidateSlugWithSlugMap } from "./utils";
import {
  createNewPostWithMeta,
  deletePost,
  getAllPosts,
  upsertIndexMap,
  updatePostState,
} from "./files.js";
import { PostMeta } from "../types";

export const createNewPost = ({ title, excerpt }: { title: string; excerpt: string }) => {
  const slugMap = getSlugMap();
  let slug = createNewSlugFromTitle(title);
  slug = revalidateSlugWithSlugMap(slug, slugMap);

  const newPostMeta: PostMeta = {
    title,
    excerpt,
    date: new Date().toISOString(),
    publish: false,
    slug,
    tags: [],
  };
  return createNewPostWithMeta(newPostMeta);
};

export const updatePostsIndexes = () => {
  const posts = getAllPosts();
  const tagMap = getTagMap();
  const slugMap = getSlugMap();
  const newTags = new Set(tagMap["data"] || []);
  const newSlugs = slugMap;

  for (let post of posts) {
    const { tags, slug, publish } = post.data;
    if (!publish) continue;

    for (let tag of tags) {
      newTags.add(tag);
    }

    if (slug in slugMap) continue;
    newSlugs[slug] = post.fileName;
  }

  upsertIndexMap({ data: [...newTags] }, "tag");
  upsertIndexMap(slugMap, "slug");

  return { tags: [...newTags], slugs: newSlugs };
};

export const updatePostsState = (postNames: string[], state: boolean) => {
  for (let postName of postNames) {
    updatePostState(postName, state);
  }

  return;
};

export const deletePostAndUpdate = (postName: string) => {
  deletePost(postName);
  updatePostsIndexes();
};
