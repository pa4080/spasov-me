"use client";
import { useSearchParams } from "next/navigation";

export function useScrollToAboutEntry() {
	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	if (id && window) {
		const entry = document.getElementById(id);

		if (entry) {
			const section = entry.closest(".list-section");
			const sectionToggleButton = section?.querySelector(
				".section-toggle-collapsible > div"
			) as HTMLDivElement;

			setTimeout(() => {
				if (sectionToggleButton && !section?.classList.contains("auto-expand")) {
					section?.classList.add("auto-expand");
					sectionToggleButton.click(); // entry.scrollIntoView({ behavior: "smooth" });

					const entryButton = entry.querySelector(
						".icon_accent_primary > button"
					) as HTMLButtonElement;

					if (entryButton) {
						setTimeout(() => {
							entryButton.click();
						}, 100);
					}
				}
			}, 100);
		}
	}
}
