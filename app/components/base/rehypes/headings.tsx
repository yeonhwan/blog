import { HTMLAttributes } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

const idGen = (text: string) => {
  return text
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "");
};

export const H1 = ({ children, ...props }: HeadingProps) => {
  const id = idGen(children as string);
  return (
    <h1
      id={id}
      className="text-mb-content-h1 leading-[1.8] my-4 laptop:text-dt-content-h1 text-neon-blue-100 dark:text-neon-green-100"
      {...props}
    >
      {children}
    </h1>
  );
};

export const H2 = ({ children, ...props }: HeadingProps) => {
  const id = idGen(children as string);
  return (
    <h2
      id={id}
      className="text-mb-content-h2 leading-[1.8] my-4 laptop:text-dt-content-h2 text-neon-blue-100 dark:text-neon-green-100 font-sans"
      {...props}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ children, ...props }: HeadingProps) => {
  const id = idGen(children as string);
  return (
    <h3
      id={id}
      className="text-mb-content-h3 leading-[1.7] my-4 laptop:text-dt-content-h3 text-neon-blue-100 dark:text-neon-green-100 font-sans"
      {...props}
    >
      {children}
    </h3>
  );
};

export const H4 = ({ children, ...props }: HeadingProps) => {
  const id = idGen(children as string);
  return (
    <h4
      id={id}
      className="text-mb-content-h4 leading-[1.6] my-4 laptop:text-dt-content-h4 font-semibold text-neon-blue-200 dark:text-neon-green-200 font-sans"
      {...props}
    >
      {children}
    </h4>
  );
};
