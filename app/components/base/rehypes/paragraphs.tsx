import { HTMLAttributes } from "react";
import { BaseHTMLProps } from "./MarkdownComponents";

type PargraphProps = HTMLAttributes<HTMLParagraphElement>;

export const Pargraph = ({ children, ...props }: PargraphProps) => {
  return (
    <p
      className="text-mb-content-p text-text-white font-light leading-base-line-height font-nbg my-2"
      {...props}
    >
      {children}
    </p>
  );
};

export const Bold = ({ children, ...props }: BaseHTMLProps) => {
  return (
    <strong
      className="text-mb-content-p font-bold text-text-white leading-base-line-height font-nbg"
      {...props}
    >
      {children}
    </strong>
  );
};

export const Italic = ({ children, ...props }: BaseHTMLProps) => {
  return (
    <em
      className="text-mb-content-p italic text-text-white leading-base-line-height font-nbg"
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
      className="text-mb-content-p line-through text-text-white leading-base-line-height font-nbg"
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
      className="italic bg-sub-gray/20 pr-[0.5em] flex relative before:inline-block before:w-[0.5em] before:bg-neon-green-400 before:mr-[0.5em]"
      {...props}
    >
      {children}
    </blockquote>
  );
};
