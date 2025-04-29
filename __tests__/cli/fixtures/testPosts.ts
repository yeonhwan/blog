const templateMeta = {
  title: "test test",
  excerpt: "",
  publish: true,
  date: new Date("2023-01-01"),
  slug: "test-test",
  tags: ["test"],
};

const templateMeta2 = {
  title: "test test 2",
  excerpt: "",
  publish: true,
  date: new Date("2023-01-01"),
  slug: "test-test-2",
  tags: ["test2", "test"],
};

const templatePost = { data: templateMeta, content: "#콘텐츠 내용을 작성해 주세요." };
const templatePost2 = { data: templateMeta2, content: "" };

const templatePostData = { post: templatePost, fileName: "test-test.md" };
const templatePostData2 = { post: templatePost2, fileName: "test-test-2.md" };

const templateSlugs = {
  "test-test": "test-test.md",
  "test-test-2": "test-test-2.md",
};

export {
  templateMeta,
  templateMeta2,
  templatePost,
  templatePost2,
  templatePostData,
  templatePostData2,
  templateSlugs,
};
