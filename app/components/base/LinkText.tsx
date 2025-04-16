import { cva } from "class-variance-authority";
import Link from "next/link";

export default function LinkText({
  isCurrent,
  title,
  onClick,
}: {
  isCurrent: boolean;
  title: string;
  onClick?: () => void;
}) {
  const base = [
    "text-mb-h1",
    "text-neon-green-100",
    "font-fira",
    "font-bold",
    "capitalize",
  ];

  const linkStyle = cva(base, {
    variants: {
      isCurrent: {
        true: ["text-neon-green-100", "underline", "underline-offset-6"],
        false: ["text-text-gray"],
      },
    },
  });

  return (
    <Link
      onClick={onClick}
      href={`/${title}`}
      className={linkStyle({ isCurrent })}
    >
      {title}
    </Link>
  );
}
