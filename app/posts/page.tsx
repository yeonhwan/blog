import { getAllPosts, getAllTags } from "@/actions/posts";
import PageTitle from "@/components/ui/PageTitle";
import PostItem from "@/components/ui/posts/PostItem";
import TagSelector from "@/components/ui/posts/TagSelector";
import Pagination from "@/components/ui/posts/Pagination";

type PostsProps = {
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PostsProps) {
  const { tag, page } = await searchParams;

  if (!tag) {
    return {
      title: `YH_Blog :: Posts`,
      description: `YH_Blog :: All Posts page ${page}`,
      openGraph: {
        type: "article",
        title: `YH_Blog :: Posts`,
        description: `All Posts`,
        url: `https://example.com/posts?page=${page}`,
      },
      alternates: {
        canonical: `https://example.com/posts/page=${page}`,
      },
    };
  }

  return {
    title: `YH_Blog :: ${tag} Posts`,
    description: `YH_Blog :: All Posts about ${tag}`,
    openGraph: {
      type: "article",
      title: `YH_Blog :: ${tag} Posts`,
      description: `YH_Blog :: All Posts about ${tag}`,
      url: `https://example.com/posts?tag=${tag}&page=${page}`,
    },
    alternates: {
      canonical: `https://example.com/posts/tag=${tag}/page=${page}`,
    },
  };
}

export default async function Posts({ searchParams }: PostsProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : (1 as number);
  const tag = params.tag;
  const { total, data: posts } = await getAllPosts({ page, tag });
  const tags = await getAllTags();

  return (
    <main className="min-h-mb-main-y tablet:min-h-tb-main-y">
      <PageTitle title="Posts" />
      <div className="flex w-full justify-end mb-10">
        <TagSelector key={tag} current={tag} data={tags} />
      </div>
      <ul className="flex flex-col gap-6">
        {posts.map(({ post }) => (
          <PostItem key={post.data.slug} {...post.data} />
        ))}
      </ul>
      <footer className="w-full flex justify-center my-10">
        <Pagination total={total} current={page} />
      </footer>
    </main>
  );
}
