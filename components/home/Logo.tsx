"use client";

import React, { useEffect, useState } from "react";

import SiteLogo_AutoBreak from "@/components/fragments/SiteLogo_AutoBreak";
import { roundTo } from "@/lib/round";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	greeting_ln1: string;
	greeting_ln2: string;
}

const HomePage_Logo: React.FC<Props> = ({ className, greeting_ln1, greeting_ln2 }) => {
	const { logoScaleFactor: scale, setLogoScaleFactor: setScale } = useAppContext();
	// const [scale, setScale] = useState<number>(0);
	const [containerHeight, setContainerHeight] = useState<number | null>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const logoRef = React.useRef<HTMLDivElement>(null);
	const containerHeightInit = 63;

	useEffect(() => {
		// https://www.30secondsofcode.org/react/s/use-event-listener/

		const scaleLogo = () => {
			if (containerRef.current && logoRef.current) {
				const containerWidth = containerRef?.current?.offsetWidth;
				const logoWidth = logoRef?.current?.offsetWidth;
				const logoRect = logoRef?.current?.getBoundingClientRect();

				const newScale = roundTo(containerWidth / logoWidth);
				const newHeight = roundTo(logoRect.height);

				setScale(newScale);
				setContainerHeight(newHeight);
			}
		};

		scaleLogo();
		setTimeout(scaleLogo, 50);

		window.addEventListener("resize", scaleLogo);

		return () => {
			window.removeEventListener("resize", scaleLogo);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn("flex w-full justify-center items-center relative", className)}
			// scale-100 mb-[18px] xs320:scale-110 xs320:mt-[1px] xs320:mb-[26px] xs:scale-125
			// xs420:my-[1px] xs:my-[8px] sm:scale-150 sm:my-[16px] md:scale-[218%] md:my-[37px]
			style={{
				transform: `scale(${scale})`,
				visibility: scale > 0 ? "visible" : "hidden",
				height: `${containerHeight ?? containerHeightInit}px`,
				zIndex: -1,
			}}
		>
			<div ref={logoRef} className="w-max h-max relative">
				<div className="absolute z-10 font-Unicephalon text-[14px] xs420:text-[12px] xs480:text-[10px] text-mlt-gray-1 right-[2px] -top-[4px] xs420:-top-[2px] tracking-menu-items">
					<span>{greeting_ln1}</span>{" "}
					<span className="hidden xs420:inline-block">{greeting_ln2}</span>
				</div>
				<div className="emphasize_drop_shadow">
					<SiteLogo_AutoBreak fontSize={42} textBreakpoint="xs420" />
				</div>
			</div>
		</div>
	);
};

export default HomePage_Logo;
