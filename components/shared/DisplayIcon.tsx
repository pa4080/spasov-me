"use client";
import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type IconsMap } from "@/interfaces/IconsMap";
import { cn } from "@/lib/cn-utils";

interface Props {
  className?: string;
  className_TooltipTrigger?: string;
  icon: IconsMap[string];
  size?: number;
  description?: string;
  unoptimized?: boolean;
  onClick?: () => void;
}

const DisplayIcon: React.FC<Props> = ({
  className,
  className_TooltipTrigger,
  icon,
  size = 30,
  description,
  unoptimized = true,
  onClick,
}) => {
  const { theme } = useTheme();
  const height = size;
  const width = Math.ceil(height * icon?.info?.ratio) || height;

  const classNameGenerated = cn(
    "hover:bg-muted-secondary dark:hover:bg-primary-foreground/20 py-1 px-1 transition-colors hover:transition-colors duration-200 rounded-sm hover:saturate-150",
    className
  );

  const TheImage = (
    <Image
      priority
      alt={icon?.name || "Icon"}
      className={classNameGenerated}
      height={height}
      src={
        theme === "dark"
          ? icon?.uri?.dark || "/assets/icons/placeholder.svg"
          : icon?.uri?.light || "/assets/icons/placeholder.svg"
      }
      style={{ width, height, minWidth: height }}
      unoptimized={unoptimized}
      width={width}
    />
  );

  if (description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className={className_TooltipTrigger} onClick={onClick}>
            {TheImage}
          </TooltipTrigger>
          <TooltipContent className="border-2 border-muted-secondary dark:border-primary">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return TheImage;
};

export default DisplayIcon;
