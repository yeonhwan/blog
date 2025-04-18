import { HTMLAttributes } from "react";

type HrProps = HTMLAttributes<HTMLHRElement>;

export const Hr = ({ children, ...props }: HrProps) => {
  return (
    <hr className="border-sub-gray/50 my-10" {...props}>
      {children}
    </hr>
  );
};
