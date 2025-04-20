import Link from "next/link";
import GithubIcon from "@/assets/github.svg";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col justify-center items-center min-h-footer-height bg-clean-white dark:bg-dark-ash mt-footer-margin font-light text-xs pt-4 pb-6">
      <Link
        className="flex justify-center items-center gap-1"
        href="https://github.com/yeonhwan/blog"
      >
        <span className="inline-flex items-center">© yeonhwan</span>
        <GithubIcon className="w-3 h-3 dark:fill-white fill-deep-gray" />
      </Link>
      <span className="text-[10px]">update: 2025 04 20</span>
    </footer>
  );
}
