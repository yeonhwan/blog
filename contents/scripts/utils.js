import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * returns absoulte path to content directory
 * **/
const getContentPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return path.join(__dirname, "..", "posts");
};

const getIndexMap = (name) => {
  const __postsDir = getContentPath();
  const indexPath = path.join(__postsDir, `${name}.json`);
  const indexMap = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, "utf-8")) : {};
  return indexMap;
};

/**
 * @title : string
 *
 *  create slug from posts title
 *  e.g. "Hello World" => "hello-world"
 *  e.g. "한글 제목" => "한글-제목"
 * **/
const genNewMetaWithSlug = (meta) => {
  const slugMap = getIndexMap("slug");
  const { title } = meta.data;
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    // 한글, 영어, 숫자, 하이픈 허용
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "")
    // 중복 하이픈 치환
    .replace(/--+/g, "-");

  // slug 중복 체크
  let count = 1;
  while (slug in slugMap) {
    slug += `-${count}`;
    count++;
  }

  meta.data.slug = slug;
  return meta;
};

export { genNewMetaWithSlug, getContentPath, getIndexMap };
