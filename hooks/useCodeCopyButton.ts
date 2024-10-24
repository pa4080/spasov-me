/**
 * `useCodeCopyButton` is a React Hook that add copy button to the pre tags.
 */
import { useEffect } from "react";

export function useCodeCopyButton() {
	useEffect(() => {
		const allPreTags = document.querySelectorAll("pre");

		allPreTags.forEach(async (pre) => {
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
					navigator.clipboard.writeText(
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
		});

		return () => {};
	}, []);
}
