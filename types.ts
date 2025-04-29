import { GrayMatterFile } from "gray-matter";

export type PostsDTO = {
  page?: number;
  tag?: string;
  ssg?: boolean;
};

export type PostDTO = {
  postSlug: string;
};

export type PostMeta = {
  title: string;
  excerpt: string;
  date: Date;
  slug: string;
  publish: boolean;
  tags: string[];
};

export type Post = {
  data: PostMeta;
  content: string;
} & Partial<GrayMatterFile<string>>;

export type PostMetaWithExtra<T> = { data: PostMeta } & T;

export type PostData = {
  fileName: string;
  post: Post;
};

export type IndexMap = {
  tags: string[];
  slugs: string[];
};

export type Success<T> = {
  success: true;
  data: T;
};

export type Fail = {
  success: false;
  data: unknown | string | Error;
};

export type Result<T> = Success<T> | Fail;
