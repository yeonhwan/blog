import { getAllPosts, getPostBySlug } from "@/actions/posts";
import { MarkdownRenderer } from "@/components/ui/post/MarkdownRenderer";
import PostHead from "@/components/ui/post/PostHead";
import { notFound } from "next/navigation";
import ChevronLeftIcon from "@/assets/chevron_left.svg";
import Link from "next/link";

type PostProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug({ postSlug: decodedSlug });
  if (!post) notFound();
  const { data } = post;

  return {
    title: `YH_Blog :: ${data.title}`,
    description: `YH_Blog :: ${data.excerpt}`,
    openGraph: {
      type: "article",
      title: data.title,
      description: data.excerpt,
      url: `https://example.com/posts/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts({ ssg: true });
  return posts.data.map((post) => ({
    slug: post.data.slug,
  }));
}

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug({ postSlug: decodedSlug });
  if (!post) notFound();
  const { data, content } = post;

  return (
    <main className="flex flex-col gap-4">
      <section>
        <PostHead {...data} />
        <MarkdownRenderer source={content} />
        <nav className="flex w-full items-center border-t border-dashed border-t-sub-gray/30 mt-24 pt-5 laptop:mt-40 laptop:pt-10 justify-between">
          <Link href="/posts" className="flex items-center gap-1 laptop:text-dt-base">
            <ChevronLeftIcon className="w-4 h-4 laptop:w-6 laptop:h-6" />
            <p>All Posts</p>
          </Link>
          {/* <div className="text-xs tablet:text-base laptop:text-lg">Issue on Github</div> */}
        </nav>
      </section>
    </main>
  );
}
