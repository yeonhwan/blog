import React from "react";

export default function StagePrompt({
  children,
  stage,
}: React.PropsWithChildren & { stage: number }) {
  return React.Children.map(children, (child, idx) => {
    if (!React.isValidElement(child)) return;
    if (idx < stage) {
      return React.cloneElement(child);
    }
  });
}
