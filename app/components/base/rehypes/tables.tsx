import { HTMLAttributes } from "react";

type TableCellProps = HTMLAttributes<HTMLTableCellElement>;
const TH = ({ children, ...props }: TableCellProps) => (
  <th
    className="border border-sub-gray/50 bg-neon-blue-200/30 dark:bg-neon-green-400/30 text-mb-content-p laptop:text-dt-content-p"
    {...props}
  >
    {children}
  </th>
);

const TD = ({ children, ...props }: TableCellProps) => (
  <td
    className="border border-sub-gray/30 text-center text-mb-content-p laptop:text-dt-content-p"
    {...props}
  >
    {children}
  </td>
);

export { TH, TD };
