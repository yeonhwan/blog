import path from "path";

import { getContentPath, genNewMetaWithSlug } from "./utils.js";
import { getAllPosts, writeNewPostWithMeta, upsertSlugMap } from "./files.js";

/**
 * check if id is present in latest post meta
 * if not present, create it
 * **/

export const validateAndUpdateAllPostsMeta = () => {
  console.log("🟡 업데이트 될 포스트를 탐색합니다.\n");
  const __postsDir = getContentPath();
  const posts = getAllPosts();

  for (let post of posts) {
    if (post.data.slug) continue;

    const postPath = path.join(__postsDir, post.fileName);
    const newPostMetaWithSlug = genNewMetaWithSlug(post);

    console.log("🚧 해당 포스트에 slug를 추가합니다.");
    console.log(` slug : ${newPostMetaWithSlug.data.slug}\n`);

    writeNewPostWithMeta(newPostMetaWithSlug, postPath);

    upsertSlugMap({
      slug: newPostMetaWithSlug.data.slug,
      fileName: post.fileName,
    });
  }

  console.log("🟢 업데이트 작업을 완료했습니다.\n");
};
