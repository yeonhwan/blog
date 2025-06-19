import Link from "next/link";
import ArrowDoublIcon from "@/assets/arrows_double.svg";
import { cva } from "class-variance-authority";

export default function Pagination({ total, current }: { total: number; current: number }) {
  if (total < 1 || current <= 0 || current > total) throw new Error("Invalid page number");

  const MAX_PAGE_COUNT = 5;
  const pageStart = Math.floor((current - 1) / MAX_PAGE_COUNT) * MAX_PAGE_COUNT + 1;
  const pageEnd = total - pageStart >= MAX_PAGE_COUNT ? pageStart + MAX_PAGE_COUNT - 1 : total;
  const pageCount = pageEnd - pageStart + 1;
  const pages = Array.from({ length: pageCount }, (_, i) => pageStart + i);

  const isNextIcon = pages[pages.length - 1] >= total;
  const isPrevIcon = pages[0] <= 1;

  const pageStyle = cva(["text-mb-sub"], {
    variants: {
      current: {
        true: ["text-neon-blue-100", "dark:text-neon-green-100", "pointer-events-none"],
        false: ["text-sub-gray", "pointer-events-auto"],
      },
    },
  });

  return (
    <div className="flex space-between items-center w-max gap-3">
      <PageJumpButon disable={isPrevIcon} isPrev={true} to={pageStart - 1} />
      {pages.map((page) => (
        <Link
          key={"page" + page}
          className={pageStyle({ current: page === current })}
          href={`/?page=${page}`}
        >
          {page}
        </Link>
      ))}
      <PageJumpButon disable={isNextIcon} isPrev={false} to={pageEnd + 1} />
    </div>
  );
}

const PageJumpButon = ({
  isPrev,
  to,
  disable,
}: {
  isPrev: boolean;
  to: number;
  disable: boolean;
}) => {
  const arrowIconStyle = cva([], {
    variants: {
      isPrev: {
        true: [],
        false: ["rotate-180"],
      },
      disable: {
        true: ["hidden"],
        false: ["block"],
      },
    },
  });

  return (
    <Link href={`/?page=${to}`}>
      <ArrowDoublIcon className={arrowIconStyle({ isPrev, disable })} />
    </Link>
  );
};
