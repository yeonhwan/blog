import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const getContentPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return path.join(__dirname, "..", "..", "contents", "posts");
};

const createNewSlugFromTitle = (title: string) => {
  let slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    // 한글, 영어, 숫자, 하이픈 허용
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "")
    // 중복 하이픈 치환
    .replace(/--+/g, "-");
  return slug;
};

const getIndexMap = (name: string) => {
  const __postsDir = getContentPath();
  const indexPath = path.join(__postsDir, `${name}.json`);
  const indexMap = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, "utf-8")) : {};
  return indexMap;
};

const getSlugMap = () => {
  return getIndexMap("slug");
};

const getTagMap = () => {
  return getIndexMap("tag");
};

const createFilenameFromTitle = (title: string) => {
  return title.replace(/\s+/g, "_").replace(/\./g, "");
};

const revalidateSlugWithSlugMap = (slug: string, slugMap: any) => {
  let count = 1;
  while (slug in slugMap) {
    slug += `-${count}`;
    count++;
  }
  return slug;
};

export {
  getContentPath,
  createNewSlugFromTitle,
  revalidateSlugWithSlugMap,
  createFilenameFromTitle,
  getSlugMap,
  getTagMap,
};
