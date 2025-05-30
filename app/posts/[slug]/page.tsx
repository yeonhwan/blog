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
  const {
    post: { data },
  } = post;

  return {
    title: `YH_Blog :: ${data.title}`,
    description: `YH_Blog :: ${data.excerpt}`,
    openGraph: {
      type: "article",
      title: data.title,
      description: data.excerpt,
      url: `${process.env.HOST}/posts/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data } = await getAllPosts({ ssg: true });
  return data.map((item) => ({
    slug: item.post.data.slug,
  }));
}

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const data = await getPostBySlug({ postSlug: decodedSlug });
  if (!data) notFound();
  const {
    post: { data: meta, content },
  } = data;

  return (
    <main className="flex flex-col gap-4 min-h-mb-main-y tablet:min-h-tb-main-y">
      <section>
        <PostHead {...meta} />
        <MarkdownRenderer source={content} />
        <nav className="flex w-full items-center border-t border-dashed border-t-sub-gray/30 mt-24 pt-5 laptop:mt-40 laptop:pt-10 justify-between">
          <Link href="/" className="flex items-center gap-1 laptop:text-dt-base">
            <ChevronLeftIcon className="w-4 h-4 laptop:w-6 laptop:h-6" />
            <p>All Posts</p>
          </Link>
        </nav>
      </section>
    </main>
  );
}
