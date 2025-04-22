import type { PostMeta } from "@/types";
import { getDateStringFromDate } from "@/utils/common";
import { PostTag } from "@/components/ui/posts/PostItem";

export default function PostHead({ title, date, tags }: PostMeta) {
  const postDate = getDateStringFromDate(date);

  return (
    <header className="flex flex-col mt-8 pb-4 mb-8 border-b border-b-sub-gray border-dashed">
      <div className="flex flex-col gap">
        <div className="flex gap-2 items-center">
          <time
            dateTime={new Date(postDate).toISOString()}
            className="text-sub-gray text-mb-sub font-light"
          >
            {postDate}
          </time>
          <i className="text-sub-gray/50">/</i>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <PostTag key={tag} tagName={tag} />
            ))}
          </div>
        </div>
        <h1 className="text-deep-gray dark:text-text-white text-mb-h1 laptop:text-dt-h1 font-bold">
          {title}
        </h1>
      </div>
    </header>
  );
}
