/**
 * `useClearHyphens` is a React Hook that clears any hyphenation symbols
 * and codes from the currently selected text in the clipboard.
 */
import { useEffect } from "react";

declare global {
  interface Window {
    shouldCopyInnerHTML: boolean;
  }
}

export function useClearHyphens() {
  useEffect(() => {
    if (window.shouldCopyInnerHTML === undefined) {
      window.shouldCopyInnerHTML = false;
    }

    const detectKeys = (event: KeyboardEvent) => {
      if (event.key === "Alt") {
        window.shouldCopyInnerHTML = true;
      }
    };

    document.addEventListener("copy", cleanClipboardV4);
    document.addEventListener("keydown", detectKeys);

    return () => {
      document.removeEventListener("copy", cleanClipboardV4);
      document.removeEventListener("keydown", detectKeys);
    };
  }, []);
}

export const cleanClipboardV4 = (event: ClipboardEvent) => {
  const selectedRange = window.getSelection()?.getRangeAt(0);
  const selectedParent = selectedRange?.commonAncestorContainer?.parentElement;

  const isSelectedInMDEditor = !!selectedParent?.classList.contains("w-md-editor-area");
  const isSelectedEditable = !!selectedParent?.querySelector("input, textarea");

  if (isSelectedInMDEditor || isSelectedEditable) {
    return;
  }

  const tempDiv = document.createElement("div");

  tempDiv.appendChild(selectedRange?.cloneContents() ?? document.createDocumentFragment());

  const parser = new DOMParser();
  const doc = parser.parseFromString(tempDiv.innerHTML, "text/html");

  let cleanedHtml = doc.documentElement.innerHTML
    .replace(/&shy;/g, "")
    .replace(/\u00AD/gi, "")
    .replace(/\u200B/gi, "");

  // Check if the original selection was inside a <pre> tag
  const selectedNode = selectedRange?.commonAncestorContainer;
  const isInsidePre = selectedNode
    ? selectedNode.nodeType === Node.ELEMENT_NODE
      ? (selectedNode as Element).closest("pre") !== null
      : selectedNode.parentElement?.closest("pre") !== null
    : false;

  if (!isInsidePre) {
    // Apply newline replacement only outside <pre> tags in the cloned content
    const splitRegex = /(<pre[^>]*>[\s\S]*?<\/pre>)/gi;
    const parts = cleanedHtml.split(splitRegex);

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Parts outside <pre>
        parts[i] = parts[i].replace(/(<\/[a-z][a-z0-9]*>)/gi, "$1\n");
      }
    }

    cleanedHtml = parts.join("");
  }

  const cleanedDoc = parser.parseFromString(cleanedHtml, "text/html");
  const cleanedDocEl = cleanedDoc.documentElement;

  if (window.shouldCopyInnerHTML) {
    const finalHtml = cleanedDocEl.innerHTML.replace(/(\n)+/g, "\n");

    event.clipboardData?.setData("text/html", finalHtml);
  } else {
    const plainText = cleanedDocEl.innerText.replace(/(\n\s*)+/g, "\n").trim();

    event.clipboardData?.setData("text/plain", plainText);
  }

  window.shouldCopyInnerHTML = false;
  event.preventDefault();
};

/**
 * @name cleanClipboardV3, like cleanClipboardV2 ( @see blow ), removes hyphenation symbols and codes from the selected HTML.
 * However, unlike cleanClipboardV2, this version uses DOMParser to convert the cleaned string into a document.
 * This can provide more accuracy and efficiency in dealing with complex HTML structures.
 * It also preserve the original contents of the <pre> elements.
 *
 * @param event - The ClipboardEvent to handle.
 * 
export const cleanClipboardV3 = (event: ClipboardEvent) => {
  // Get the selected range
  const selectedRange = window.getSelection()?.getRangeAt(0);
  const selectedParent = selectedRange?.commonAncestorContainer?.parentElement;

  const isSelectedInMDEditor = !!selectedParent?.classList.contains("w-md-editor-area");
  const isSelectedEditable = !!selectedParent?.querySelector("input, textarea");

  if (isSelectedInMDEditor || isSelectedEditable) {
    return;
  }

  const isSelectedWithinTagPre = selectedParent?.tagName === "PRE";

  // Create a div and append the selected range's cloned contents
  const tempDiv = document.createElement("div");

  tempDiv.appendChild(selectedRange?.cloneContents() ?? document.createDocumentFragment());

  // Use DOMParser to convert string to document
  const parser = new DOMParser();
  const doc = parser.parseFromString(tempDiv.innerHTML, "text/html");

  // Find all pre elements
  const preElements = isSelectedWithinTagPre ? [selectedParent] : doc.getElementsByTagName("pre");

  // Backup innerHTML of all pre elements
  const originalPreContents: string[] = [];

  for (let i = 0; i < preElements.length; i++) {
    originalPreContents[i] =
      (preElements[i].textContent ?? "")
        .replace(/&shy;/g, "")
        .replace(/\u00AD/gi, "")
        .replace(/\u200B/gi, "")
        .trim() + "\n";
  }

  if (isSelectedWithinTagPre && originalPreContents.length === 1) {
    const cleanedDoc = parser.parseFromString(originalPreContents[0], "text/html");
    const cleanedDocEl = cleanedDoc.documentElement;

    cleanedDocEl.innerHTML = cleanedDocEl.innerHTML.replace(/(<\/[a-z][a-z0-9]*>)/gi, "$1\n");
    cleanedDocEl.innerHTML = cleanedDocEl.innerHTML.replace(/(<\/[a-z][a-z0-9]*>)/gi, "$1\n");
    const cleanedHtml = cleanedDocEl.innerText.replace(/(\n)+/g, "\n");

    event.clipboardData?.setData("text/plain", cleanedHtml);

    return;
  }

  // Replace hyphenation symbols and codes in the innerHTML, preserving HTML tags
  let cleanedHtml = doc.documentElement.innerHTML
    .replace(/&shy;/g, "")
    .replace(/\u00AD/gi, "")
    .replace(/\u200B/gi, "");

  // Convert cleaned string back to document
  const cleanedDoc = parser.parseFromString(cleanedHtml, "text/html");

  // Restore pre elements' innerHTML in cleaned document
  const cleanedPreElements = cleanedDoc.getElementsByTagName("pre");

  for (let i = 0; i < cleanedPreElements.length; i++) {
    cleanedPreElements[i].innerHTML = originalPreContents[i];
  }

  const cleanedDocEl = cleanedDoc.documentElement;

  cleanedDocEl.innerHTML = cleanedDocEl.innerHTML.replace(/(<\/[a-z][a-z0-9]*>)/gi, "$1\n");

  if (window.shouldCopyInnerHTML) {
    cleanedHtml = cleanedDocEl.innerHTML.replace(/(\n)+/g, "\n");
    event.clipboardData?.setData("text/html", cleanedHtml);
  } else {
    cleanedDocEl.innerHTML = cleanedDocEl.innerHTML.replace(/(<\/[a-z][a-z0-9]*>)/gi, "$1\n");
    cleanedHtml = cleanedDocEl.innerText.replace(/(\n)+/g, "\n");
    event.clipboardData?.setData("text/plain", cleanedHtml);
  }

  window.shouldCopyInnerHTML = false;
  event.preventDefault();
};
 */

/**
 * @name cleanClipboardV2, like cleanClipboardV1 ( @see blow ), removes hyphenation symbols and codes, but does so from the temporary div's innerHTML.
 * This preserves the structure and formatting of the selected HTML, which is then set as the new clipboard data.
 *
 * @param event - The ClipboardEvent to handle.
 *
const cleanClipboardV2 = (event: ClipboardEvent) => {
	// Get the selected range
	const selectedRange = window.getSelection()?.getRangeAt(0);

	// Create a div and append the selected range's cloned contents
	const tempDiv = document.createElement("div");

	tempDiv.appendChild(selectedRange?.cloneContents() || document.createDocumentFragment());

	// Replace hyphenation symbols and codes in the innerHTML, preserving HTML tags
	const cleanedHtml = tempDiv.innerHTML
		.replace(/&shy;/g, "")
		.replace(/\u00AD/gi, "")
		.replace(/\u200B/gi, "");

	event.clipboardData?.setData("text/html", cleanedHtml);
	event.preventDefault();
};
 */

/**
 * @name cleanClipboardV1 is a function that handles a ClipboardEvent. It retrieves the currently selected text,
 * replaces any instances of hyphenation symbols and codes with an empty string, and then sets the cleaned
 * text as the new clipboard data. The function prevents the default clipboard event behavior to ensure
 * the new clipboard data is used.
 *
 * @param event - The ClipboardEvent to handle.
 *
const cleanClipboardV1 = (event: ClipboardEvent) => {
	const selectedText = window.getSelection()?.toString() || "";

	// Replace hyphenation symbols and codes
	const cleanedText = selectedText
		.replace(/&shy;/g, "")
		.replace(/\u00AD/gi, "")
		.replace(/\u200B/gi, "");

	event.clipboardData?.setData("text/plain", cleanedText);
	event.preventDefault();
};
 */
