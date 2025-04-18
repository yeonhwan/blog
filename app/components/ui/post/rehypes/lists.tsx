import { HTMLAttributes } from "react";

type UlProps = HTMLAttributes<HTMLUListElement>;

export const UL = ({ children, ...props }: UlProps) => {
  return (
    <ul className="text-mb-base text-text-white pl-2 my-2" {...props}>
      {children}
    </ul>
  );
};

export const OL = ({ children, ...props }: UlProps) => {
  return (
    <ol className="text-mb-base text-text-white pl-2 my-2" {...props}>
      {children}
    </ol>
  );
};

type LiProps = HTMLAttributes<HTMLLIElement>;

export const LI = ({ children, className, ...props }: LiProps) => {
  return (
    <li
      className={`text-mb-base text-text-white list-none before:w-4 before:h-4 before:pr-2 before:align-middle before:-translate-y-2 before:font-fira before:text-mb-sub ${className}`}
      {...props}
    >
      {children}
    </li>
  );
};
