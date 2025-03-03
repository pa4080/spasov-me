"use client";

/**
 * `useCodeCopyButton` is a React Hook that adds copy buttons to pre tags.
 * It will re-run whenever the uri changes.
 */
import { useEffect } from "react";

export function useCodeCopyButton(uri?: string) {
  useEffect(() => {
    const allPreTags = document.querySelectorAll("pre");

    // Store references to the buttons we add for cleanup
    const addedButtons: HTMLButtonElement[] = [];

    void Promise.all(
      Array.from(allPreTags).map(async (pre: HTMLPreElement) => {
        // Skip if this pre tag already has a copy button
        if (pre.querySelector(".code-copy-button")) {
          return;
        }

        const button = document.createElement("button");
        const icon = document.createElement("div");
        const response = await fetch("/assets/icons/ui/clipboard-prescription-fill.svg?v=1");
        const svg = await response.text();

        button.className = "code-copy-button";
        button.ariaLabel = "Copy code";
        icon.className = "code-copy-button-icon";
        icon.innerHTML = svg;
        button.appendChild(icon);

        button.addEventListener("click", () => {
          if (pre.textContent) {
            void navigator.clipboard.writeText(
              pre.textContent
                .replace(/&shy;/g, "")
                .replace(/\u00AD/gi, "")
                .replace(/\u200B/gi, "")
                .trim() + "\n"
            );
          }
        });

        pre.classList.add("code-copy-button-handled");
        pre.appendChild(button);
        addedButtons.push(button);
      })
    );

    // Proper cleanup function to remove buttons when the effect re-runs
    return () => {
      addedButtons.forEach((button) => {
        button.remove();
      });

      // Optionally remove the handled class if you want to start fresh
      allPreTags.forEach((pre) => {
        pre.classList.remove("code-copy-button-handled");
      });
    };
  }, [uri]);
}
