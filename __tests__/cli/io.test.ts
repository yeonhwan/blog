import { describe, test, expect, beforeAll, vi } from "vitest";
import fs from "fs";
import { writeOrCreateFile, deleteFile, readFromDir, readFromFile } from "root/blog-cli/lib/io";

vi.mock("fs");

vi.mock("root/lib/utils", async (getOrigin) => {
  const origin = await getOrigin<typeof import("root/lib/utils")>();
  return {
    ...origin,
    resolvePathFromEntry: (path: string) => path,
  };
});

const dir = "/tmp";
const txt = "/test.txt";
const dirTxt = "/tmp/test.txt";
const dirMd = "/tmp/test.md";

describe("writeOrCreateFile", () => {
  beforeAll(() => {
    if (!fs.existsSync("/tmp")) fs.mkdirSync(dir);
    fs.writeFileSync(dirTxt, "");
    fs.writeFileSync(dirMd, "");
    fs.writeFileSync(txt, "");
  });

  test("creates a new file with content", () => {
    writeOrCreateFile(txt, "hello");
    const content = fs.readFileSync(txt, "utf-8");
    expect(content).toBe("hello");
  });

  test("appends to the file if append = true", () => {
    fs.writeFileSync(txt, "start\n");
    writeOrCreateFile(txt, "end", true);
    const content = fs.readFileSync(txt, "utf-8");
    expect(content).toBe("start\nend");
  });

  test("overwrites the file if append = false", () => {
    fs.writeFileSync(txt, "old");
    writeOrCreateFile(txt, "new", false);
    const content = fs.readFileSync(txt, "utf-8");
    expect(content).toBe("new");
  });
});

describe("deleteFile", () => {
  beforeAll(() => {
    if (!fs.existsSync("/tmp")) fs.mkdirSync(dir);
    fs.writeFileSync(dirTxt, "");
    fs.writeFileSync(dirMd, "");
    fs.writeFileSync(txt, "");
  });

  test("deletes an existing file", () => {
    fs.writeFileSync(txt, "bye");
    deleteFile(txt);
    expect(fs.existsSync(txt)).toBe(false);
  });

  test("throws if file doesn't exist", () => {
    expect(() => deleteFile("/nothing.txt")).toThrow("File not found");
  });
});

describe("readFromDir", () => {
  beforeAll(() => {
    if (!fs.existsSync("/tmp")) fs.mkdirSync(dir);
    fs.writeFileSync(dirTxt, "");
    fs.writeFileSync(dirMd, "");
    fs.writeFileSync(txt, "");
  });

  test("reads all files in the directory recursively", () => {
    const entries = readFromDir(dir);
    const names = entries.map((e) => e.name);
    expect(names).toContain("test.md");
    expect(names).toContain("test.txt");
  });

  test("throws if path is empty", () => {
    expect(() => readFromDir("")).toThrow("Path is empty");
  });
});

describe("readFromFile", () => {
  beforeAll(() => {
    if (!fs.existsSync("/tmp")) fs.mkdirSync(dir);
    fs.writeFileSync(dirTxt, "hello");
    fs.writeFileSync(dirMd, "");
    fs.writeFileSync(txt, "");
  });

  test("read a single file from entry", () => {
    const file = readFromFile(dirTxt);
    const readFile = fs.readFileSync(dirTxt, "utf-8");
    expect(file).toEqual(readFile);
  });

  test("throws if path is empty", () => {
    const cwd = process.cwd() 
    expect(() => readFromFile("no.txt")).toThrow(`File not found: ${cwd}/no.txt`);
  });

  test("return null when error suprresed", () => {
    expect(readFromFile("no.txt", true)).toEqual(null);
  });
});
