"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/cn-utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  /**
   * The Portal component renders the tooltip into the document body
   * rather than the local DOM sequence. This prevents CSS stacking contexts
   * (like `scale`, `opacity`, or `overflow: hidden`) from trapping the tooltip
   * behind other elements like fixed headers or filter bars.
   */
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 opacity-100",
        className
      )}
      collisionBoundary={document.body}
      sideOffset={sideOffset}
      {...props}
    />
  </TooltipPrimitive.Portal>
  // <TooltipPrimitive.Arrow className="fill-border z-10" />
  // {children}
  // </TooltipPrimitive.Content>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
