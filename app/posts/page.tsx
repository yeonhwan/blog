import { getAllPosts } from "@/actions/posts";
import PageTitle from "@/components/ui/PageTitle";
import PostItem from "@/components/ui/posts/PostItem";
import Pagination from "@/components/ui/posts/Pagination";

type PostsProps = {
  searchParams: {
    page?: string;
    sort?: "ASC" | "DESC";
  };
};

export default async function Posts({ searchParams }: PostsProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : (1 as number);
  const { total, data: posts } = await getAllPosts({ page });

  return (
    <div>
      <PageTitle title="Posts" />
      <ul className="flex flex-col gap-6">
        {posts.map(({ data }, idx) => (
          <PostItem key={data.slug} {...data} />
        ))}
      </ul>
      <div className="w-full flex justify-center my-10">
        <Pagination total={total} current={page} />
      </div>
    </div>
  );
}
