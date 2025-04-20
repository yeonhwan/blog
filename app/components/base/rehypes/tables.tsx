import { HTMLAttributes } from "react";

type TableCellProps = HTMLAttributes<HTMLTableCellElement>;
const TH = ({ children, ...props }: TableCellProps) => (
  <th className="border border-sub-gray/50 bg-neon-green-400/30" {...props}>
    {children}
  </th>
);

const TD = ({ children, ...props }: TableCellProps) => (
  <td className="border border-sub-gray/30 text-center" {...props}>
    {children}
  </td>
);

export { TH, TD };
