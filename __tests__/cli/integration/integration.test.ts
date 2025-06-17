import { describe, test, vi, expect, beforeEach } from "vitest";
import fs from "fs";
import matter from "gray-matter";
import { Post, PostData, PostMeta } from "root/types";
import createStubs from "./createStubs";
import { getAllPosts, getIndex, getPost } from "root/blog-cli/lib/fetch";
import { createPost, deletePost, updateIndex, updatePostMeta } from "root/blog-cli/lib/actions";

const FIXTURE_PATH = `${process.cwd()}/__tests__/cli/fixtures/posts`;

const expectPostMetaToMatch = (actual: PostMeta, expected: PostMeta) => {
  expect(actual).toMatchObject({
    title: expected.title,
    slug: expected.slug,
    date: expected.date,
    publish: expected.publish,
    excerpt: expected.excerpt,
    tags: expected.tags,
  });
};

vi.mock("../../../blog-cli/lib/io", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../../blog-cli/lib/io")>();
  return {
    ...original,
    getContentPath: vi.fn(() => {
      return FIXTURE_PATH;
    }),
  };
});

describe("Integration Test for cli-action", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    createStubs(FIXTURE_PATH);
    return () => fs.rmSync(FIXTURE_PATH, { recursive: true, force: true });
  });

  test("getPost :: should return post by filename", () => {
    const { post: actual } = getPost("test-post.md");
    const expected = matter.read(`${FIXTURE_PATH}/test-post.md`) as Post;

    expectPostMetaToMatch(actual.data, expected.data);
    expect(actual.content).toEqual(expected.content);
  });

  test("getAllPost :: should return all parsed markdown posts", () => {
    const testPostsPaths = ["test-post.md", "test-post-2.md"];
    const expectedPosts = testPostsPaths.map((fileName) =>
      matter.read(`${FIXTURE_PATH}/${fileName}`),
    );
    const actualPosts = getAllPosts();
    expect(actualPosts).toHaveLength(expectedPosts.length);

    for (const expected of expectedPosts) {
      const actual = actualPosts.find((post) => expected.data.slug === post.post.data.slug)!;
      expectPostMetaToMatch(actual.post.data, expected.data as PostMeta);
      expect(actual.post.content).toEqual(expected.content);
    }
  });

  test("createPost :: should generate meta and content then write post to file", () => {
    const date = new Date("2024-04-24");
    const { data, success } = createPost("new create post", date);
    const expected = {
      fileName: "new_create_post.md",
      post: {
        data: {
          title: "new create post",
          slug: "new-create-post",
          tags: [] as string[],
          publish: false,
          date: date,
          excerpt: "",
        },
        content: "#콘텐츠 내용을 작성해 주세요.",
      },
    } as PostData;
    const created = matter.read(`${FIXTURE_PATH}/new-create-post.md`) as Post;

    if (success) {
      // compare result & created
      expectPostMetaToMatch(data.post.data, expected.post.data);
      expectPostMetaToMatch(created.data, expected.post.data);
      expect(data.post.content).toEqual(expected.post.content);
      expect(created.content.trim()).toEqual(expected.post.content);
    }
  });

  test("createPost :: should fail when the slug is duplicated", () => {
    const { data, success } = createPost("test-post", new Date("2024-04-24"));
    expect(success).toBe(false);
    expect(data).toBeInstanceOf(Error);
  });

  test("updatePost :: should update meta and write updated post to file", () => {
    const expected = getPost("test-post-2.md");
    const { data, success } = updatePostMeta(getPost("test-post-2.md"), "publish", true);
    expected.post.data.publish = true;
    if (success) {
      expectPostMetaToMatch(data.post.data, expected.post.data);
    }
  });

  test("getIndex :: should read and return index", () => {
    const expected = JSON.parse(fs.readFileSync(`${FIXTURE_PATH}/index.json`).toString());
    const actual = getIndex();

    expect(expected).toEqual(actual);
  });

  test("updateIndexes :: should generate and write updated tag and slug index files", () => {
    const index = getIndex();

    // before update & create
    expect(index.tags).not.toContain("shouldNotHaveThis");
    expect(index.slugs).not.toContain("should-not-have-this");

    // update tag
    updatePostMeta(getPost("test-post-2.md"), "tags", ["shouldNotHaveThis"]);
    // create new post
    createPost("should not have this", new Date("2024-04-24"));

    const allPosts = getAllPosts();
    // update index
    updateIndex(allPosts);

    const updatedIndex = getIndex();
    expect(updatedIndex.slugs).toContain("should-not-have-this");
    expect(updatedIndex.tags).toContain("shouldNotHaveThis");
  });

  test("deletePost :: should delete the specified post file", () => {
    const fileName = "test-post-2.md";
    const { data, success } = deletePost(fileName);
    expect(success).toEqual(true);
    expect(data).toEqual(`${FIXTURE_PATH}/${fileName}`);
  });

  test("deletePost :: should fail when it is not found", () => {
    const fileName = "not-found.md";
    const { data, success } = deletePost(fileName);
    expect(success).toEqual(false);
    expect(data).toBeInstanceOf(Error);
  });
});
