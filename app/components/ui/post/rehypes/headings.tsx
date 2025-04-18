import { HTMLAttributes } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const H1 = ({ children, ...props }: HeadingProps) => {
  return (
    <h1 className="text-mb-h1 text-neon-green-100" {...props}>
      {children}
    </h1>
  );
};

export const H2 = ({ children, ...props }: HeadingProps) => {
  return (
    <h1 className="text-mb-h2 text-neon-green-200 font-nbg" {...props}>
      {children}
    </h1>
  );
};

export const H3 = ({ children, ...props }: HeadingProps) => {
  return (
    <h1 className="text-mb-base text-neon-green-200 font-nbg" {...props}>
      {children}
    </h1>
  );
};

export const H4 = ({ children, ...props }: HeadingProps) => {
  return (
    <h1 className="text-mb-base text-neon-green-300 font-nbg" {...props}>
      {children}
    </h1>
  );
};
