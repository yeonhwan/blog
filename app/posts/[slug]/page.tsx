import { getPostBySlug } from "@/actions/posts";
import { MarkdownRenderer } from "@/components/ui/post/MarkdownRenderer";
import PostHead from "@/components/ui/post/PostHead";
import { notFound } from "next/navigation";
import ChevronLeftIcon from "@/assets/chevron_left.svg";
import Link from "next/link";

type PostProps = {
  params: { slug: string };
};

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug({ postSlug: decodedSlug });
  if (!post) notFound();
  const { data, content } = post;

  return (
    <div className="flex flex-col gap-4">
      <PostHead {...data} />
      <MarkdownRenderer source={content} />
      <div className="flex w-full items-center border-t border-dashed border-t-sub-gray/30 mt-24 pt-5 justify-between">
        <Link href="/posts" className="flex items-center gap-1">
          <ChevronLeftIcon className="w-4 h-4" />
          <p>All Posts</p>
        </Link>
        <div className="text-xs">Issue on Github</div>
      </div>
    </div>
  );
}
