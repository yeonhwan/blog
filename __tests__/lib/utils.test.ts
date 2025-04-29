import { describe, expect, test, vi, beforeAll } from "vitest";
import { getBaseName, getContentPath, isMarkdownFile, resolvePathFromEntry } from "../../lib/utils";
import { fileURLToPath } from "url";
import fs from "fs";
import * as __path from "path";

vi.mock("fs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = __path.dirname(__filename);
const root = __path.join(__dirname, "..", "..");
const testdir = "/tmp";

beforeAll(() => {
  fs.mkdirSync(testdir);
  fs.writeFileSync("/tmp/test.md", "");
  fs.writeFileSync("/tmp/test.txt", "");
});

describe("Global Utils", () => {
  test("getContentPath", () => {
    const expectedPath = __path.join(__dirname, "..", "..", "contents", "posts");
    expect(getContentPath()).toEqual(expectedPath);
  });

  test("resolvePathFromEntry: none", () => {
    // @ts-expect-error intentionally passing undefined
    expect(() => resolvePathFromEntry()).toThrowError("Path is empty");
  });

  test("resolvePathFromEntry: error", () => {
    // @ts-expect-error intentionally passing number
    expect(() => resolvePathFromEntry(1)).toThrowError("Unsupported entry type");
  });

  test("resolvePathFromEntry: string", () => {
    const path = "test/test.ts";

    expect(resolvePathFromEntry(path)).toEqual(__path.join(root, path));
  });

  test("resolvePathFromEntry: string[]", () => {
    const path = ["test", "test.ts"];
    expect(resolvePathFromEntry(path)).toEqual(__path.join(root, ...path));
  });

  test("resolvePathFromEntry: Dirent/file", () => {
    const dirent = fs.readdirSync("/tmp", { withFileTypes: true, recursive: true })[0];
    expect(resolvePathFromEntry(dirent)).toEqual("/tmp/test.md");
  });

  test("should return true on md file", () => {
    const dirent = fs.readdirSync("/tmp", { withFileTypes: true, recursive: true })[0];
    expect(isMarkdownFile(dirent)).toEqual(true);
  });

  test("is not md file", () => {
    const dirent = fs.readdirSync("/tmp", { withFileTypes: true, recursive: true })[1];
    expect(isMarkdownFile(dirent)).toEqual(false);
  });

  test("getBaseName", () => {
    const dirent = fs.readdirSync("/tmp", { withFileTypes: true, recursive: true })[0];
    expect(getBaseName(dirent.name)).toEqual("test.md");
  });
});
