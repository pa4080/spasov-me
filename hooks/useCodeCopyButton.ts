"use client";

import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

import "./useCodeCopyButton.css";

const svgClipboard =
  '<svg class="transition-all duration-200 hover:scale-105 active:scale-90 z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100" fill="inherit" height="22" viewBox="0 0 448 512" width="22" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;"><path class="fill-accent" d="M128 128H48c-26.5 0-48 21.5-48 48V464c0 26.5 21.5 48 48 48H272c26.5 0 48-21.5 48-48V416H256v32H64V192h64V128z"></path><path class="fill-accent" d="M160 48c0-26.5 21.5-48 48-48H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48z"></path></svg>';
const svgClipboardChecked =
  '<svg class="transition-all duration-200 hover:scale-105 drop-shadow-sm opacity-100" fill="inherit" height="28" viewBox="0 0 512 512" width="28" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;"><path class="fill-primary" d="M369 175c9.4 9.4 9.4 24.6 0 33.9L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0z"></path><path class="fill-accent" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>';

type AddCopyButtonsParams = {
  allPreTags: NodeListOf<HTMLPreElement>;
  addedButtons: HTMLElement[];
};

/**
 * `useCodeCopyButton` is a React Hook that adds copy buttons to pre tags.
 * It will re-run whenever the uri changes.
 */
export default function useCodeCopyButton() {
  const pathname = usePathname();

  const addCopyButtons = useEffectEvent(({ allPreTags, addedButtons }: AddCopyButtonsParams) => {
    void Promise.all(
      Array.from(allPreTags).map(async (pre: HTMLPreElement) => {
        // Skip if this pre tag already has a copy button
        if (pre.querySelector(".code-copy-button")) {
          return;
        }

        const button = document.createElement("div");
        const buttonInner = document.createElement("div");
        const icon = document.createElement("div");

        button.className = "code-copy-button dark";
        button.ariaLabel = "Copy code";
        buttonInner.className = "code-copy-button-inner";
        icon.className = "code-copy-button-icon";
        icon.innerHTML = svgClipboard;
        buttonInner.appendChild(icon);
        button.appendChild(buttonInner);

        button.addEventListener("click", () => {
          if (pre.textContent) {
            void navigator.clipboard.writeText(
              pre.textContent
                .replace(/&shy;/g, "")
                .replace(/\u00AD/gi, "")
                .replace(/\u200B/gi, "")
                .trim() + "\n"
            );

            icon.innerHTML = svgClipboardChecked;
            button.classList.add("code-copy-button-copied");
            setTimeout(() => {
              button.classList.remove("code-copy-button-copied");
              icon.innerHTML = svgClipboard;
            }, 1800);
          }
        });

        pre.classList.add("code-copy-button-handled");
        pre.appendChild(button);
        addedButtons.push(button);
      })
    );
  });

  useEffect(() => {
    const addedButtons: HTMLElement[] = [];

    // Process any pre tags already in the DOM
    const allPreTags = document.querySelectorAll("pre");

    addCopyButtons({ allPreTags, addedButtons });

    // Watch for pre tags streamed/injected into the DOM after initial render
    const observer = new MutationObserver((mutations) => {
      let hasNewPre = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;

            if (el.tagName === "PRE" || el.querySelector("pre")) {
              hasNewPre = true;
              break;
            }
          }
        }

        if (hasNewPre) {
          break;
        }
      }

      if (hasNewPre) {
        const allPreTags = document.querySelectorAll("pre");

        addCopyButtons({ allPreTags, addedButtons });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      addedButtons.forEach((button) => button.remove());
      document.querySelectorAll("pre").forEach((pre) => {
        pre.classList.remove("code-copy-button-handled");
      });
    };
  }, [pathname]);
}
