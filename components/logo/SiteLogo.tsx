import React from "react";

import { cn } from "@/lib/cn-utils";

import SvgLogo from "./SvgLogo";
import SvgLogoBreak from "./SvgLogoBreak";

interface Props {
	className?: string;
	greeting_ln1?: string;
	greeting_ln2?: string;
	hover?: boolean;
	gray?: boolean;
	style?: React.CSSProperties;
	autoBreak?: boolean;
	manualBreak?: boolean;
}

const SiteLogo: React.FC<Props> = ({
	className,
	greeting_ln1,
	greeting_ln2,
	hover,
	gray,
	style,
	autoBreak = true,
	manualBreak = false,
}) => {
	const displayText = !!(greeting_ln1 || greeting_ln2);

	return (
		<div
			className={cn("flex justify-center items-center relative", "w-36", className)}
			style={displayText ? { containerType: "inline-size", ...style } : { ...style }}
		>
			<div className="w-full relative">
				{displayText && (
					<div
						className={cn(
							"absolute z-1 font-unicephalon text-foreground-secondary tracking-menu-items",
							"top-0 right-[0.6em] xa:right-[2cqw] ml:right-3",
							"text-[6cqw] 3xs:text-[4.5cqw] xa:text-[3.5cqw]"
						)}
					>
						{greeting_ln1 && <span>{greeting_ln1}</span>}
						{greeting_ln2 && <span className="hidden xa:inline-block"> {greeting_ln2}</span>}
					</div>
				)}
				<div className={displayText ? "emphasize_drop_shadow" : ""}>
					<SvgLogo
						className={`${
							autoBreak && !manualBreak ? "hidden xa:block" : manualBreak ? "hidden" : "block"
						} ${displayText ? "p-4" : "p-0"}`}
						gray={gray}
						hover={hover}
					/>
					<SvgLogoBreak
						className={`${
							autoBreak && !manualBreak ? "block xa:hidden" : manualBreak ? "block" : "hidden"
						} ${displayText ? "p-4" : "p-0"}`}
						gray={gray}
						hover={hover}
					/>
				</div>
			</div>
		</div>
	);
};

export default SiteLogo;
