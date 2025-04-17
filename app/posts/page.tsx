import { getAllPosts, getAllTags } from "@/actions/posts";
import PageTitle from "@/components/ui/PageTitle";
import PostItem from "@/components/ui/posts/PostItem";
import TagSelector from "@/components/ui/posts/TagSelector";
import Pagination from "@/components/ui/posts/Pagination";

type PostsProps = {
  searchParams: {
    page?: string;
    tag?: string;
  };
};

export default async function Posts({ searchParams }: PostsProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : (1 as number);
  const tag = params.tag;
  const { total, data: posts } = await getAllPosts({ page, tag });
  const tags = await getAllTags();

  return (
    <div>
      <PageTitle title="Posts" />
      <div className="flex w-full justify-end mb-10">
        <TagSelector key={tag} current={tag} data={tags} />
      </div>
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
