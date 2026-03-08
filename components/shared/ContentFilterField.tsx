"use client";

import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import IconEmbedSvg from "./IconEmbedSvg";

interface Props {
  className?: string;
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPending?: boolean;
}

const ContentFilterField: React.FC<Props> = ({ handleFilterChange, isPending, className }) => {
  const t = msgs("Common");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [searchWidth, setSearchWidth] = React.useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || containerRef.current === null) {
      return;
    }

    const initNewWidth = containerRef.current.getBoundingClientRect().width + 32;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.target.getBoundingClientRect().width + 32;

        setSearchWidth(newWidth);
      }
    });

    setSearchWidth(initNewWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={containerRef} className={cn("w-full h-8", className)}>
        <div
          className="fixed top-16 z-10 bg-background/75 backdrop-blur-sm pt-6 pb-6 px-4 -mx-4 w-auto"
          style={{
            ...(searchWidth ? { width: searchWidth } : {}),
          }}
        >
          <Input
            ref={inputRef}
            className="text-lg dark:border-foreground-quaternary dark:focus-visible:border-ring"
            placeholder={isPending ? t("loading") : t("filter")}
            onChange={handleFilterChange}
          />

          <div
            className="absolute right-6 top-7 p-2 rounded-sm hover:bg-foreground/10 active:bg-foreground/20 cursor-pointer select-none"
            onClick={() => {
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                  inputRef.current.focus();
                }
              }, 200);

              handleFilterChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <IconEmbedSvg height={16} type="broom" width={16} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentFilterField;
