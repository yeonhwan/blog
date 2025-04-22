import { PostMeta } from "../app/types";

export type PostMetaWithExtra<T> = { data: PostMeta } & T;
export type NameWithPath = { fileName: string; postPath: string };
export type IndexMap = { [key: string]: string | string[] };
