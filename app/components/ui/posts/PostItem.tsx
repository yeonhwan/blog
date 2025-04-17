import Link from "next/link";
import { PostMeta } from "@/types/posts";

export default function PostItem({
  title,
  excerpt,
  date,
  slug,
  tags,
}: PostMeta) {
  const postDate = new Date(date).toLocaleDateString("ko-KR");
  const excerptDefault = "Happy Hacking! 😎";
  return (
    <article className="border-b border-b-sub-gray/20">
      <div className="flex flex-col pb-5">
        <p className="text-sub-gray text-mb-sub font-light">{postDate}</p>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <PostTag key={slug + tag} tagName={tag} />
          ))}
        </div>
        <div className="flex flex-col">
          <Link
            href={`/posts/${slug}`}
            className="text-text-white text-mb-h2 font-bold"
          >
            {title}
          </Link>
          <p className="text-sub-gray text-mb-sub font-light">
            {excerpt || excerptDefault}
          </p>
        </div>
      </div>
    </article>
  );
}

const PostTag = ({ tagName }: { tagName: string }) => {
  return (
    <Link href={`/posts?tag=${tagName}`}>
      <p className="text-mb-sub text-neon-cyan-100 font-light">{tagName}</p>
    </Link>
  );
};
