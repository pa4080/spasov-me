"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn-utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  tooltipText: string;
}

/**
 * Note "asChild" passing the Trigger features to the contained DIV,
 * thus we can provide children which is Button. Other wise e get the warning
 * "<button> cannot appear as a descendant of <button>""
 */
const TooltipWrapper: React.FC<Props> = ({ className, children, tooltipText }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={cn("!mt-0", className)}>
          <div>{children}</div>
        </TooltipTrigger>
        {tooltipText && (
          <TooltipContent className="border-2 border-muted-secondary dark:border-primary">
            <div dangerouslySetInnerHTML={{ __html: tooltipText }} />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
