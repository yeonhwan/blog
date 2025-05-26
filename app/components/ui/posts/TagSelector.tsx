"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TagIcon from "@/assets/tag.svg";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/base/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/base/Popover";
import { useVisibilityTrigger } from "@/hooks/useVisibilityTrigger";

export default function TagSelector({
  data,
  current,
}: {
  data: string[];
  current: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(current ?? "");

  const closePopup = () => setOpen(false);
  const targetRef = useVisibilityTrigger<HTMLButtonElement>(
    {
      threshold: 0.5,
      onHidden: closePopup,
    },
    [open],
  );

  const sortedByAlphabet = data.toSorted((a, b) => a.localeCompare(b));
  const tags = sortedByAlphabet.map((tag) => ({ value: tag, label: tag }));
  tags.unshift({ value: "", label: "전체" });
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={targetRef}
          aria-expanded={open}
          className="flex w-fit min-w-30 justify-between items-center border border-sub-gray/20 px-2 py-1 rounded-sm hover:cursor-pointer"
        >
          {value || "전체"}
          <TagIcon className="opacity-50 w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 border-sub-gray/60">
        <Command>
          <CommandInput placeholder="태그 검색하기" className="h-9" />
          <CommandList>
            <CommandEmpty>태그를 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup>
              {tags?.map((tag) => (
                <CommandItem
                  className={cn(
                    value === tag.value
                      ? "text-neon-blue-100 dark:text-neon-green-100"
                      : "text-deep-gray dark:text-text-white hover:cursor-pointer",
                  )}
                  key={tag.value}
                  value={tag.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    router.push(`/?tag=${currentValue}`);
                  }}
                >
                  {tag.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
