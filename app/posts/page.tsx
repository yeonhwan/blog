import { getAllPosts } from "@/actions/posts";
import Link from "next/link";

type PostsProps = {
  searchParams: {
    page?: string;
    sort?: "ASC" | "DESC";
  };
};

export default async function Posts({ searchParams }: PostsProps) {
  const params = await searchParams;
  const page = params.page ?? (1 as number);
  const sort = params.sort ?? "DESC";
  const posts = await getAllPosts({ page: Number(page), sort });

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {posts.map((post, idx) => {
          return (
            <Link href={`/posts/${post.slug}`} key={post.id}>
              {post.title}
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
