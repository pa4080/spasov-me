/**
 * @desc 	Toggle .className from and element, selected by a querySelector.
 */
import { useEffect } from "react";

// declare global {
// 	interface Window {
// 		vhUnits: string | undefined;
// 	}
// }

interface ReturnObj {
	show: boolean;
	scrollTo: (offset?: number, timeout?: number) => void;
	readonly vh: string | undefined;
}

/**
 *
 * @param elementId // ID of the element which triggers show={false/true}
 * @returns {
 * 	show: boolean
 * 	scrollTo: (offset?: number, timeout?: number) => void
 * 	readonly vh: string
 * }
 */
export function useClassToggle(qerySelector: string): ReturnObj {
	useEffect(() => {
		const setWindowActualVhUnits = () => {
			// const existingVh = document.documentElement.style.getPropertyValue("--vh");
			const newVh = `${window.innerHeight / 100}px`;

			if (window.vhUnits !== newVh) {
				window.vhUnits = newVh;
				document.documentElement.style.setProperty("--vh", newVh);
				setVh(newVh);
			}
		};

		setWindowActualVhUnits();
		window.addEventListener("scroll", setWindowActualVhUnits);
		window.addEventListener("resize", setWindowActualVhUnits);
		window.addEventListener("orientationchange", setWindowActualVhUnits);

		const showBackToTopWindow = () => {
			const scrollFromTop = document.body.scrollTop || document.documentElement.scrollTop;

			scrollFromTop > 240 ? setShow(true) : setShow(false);
		};

		window.addEventListener("scroll", showBackToTopWindow);

		return () => {
			window.removeEventListener("scroll", setWindowActualVhUnits);
			window.removeEventListener("resize", setWindowActualVhUnits);
			window.removeEventListener("orientationchange", setWindowActualVhUnits);
			window.removeEventListener("scroll", showBackToTopWindow);
		};
	}, []);

	const scrollTo = (offset = 0, timeout = 0) => {
		setTimeout(() => {
			window && window.scrollTo({ top: offset, left: 0, behavior: "smooth" });
		}, timeout);
	};

	return {
		show,
		scrollTo,
		vh,
	};
}
