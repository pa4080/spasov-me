"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useClickButtonByDomId() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const id = searchParams.get("id");

		if (!id) {
			return;
		}

		const button = document.getElementById(id);

		if (button) {
			button.focus();
			button.click();
			button.blur();

			setTimeout(() => {
				const url = new URL(window.location.href);

				url.searchParams.delete("id");
				window.history.replaceState({}, "", url.toString());
			}, 1000);
		}
	}, [searchParams]);
}
