import React from "react";

import { cn } from "@/lib/cn-utils";

interface Props {
  className?: string;
}

/**
 * @see https://tailwindcss.com/docs/customizing-colors
 */
const ThemeStylePreview: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "border p-4 grid grid-cols-2 gap-4 rounded w-full max-w-3xl min-w-[320px]",
        className
      )}
    >
      {/* background; foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-background text-foreground">
        background
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-foreground text-background">
        foreground
      </div>
      {/* card; card-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-card text-card-foreground">
        card
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-card-foreground text-card">
        card-foreground
      </div>
      {/* popover; popover-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-popover text-popover-foreground">
        popover
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-popover-foreground text-popover">
        popover-foreground
      </div>
      {/* primary; primary-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-primary text-primary-foreground">
        primary
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-primary-foreground text-primary">
        primary-foreground
      </div>
      {/* secondary; secondary-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-secondary text-secondary-foreground">
        secondary
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-secondary-foreground text-secondary">
        secondary-foreground
      </div>
      {/* muted; muted-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-muted text-muted-foreground">
        muted
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-muted-foreground text-muted">
        muted-foreground
      </div>
      {/* accent; accent-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-accent text-accent-foreground">
        accent
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-accent-foreground text-accent">
        accent-foreground
      </div>
      {/* destructive; destructive-foreground */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-destructive text-destructive-foreground">
        destructive
      </div>
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-destructive-foreground text-destructive">
        destructive-foreground
      </div>

      {/* border */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-border col-span-2">
        border
      </div>
      {/* input */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-input col-span-2">
        input
      </div>
      {/* ring */}
      <div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border flex justify-center items-center bg-ring text-background col-span-2">
        ring
      </div>
    </div>
  );
};

export default ThemeStylePreview;
