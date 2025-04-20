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
  const base = ["text-mb-h1", "text-neon-green-100", "font-fira", "font-bold", "capitalize"];

  const linkStyle = cva(base, {
    variants: {
      isCurrent: {
        true: ["text-neon-blue-100", "dark:text-neon-green-100", "underline", "underline-offset-6"],
        false: ["text-text-gray"],
      },
    },
  });

  return (
    <Link onClick={onClick} href={`/${title}`} className={cn(linkStyle({ isCurrent }), className)}>
      {title}
    </Link>
  );
}
