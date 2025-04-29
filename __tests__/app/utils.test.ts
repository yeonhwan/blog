import {
  filterPostsByPublish,
  filterPostsByTag,
  sliceDataPerPage,
  sortPostsByDate,
} from "@/lib/utils";
import { describe, expect, test, vi } from "vitest";
import { PostData } from "root/types";

vi.mock("fs");

describe("sliceDataPerPage", () => {
  test("slices data array per page unit:5", () => {
    expect(sliceDataPerPage(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual({
      total: 2,
      data: [1, 2, 3, 4, 5],
    });
  });

  test("data array is less than page unit then return whole", () => {
    expect(sliceDataPerPage(1, [1, 2, 3])).toEqual({
      total: 1,
      data: [1, 2, 3],
    });
  });

  test("page unit value is wrong then throw", () => {
    expect(() => sliceDataPerPage(30, [1, 2, 3])).toThrowError("Page out of range");
  });
});

const mockPostData = [
  { post: { data: { publish: true, tags: ["2"], date: "2024-04-22" } }, fileName: "" },
  { post: { data: { publish: true, tags: ["1"], date: "2024-04-21" } }, fileName: "" },
  { post: { data: { publish: false, tags: ["2"], date: "2024-04-23" } }, fileName: "" },
] as unknown as PostData[];

describe("filter and sort", () => {
  test("filter data by publish", () => {
    expect(filterPostsByPublish(mockPostData)).toEqual([
      { post: { data: { publish: true, tags: ["2"], date: "2024-04-22" } }, fileName: "" },
      { post: { data: { publish: true, tags: ["1"], date: "2024-04-21" } }, fileName: "" },
    ]);
  });

  test("filter data by tag", () => {
    expect(filterPostsByTag(mockPostData, "1")).toEqual([
      { post: { data: { publish: true, tags: ["1"], date: "2024-04-21" } }, fileName: "" },
    ]);
  });

  test("filter data by tag", () => {
    expect(sortPostsByDate(mockPostData)).toEqual([
      { post: { data: { publish: false, tags: ["2"], date: "2024-04-23" } }, fileName: "" },
      { post: { data: { publish: true, tags: ["2"], date: "2024-04-22" } }, fileName: "" },
      { post: { data: { publish: true, tags: ["1"], date: "2024-04-21" } }, fileName: "" },
    ]);
  });
});
