import { getPostBySlug } from "@/actions/posts";
import { MarkdownRenderer } from "@/components/ui/post/MarkdownRenderer";
import PostHead from "@/components/ui/post/PostHead";
import { notFound } from "next/navigation";

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
    </div>
  );
}
