import { resolvePathFromEntry } from "./io";
import { Post, PostData, PostMeta } from "root/types";

// path utils
const getPostPath = (base: string, postName: string): string => {
  const path = resolvePathFromEntry([base, postName]);
  return path;
};

// generation
const genNewSlugFromFilename = (fileName: string): string => {
  fileName = fileName.split(".")[0];
  const slug = fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    // 한글, 영어, 숫자, 하이픈 허용
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "")
    // 중복 하이픈 치환
    .replace(/--+/g, "-");

  if (!slug.length) throw new Error("Slug is empty, please check the title again");
  return slug;
};

const validateSlug = (slug: string, slugs: string[]) => {
  for (const exist of slugs) {
    if (slug === exist) throw new Error(`Slug ${slug} already exists`);
  }
};

const modifyPostMeta = (post: Post, key: keyof PostMeta, value: PostMeta[keyof PostMeta]): Post => {
  if (!(key in post.data)) throw new Error(`Key ${key} is not a valid PostMeta key`);
  if (key === "slug") throw new Error("Slug cannot be modified after creation");
  const newPost = { ...post, data: { ...post.data, [key]: value } };
  return newPost;
};

const genNewPostMeta = (title: string, slug: string, date: Date): PostMeta => {
  return {
    title,
    excerpt: "",
    date: new Date(date),
    publish: false,
    slug,
    tags: [],
  } as PostMeta;
};

const genNewPost = (meta: PostMeta): PostData => {
  const fileName = meta.slug + ".md";
  const newPost = { data: meta, content: "#콘텐츠 내용을 작성해 주세요." };
  return { post: newPost, fileName };
};

const genNewIndex = (postDatas: PostData[]) => {
  const newTags = new Set<string>([]);
  const newSlugs: string[] = [];

  for (const post of postDatas) {
    const { tags, publish, slug } = post.post.data;
    const newSlug = genNewSlugFromFilename(post.fileName);
    const target = slug !== newSlug ? newSlug : slug;
    validateSlug(target, newSlugs);
    newSlugs.push(target);

    for (const tag of tags) {
      if (!publish) continue;
      newTags.add(tag);
    }
  }

  return { tags: [...newTags], slugs: [...newSlugs] };
};

export {
  getPostPath,
  validateSlug,
  genNewSlugFromFilename,
  modifyPostMeta,
  genNewPostMeta,
  genNewPost,
  genNewIndex,
};
