"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    shouldAutoScroll: boolean;
  }
}

export function useScrollToAboutEntry() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      const idType = id.replace(/_.*$/, "");

      switch (idType) {
        case "project": {
          // Portfolio projects
          setTimeout(() => {
            router.replace(`${pathname}`);

            setTimeout(() => {
              window.location.hash = id;
            }, 50);
          }, 100);

          break;
        }

        case "lab": {
          // Portfolio projects
          setTimeout(() => {
            const url = new URL(window.location.href);

            url.searchParams.delete("id");
            window.history.replaceState({}, "", url.toString());

            setTimeout(() => {
              window.location.hash = id;
            }, 50);
          }, 100);

          break;
        }

        case "post": {
          // Blog posts
          setTimeout(() => {
            router.replace(`${pathname}`);

            setTimeout(() => {
              window.location.hash = id;
            }, 50);
          }, 100);

          break;
        }

        case "entry": {
          // About entries
          setTimeout(() => {
            const entry = document.getElementById(id);

            if (!entry) {
              return;
            }

            const section = entry.closest(".list-section");
            const sectionToggleButton = section?.querySelector(".section-toggle-collapsible > div");

            setTimeout(() => {
              if (sectionToggleButton && !section?.classList.contains("auto-expand")) {
                section?.classList.add("auto-expand");
                (sectionToggleButton as HTMLElement).click(); // entry.scrollIntoView({ behavior: "smooth" });

                const entryButton = entry.querySelector(".icon_accent_primary > button")!;

                if (entryButton) {
                  setTimeout(() => {
                    (entryButton as HTMLElement).click();
                  }, 100);
                }
              }
            }, 100);
          }, 100);

          break;
        }

        default: {
          break;
        }
      }
    } else if (window) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname, router, searchParams]);
}
