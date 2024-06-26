/**
 * @desc 	The 'useActualVh()' hook is used set custom Viewport Height units.
 *       	This is a workaround fort the known bug of the mobile browsers 100vh.
 * 				In addition the hook exports:
 * 				- "show" property which can be used to show/hide a "back to top" button.
 * 				- "scrollTo()" function which can be used to scroll to a given top offset.
 * 				- "vh" property which is read only and returns the actual Viewport Height.
 *
 * @see 	@/app/(styles)/globals.variables.module.scss @vh($q)
 * 				@/app/globals.scss									vh(100)
 *  			@/components/sidebar/Sidebar.tsx
 * 			 	@/components/sidebar/ScrollToTop.tsx
 *
 * @ref		https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html#comment-4634921967
 *
 * @usage In a react component
 *    import { useBreakpoint } from "@/hooks/useBreakpoint";
 *    const show: boolean = useBreakpoint();
 *
 * @sass setup and usage
 *
 * 		@function vh($quantity) {
 *	 		@return calc(var(--vh, 1vh) * #{$quantity});
 *	 	};
 *
 *		selector { height: vh(100); }
 *
 * @css usage
 *
 * 		selector { height: calc(var(--vh, 1vh) * 100); }
 *
 * @see_also	The "vh" alternatives: "dvh", "svh", "lvh".
 * 	@see https://youtu.be/ru3U8MHbFFI?si=e4rJ9Sid97MpgGN0
 * 	@see https://viewport-unit-test.netlify.app/fixed
 *
 */
import { useEffect, useState } from "react";

declare global {
	interface Window {
		vhUnits: string | undefined;
	}
}

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
export function useActualVh(): ReturnObj {
	const [show, setShow] = useState(false);
	const [vh, setVh] = useState<string>();

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
