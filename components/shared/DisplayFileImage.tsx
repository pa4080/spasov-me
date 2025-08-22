import Image from "next/image";
import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type FileData } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";

interface Props {
  className?: string;
  className_TooltipTrigger?: string;
  file: FileData;
  sizes?: [string, string];
  description?: string;
  style?: React.CSSProperties;
}

const DisplayFileImage: React.FC<Props> = ({
  className,
  className_TooltipTrigger,
  file,
  sizes = ["160px", "320px"],
  description,
  style,
}) => {
  if (!file?.filename) {
    return null;
  }

  const TheImage = /\.(pdf|pptx|xlsx|csv|txt|docx)$/.exec(file.filename) ? (
    <Image
      priority
      alt={file.filename}
      className={cn("h-auto w-full", className)}
      height="0"
      sizes={sizes?.[0] || "160px"}
      src={`${Route.assets.MIME_TYPE}/${file.filename.split(".").pop()}.png`}
      style={style}
      width="0"
    />
  ) : (
    <Image
      priority
      alt={file.filename}
      className={cn("h-auto w-full", className)}
      height="0"
      sizes={sizes?.[1] || "320px"}
      src={
        file.metadata.html.fileUrl ?? file.metadata.html.fileUri ?? Route.assets.IMAGE_PLACEHOLDER
      }
      style={style}
      unoptimized={/\.svg$/.exec(file.filename) ? true : false}
      width="0"
    />
  );

  if (description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className={className_TooltipTrigger}>{TheImage}</TooltipTrigger>
          <TooltipContent className="border-2 border-muted-secondary dark:border-primary">
            <span>{description}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return TheImage;
};

export default DisplayFileImage;
