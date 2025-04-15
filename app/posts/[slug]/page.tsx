import { getPostBySlug } from "@/actions/posts";

type PostProps = {
  params: { slug: string };
};

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug({ postSlug: decodedSlug });
  return (
    <div className="flex flex-col gap-4">
      <h2>{post.data.title}</h2>
    </div>
  );
}
