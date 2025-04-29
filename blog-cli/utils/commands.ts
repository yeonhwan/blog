// 🚨 to be deleted and separated

import { getSlugMap, createNewSlugFromTitle, revalidateSlugWithSlugMap } from "./utils";
import {
  createNewPostWithMeta,
  deletePost,
  getAllPosts,
  upsertIndexMap,
  updatePostState,
} from "./files.js";
import { PostMeta } from "../../app/types";

const generateNewPostMeta = (slugMap, title) => {
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
  return newPostMeta;
};

//🚨 no need to be function, just call them sequentially

// delete and just call generateNewPostMeta -> createNewPost
// export const createNewPost = ({ title, excerpt }: { title: string; excerpt: string }) => {
//   const slugMap = getSlugMap();
//   let slug = createNewSlugFromTitle(title);
//   slug = revalidateSlugWithSlugMap(slug, slugMap);
//
//   const newPostMeta: PostMeta = {
//     title,
//     excerpt,
//     date: new Date().toISOString(),
//     publish: false,
//     slug,
//     tags: [],
//   };
//
//   return createNewPostWithMeta(newPostMeta);
// };

const generateNewIndexes = (posts, slugMap) => {
  const newTags = new Set<string>([]);
  const usedSlug = new Set<string>();

  for (const post of posts) {
    const { tags, slug, publish } = post.data;

    usedSlug.add(slug);

    for (const tag of tags) {
      if (!publish) continue;
      newTags.add(tag);
    }

    // slug should keep being used
    if (slugMap[slug] !== post.fileName) {
      slugMap[slug] = post.fileName;
    }
  }

  // remove slugs that are not used anymore
  for (const slug in slugMap) {
    if (!usedSlug.has(slug)) {
      delete slugMap[slug];
    }
  }

  return { tags: { data: [...newTags] }, slugs: slugMap };
};

//🚨 no need to be function, just call them sequentially
// export const updatePostsIndexes = () => {
//   cosnst {tags, slugs} = generateNewIndexes(getAllPosts(), getSlugMap());
//   upsertIndexMap(tags, "tags");
//   upsertIndexMap(slugs, "slugs");
//
//   return { tags, slugs };
// };

// can be passed  [ posts, slugmap, tags ]
// can be substituted with generateNewIndexes like 36 ~ 60
// this function does take -> generate new -> update  just a brdige
// export const updatePostsIndexes = () => {
//   const posts = getAllPosts();
//   const slugMap = getSlugMap();
//   const newTags = new Set<string>([]);
//   const usedSlug = new Set<string>();
//
//   for (const post of posts) {
//     const { tags, slug, publish } = post.data;
//
//     usedSlug.add(slug);
//
//     for (const tag of tags) {
//       if (!publish) continue;
//       newTags.add(tag);
//     }
//
//     // slug should keep being used
//     if (slugMap[slug] !== post.fileName) {
//       slugMap[slug] = post.fileName;
//     }
//   }
//
//   // remove slugs that are not used anymore
//   for (const slug in slugMap) {
//     if (!usedSlug.has(slug)) {
//       delete slugMap[slug];
//     }
//   }
//
//   upsertIndexMap({ data: [...newTags] }, "tag");
//   upsertIndexMap(slugMap, "slug");
//
//   return { tags: [...newTags], slugs: slugMap };
// };

// 🚨 it does not need to be a function, call it sequentially
// export const updatePostsState = (postNames: string[], state: boolean) => {
//   for (const postName of postNames) {
//     updatePostState(postName, state);
//   }
//
//   updatePostsIndexes();
//
//   return;
// };

// 🚨 it does not need to be a function, call it sequentially
// export const deletePostAndUpdate = (postName: string) => {
//   deletePost(postName);
//   updatePostsIndexes();
// };
//
//

/**
⚠️
So basically all of the functions don't need to be this way
seperate them, and test in a bigger level as a integration test
⚠️
 * */
