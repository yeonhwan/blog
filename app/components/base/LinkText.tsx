import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LinkText({
  isCurrent,
  title,
  className,
  onClick,
}: {
  isCurrent: boolean;
  className?: string;
  title: string;
  onClick?: () => void;
}) {
  const base = ["font-mono", "font-bold", "capitalize"];

  const linkStyle = cva(base, {
    variants: {
      isCurrent: {
        true: ["text-neon-blue-100", "dark:text-neon-green-100", "underline", "underline-offset-6"],
        false: ["text-text-gray"],
      },
    },
  });

  const href = title === "posts" ? "/" : `/${title}`;

  return (
    <Link onClick={onClick} href={href} className={cn(linkStyle({ isCurrent }), className)}>
      {title}
    </Link>
  );
}
