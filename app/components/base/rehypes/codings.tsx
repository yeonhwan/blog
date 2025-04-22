"use client";
import { HTMLAttributes, useState, useRef } from "react";
import { BaseHTMLProps } from "./MarkdownComponents";
import CircleCheckIcon from "@/assets/circle_check.svg";
import ClipboardCopyIcon from "@/assets/clipboard_copy.svg";

type PreProps = HTMLAttributes<HTMLPreElement>;

export const Pre = ({ children, className, ...props }: PreProps) => {
  const [selected, setSelected] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const refSetter = (e: HTMLPreElement) => {
    if (!e) return;
    preRef.current = e;
    const currentLanguage = e.getAttribute("data-language");
    const languageDescriptor = e.querySelector("[data-language-descriptor]");
    if (languageDescriptor && currentLanguage) {
      languageDescriptor.textContent = currentLanguage;
    }
  };

  const copyHandler = (e: React.MouseEvent) => {
    if (!preRef.current) return;
    const copyTarget = Array.from(preRef.current.children).find((node) => node.nodeName === "CODE");
    if (!copyTarget) return;

    const content = copyTarget.textContent!;

    try {
      navigator.clipboard.writeText(content);
      setSelected(true);
      setTimeout(() => {
        setSelected(false);
      }, 2000);
    } catch {
      window.alert("Copy to clipboard is not supported in this browser.");
    }
  };

  return (
    <pre ref={refSetter} className={`group relative rounded-sm p-4 ${className}`} {...props}>
      {selected ? (
        <CircleCheckIcon className="w-mb-icon-size h-mb-icon-size absolute top-3 right-3 stroke-neon-green-100" />
      ) : (
        <ClipboardCopyIcon
          onClick={copyHandler}
          className="absolute invisible pointer-events-none top-3 right-3 w-mb-icon-size h-mb-icon-size group-focus:visible group-focus:pointer-events-auto tablet:group-hover:visible tablet:group-hover:pointer-events-auto tablet:hover:cursor-pointer"
        />
      )}
      <span data-language-descriptor="" />
      {children}
    </pre>
  );
};

export const Code = ({ children, ...props }: BaseHTMLProps) => {
  return (
    <code className="flex overflow-x-scroll" {...props}>
      {children}
    </code>
  );
};
