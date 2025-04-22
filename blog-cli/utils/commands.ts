import { getSlugMap, createNewSlugFromTitle, revalidateSlugWithSlugMap } from "./utils";
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
  const slugMap = getSlugMap();
  const newTags = new Set<string>([]);
  const usedSlug = new Set<string>();

  for (let post of posts) {
    const { tags, slug, publish } = post.data;

    usedSlug.add(slug);

    for (let tag of tags) {
      if (!publish) continue;
      newTags.add(tag);
    }

    // slug should keep being used
    if (slugMap[slug] !== post.fileName) {
      slugMap[slug] = post.fileName;
    }
  }

  // remove slugs that are not used anymore
  for (let slug in slugMap) {
    if (!usedSlug.has(slug)) {
      delete slugMap[slug];
    }
  }

  upsertIndexMap({ data: [...newTags] }, "tag");
  upsertIndexMap(slugMap, "slug");

  return { tags: [...newTags], slugs: slugMap };
};

export const updatePostsState = (postNames: string[], state: boolean) => {
  for (let postName of postNames) {
    updatePostState(postName, state);
  }

  updatePostsIndexes();

  return;
};

export const deletePostAndUpdate = (postName: string) => {
  deletePost(postName);
  updatePostsIndexes();
};
