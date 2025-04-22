import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { createFilenameFromTitle, getContentPath } from "./utils";
import { IndexMap, NameWithPath, PostMetaWithExtra } from "../types";
import { PostMeta } from "../../app/types";

const updatePostState = (postName: string, state: boolean) => {
  const __postsDir = getContentPath();
  const postPath = path.join(__postsDir, postName);
  const postMeta = matter.read(postPath);
  const newMeta = { ...postMeta.data, publish: state };
  fs.writeFileSync(postPath, matter.stringify(postMeta.content, newMeta), "utf-8");
  return;
};

const deletePost = (postName: string) => {
  const __postsDir = getContentPath();
  const postPath = path.join(__postsDir, postName);

  if (fs.existsSync(postPath)) {
    fs.unlinkSync(postPath);
  } else throw new Error("포스트가 존재하지 않습니다.");

  return;
};

const upsertIndexMap = (data: IndexMap, option: "slug" | "tag") => {
  const indexPath = path.join(getContentPath(), `${option}.json`);
  fs.writeFileSync(indexPath, JSON.stringify(data, null, 2), "utf-8");
};

const createNewPostWithMeta = (meta: PostMeta): NameWithPath => {
  const __postsDir = getContentPath();
  const fileName = createFilenameFromTitle(meta.title);
  const newPostPath = path.join(__postsDir, `${fileName}.md`);
  const newPost = matter.stringify("#콘텐츠 내용을 작성해 주세요.", meta);
  fs.writeFileSync(newPostPath, newPost, "utf-8");
  return { fileName, postPath: newPostPath };
};

const getAllPosts = (): PostMetaWithExtra<{ fileName: string }>[] => {
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
    return { data: meta.data as PostMeta, fileName };
  });
  return postsMeta;
};

export { getAllPosts, upsertIndexMap, createNewPostWithMeta, deletePost, updatePostState };
