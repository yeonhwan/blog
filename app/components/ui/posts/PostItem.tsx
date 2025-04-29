import Link from "next/link";
import { PostMeta } from "root/types";
import { getDateStringFromDate } from "@/lib/utils";

export default function PostItem({ title, excerpt, date, slug, tags }: PostMeta) {
  const postDate = getDateStringFromDate(date);
  const excerptDefault = "Happy Hacking! 😎";
  return (
    <li className="border-b border-b-sub-gray/20">
      <article className="flex flex-col pb-5">
        <time
          dateTime={new Date(postDate).toISOString()}
          className="text-sub-gray text-mb-sub font-light"
        >
          {postDate}
        </time>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <PostTag key={slug + tag} tagName={tag} />
          ))}
        </div>
        <div className="flex flex-col">
          <Link
            href={`/posts/${slug}`}
            className="text-deep-gray dark:text-text-white text-mb-h2 font-bold"
          >
            {title}
          </Link>
          <p className="text-sub-gray text-mb-sub font-light">{excerpt || excerptDefault}</p>
        </div>
      </article>
    </li>
  );
}

export const PostTag = ({ tagName }: { tagName: string }) => {
  return (
    <Link href={`/posts?tag=${tagName}`}>
      <p className="text-mb-sub text-neon-indigo-100 dark:text-neon-cyan-100 font-light">
        {tagName}
      </p>
    </Link>
  );
};
