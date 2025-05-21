import { expect, describe, test } from "vitest";
import {
  getPostPath,
  genNewSlugFromFilename,
  validateSlug,
  modifyPostMeta,
  genNewPostMeta,
  genNewPost,
  genNewIndex,
} from "root/blog-cli/lib/builder";
import { templatePost, templatePostData, templatePostData2 } from "./fixtures/testPosts";

describe("blog-cli Builder tests", () => {
  describe("Slug generation", () => {
    test("All english should be in lower-case", () => {
      expect(genNewSlugFromFilename("Hello World")).toEqual("hello-world");
    });

    test("All white space should be transformed into -", () => {
      expect(genNewSlugFromFilename("Hello World")).toEqual("hello-world");
    });

    test("Only allow korean, number, english,", () => {
      expect(genNewSlugFromFilename("!@188  ^&*% HI! 안녕하세요")).toEqual("188-hi-안녕하세요");
    });

    test("Remove extension and convert", () => {
      expect(genNewSlugFromFilename("테스트-마크다운.md")).toEqual("테스트-마크다운");
    });

    test("Throw when slug generation return empty slug", () => {
      expect(() => genNewSlugFromFilename("!@^&*%!|==.")).toThrowError(
        "Slug is empty, please check the title again",
      );
    });

    test("Multiple hyphens become single", () => {
      expect(genNewSlugFromFilename("He------llo")).toEqual("he-llo");
    });

    test("Correctly revalidate slug with slug map", () => {
      expect(() => validateSlug("hello-world", ["hello-world"])).toThrowError(
        "Slug hello-world already exists",
      );
    });
  });

  describe("Path and file utilities", () => {
    test("getPostPath should return correct path", () => {
      const postName = "hello-world.md";
      const base = "/tmp";
      expect(getPostPath(base, postName)).toEqual("/tmp/hello-world.md");
    });
  });

  describe("Post meta modification", () => {
    test("modifyPostMeta should correctly modify and return new meta", () => {
      const newPost = modifyPostMeta(templatePost, "title", "New Title");
      expect(newPost.data.title).toEqual("New Title");
    });

    test("modifyPostMeta should thorw when key is not known", () => {
      // @ts-expect-error intentionally passing an unknown key
      expect(() => modifyPostMeta(templatePost, "none", "New Title")).toThrowError(
        "Key none is not a valid PostMeta key",
      );
    });

    test("modifyPostMeta should thorw when trying to change slug", () => {
      expect(() => modifyPostMeta(templatePost, "slug", "New slug")).toThrowError(
        "Slug cannot be modified after creation",
      );
    });
  });

  describe("Post creation (pure)", () => {
    const genNewPostMetaTest = test.extend({
      title: "test test",
      date: new Date("2023-01-01"),
      example: {
        title: "test test",
        excerpt: "",
        date: new Date("2023-01-01"),
        publish: false,
        slug: "test-test",
        tags: [],
      },
    });

    genNewPostMetaTest(
      "genNewPostMeta should return new template meta object",
      ({ title, date, example }) => {
        const slug = genNewSlugFromFilename(title);

        expect(genNewPostMeta(title, slug, date)).toEqual(example);
      },
    );

    genNewPostMetaTest("genNewPost should return new Post object based on meta", ({ example }) => {
      const expected = {
        post: {
          data: example,
          content: "#콘텐츠 내용을 작성해 주세요.",
        },
        fileName: "test-test.md",
      };

      expect(genNewPost(expected.post.data)).toEqual(expected);
    });
  });

  describe("Index generation", () => {
    test("genNewIndexes should return correct index objects", () => {
      const newIndexes = genNewIndex([templatePostData, templatePostData2]);
      expect(newIndexes).toEqual({
        tags: ["test", "test2"],
        slugs: ["test-test", "test-test-2"],
      });
    });
  });
});
