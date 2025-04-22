export type PostsDTO = {
  page?: number;
  tag?: string;
  ssg?: boolean;
};

export type PostDTo = {
  postSlug: string;
};

export type PostMeta = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  publish: boolean;
  tags: string[];
};

export type PostData = {
  content: string;
  data: PostMeta;
};
