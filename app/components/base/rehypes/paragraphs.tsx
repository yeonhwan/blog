import { HTMLAttributes } from "react";
import { BaseHTMLProps } from "./MarkdownComponents";

type PargraphProps = HTMLAttributes<HTMLParagraphElement>;

export const Pargraph = ({ children, ...props }: PargraphProps) => {
  return (
    <p
      className="text-mb-content-p laptop:text-dt-content-p text-deep-gray dark:text-text-white font-light leading-base-line-height font-sans my-2"
      {...props}
    >
      {children}
    </p>
  );
};

export const Bold = ({ children, ...props }: BaseHTMLProps) => {
  return (
    <strong
      className="text-mb-content-p laptop:text-dt-content-p font-bold text-deep-gray dark:text-text-white leading-base-line-height font-sans"
      {...props}
    >
      {children}
    </strong>
  );
};

export const Italic = ({ children, ...props }: BaseHTMLProps) => {
  return (
    <em
      className="text-mb-content-p laptop:text-dt-content-p italic text-deep-gray dark:text-text-white leading-base-line-height font-sans"
      {...props}
    >
      {children}
    </em>
  );
};

type ModProps = HTMLAttributes<HTMLModElement>;
export const StrThrough = ({ children, ...props }: ModProps) => {
  return (
    <del
      className="text-mb-content-p laptop:text-dt-content-p line-through opacity-30 text-deep-gray dark:text-text-white leading-base-line-height font-sans"
      {...props}
    >
      {children}
    </del>
  );
};

type BlockQuoteProps = HTMLAttributes<HTMLQuoteElement>;

export const BlockQuote = ({ children, ...props }: BlockQuoteProps) => {
  return (
    <blockquote
      className="italic bg-text-gray/20 dark:bg-sub-gray/20 pr-[0.5em] laptop:text-dt-content-p flex relative before:inline-block before:w-[0.5em] before:bg-neon-blue-200 dark:before:bg-neon-green-400 before:mr-[0.5em]"
      {...props}
    >
      {children}
    </blockquote>
  );
};
