import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import type { PostData } from "root/types";

const POST_PER_PAGE = 5;

export const sliceDataPerPage = <T>(page: number, data: T[]): { data: T[]; total: number } => {
  const start = (page - 1) * POST_PER_PAGE;
  const end = start + POST_PER_PAGE;
  const total = Math.ceil(data.length / POST_PER_PAGE);
  if (page < 0 || page > total) throw new Error("Page out of range");
  return {
    total,
    data: data.slice(start, end),
  };
};

export const filterPostsByPublish = (data: PostData[]) => {
  return data.filter((item) => item.post.data.publish === true);
};

export const filterPostsByTag = (data: PostData[], tag: string) => {
  return data.filter((item) => item.post.data.tags.includes(tag));
};

export const sortPostsByDate = (data: PostData[]): PostData[] => {
  return data.toSorted((a, b) => {
    return new Date(b.post.data.date).getTime() - new Date(a.post.data.date).getTime();
  });
};

export const getDateStringFromDate = (date: Date) => {
  return new Date(date).toLocaleDateString("ko-KR");
};

// ---
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["dt-h2"],
      color: ["neon-green-100", "neon-blue-100", "text-gray"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
