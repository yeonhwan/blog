export type PostsDTO = {
  page: number;
};

export type PostDTo = {
  postSlug: string;
};

export type PostMeta = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
};

export type PostData = {
  content: string;
  data: PostMeta;
};
