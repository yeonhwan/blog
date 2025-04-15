export type PostDTO = {
  page: number;
  sort: "ASC" | "DESC";
};

export type PostMeta = {
  title: string;
  date: Date;
  tags: string[];
};
