"use client";

import { Tooltip } from "@radix-ui/react-tooltip";
import React, { useCallback, useEffect, useRef } from "react";

import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

interface Props {
  className?: string;
}

const BackToTop: React.FC<Props> = ({ className }) => {
  const t = msgs("Footer");
  const { isAbove3xl } = useBreakpoint("3xl");
  const distanceFromTop = 200;
  const btnRef = useRef<HTMLButtonElement>(null);

  // Show/hide scroll button on scroll
  useEffect(() => {
    const btn = btnRef.current;
    const content = document.querySelector("#content main");

    if (!btn || !content) {
      return;
    }

    let tickingBelow = false;
    let tickingAbove = false;

    const showHideScrollButton_BelowSm = () => {
      if (!tickingBelow) {
        tickingBelow = true;
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > distanceFromTop;

          btn.style.transform = scrolled ? "translateY(-8px)" : "translateY(42px)";
          tickingBelow = false;
        });
      }
    };

    const showHideScrollButton_AboveSm = () => {
      if (!tickingAbove) {
        tickingAbove = true;
        requestAnimationFrame(() => {
          const scrolled = content.scrollTop > distanceFromTop;

          btn.style.transform = scrolled ? "translateY(-8px)" : "translateY(42px)";
          tickingAbove = false;
        });
      }
    };

    window.addEventListener("scroll", showHideScrollButton_BelowSm, { passive: true });
    content.addEventListener("scroll", showHideScrollButton_AboveSm, { passive: true });

    return () => {
      window.removeEventListener("scroll", showHideScrollButton_BelowSm);
      content.removeEventListener("scroll", showHideScrollButton_AboveSm);
    };
  }, []);

  // Toggle footer animation on scroll
  useEffect(() => {
    let prevScrollPosition = window.scrollY;
    const footer = document.querySelector("footer");

    if (!footer) {
      return;
    }

    let tickingFooter = false;
    const fromTop = 200;
    const fromBottom = 300;

    const handleScroll = () => {
      if (!tickingFooter) {
        tickingFooter = true;
        requestAnimationFrame(() => {
          const currentScrollPosition = window.scrollY;
          const isScrollingUp = currentScrollPosition < prevScrollPosition;

          if (currentScrollPosition > fromTop && !isScrollingUp) {
            if (
              window.innerHeight + currentScrollPosition <
              document.body.scrollHeight - fromBottom
            ) {
              footer.style.transform = "translateY(120%)";
            } else {
              footer.style.transform = "translateY(0)";
            }
          } else if (isScrollingUp) {
            footer.style.transform = "translateY(0)";
          }

          prevScrollPosition = currentScrollPosition;
          tickingFooter = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle the button click and scroll to top
  const handleScrollToTop = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      const target = document.querySelector("#scroll-to-top");
      const navbar = document.querySelector("#top-navbar");

      if (target && isAbove3xl) {
        target.scrollIntoView({ behavior: "smooth" });
      } else if (navbar) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [isAbove3xl]
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          ref={btnRef}
          className={cn(
            "fixed -bottom-1 sm:bottom-0 right-1 sm:right-2 group flex items-center justify-center cursor-pointer rounded-md border border-transparent sm:hover:border-secondary/80 select-none transition-all duration-300 w-8 sm:w-10",
            className
          )}
          style={{
            transform: "translateY(42px)",
            zIndex: 15,
          }}
          onClick={handleScrollToTop}
        >
          <div className="relative w-10 h-10">
            <IconEmbedSvg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-1 group-hover:opacity-0 transition-opacity group-hover:duration-500 duration-300 z-2"
              type="rocket"
            />
            <IconEmbedSvg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity group-hover:duration-300 duration-500 z-1"
              type="rocket-launch"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="border-2 border-muted-secondary dark:border-primary">
          {t("btn_backToTop")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BackToTop;
