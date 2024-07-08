/**
 * @see https://wiki.metalevel.tech/wiki/MediaWiki:Gadget-ClickToCopy.js
 * `useClearHyphens` is a React Hook that clears any hyphenation symbols
 * and codes from the currently selected text in the clipboard.
 */
import { useEffect } from "react";

export function useCopyCodeSnippets() {
	useEffect(() => {
		const detectKeys = (event: KeyboardEvent) => {
			// https://stackoverflow.com/q/5203407
			if (event.key === "Alt") {
				window.shouldCopyInnerHTML = true;
			}
		};

		// document.addEventListener("copy", cleanClipboardV3);
		document.addEventListener("keydown", detectKeys);

		return () => {
			// document.removeEventListener("copy", cleanClipboardV3);
			document.removeEventListener("keydown", detectKeys);
		};
	}, []);
}
