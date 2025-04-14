"use server";
import { getContentPath } from "@/utils/getContentPath";
import fs from "fs";
import * as matter from "gray-matter";

export async function getAllPosts() {
  const currentPath = getContentPath();
  const allDirents = fs.readdirSync(currentPath, {
    recursive: true,
    withFileTypes: true,
  });
  const files = allDirents.filter((dirent) => dirent.isFile());
  console.log(files);
}
