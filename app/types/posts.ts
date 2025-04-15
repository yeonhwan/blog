export type PostsDTO = {
  page: number;
  sort: "ASC" | "DESC";
};

export type PostDTo = {
  postSlug: string;
};

export type PostMeta = {
  title: string;
  date: Date;
  slug: string;
  id: string;
};
