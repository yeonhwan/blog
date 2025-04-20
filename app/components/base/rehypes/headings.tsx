import { HTMLAttributes } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const H1 = ({ children, ...props }: HeadingProps) => {
  return (
    <h1
      className="text-mb-content-h1 leading-[2.5] laptop:text-dt-content-h1 text-neon-green-100"
      {...props}
    >
      {children}
    </h1>
  );
};

export const H2 = ({ children, ...props }: HeadingProps) => {
  return (
    <h2
      className="text-mb-content-h2 leading-[2] laptop:text-dt-content-h2 text-neon-green-100 font-nbg"
      {...props}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ children, ...props }: HeadingProps) => {
  return (
    <h3
      className="text-mb-content-h3 leading-[1.8] laptop:text-dt-content-h3 text-neon-green-200 font-nbg"
      {...props}
    >
      {children}
    </h3>
  );
};

export const H4 = ({ children, ...props }: HeadingProps) => {
  return (
    <h4
      className="text-mb-content-h4 leading-[1.6] laptop:text-dt-content-h4 text-neon-green-300 font-nbg"
      {...props}
    >
      {children}
    </h4>
  );
};
