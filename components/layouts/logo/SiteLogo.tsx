import React from "react";

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
			className={`flex justify-center items-center relative w-36 ${className}`}
			style={displayText ? { containerType: "inline-size", ...style } : { ...style }}
		>
			<div className="w-full relative">
				{displayText && (
					<div className="absolute z-1 font-unicephalon text-foreground-quaternary tracking-menu-items top-0 -right-1 xa:-right-[0.125rem] text-[6cqw] 3xs:text-[6cqw] xa:text-[3.5cqw] tracking-widest">
						{greeting_ln1 && <span dangerouslySetInnerHTML={{ __html: greeting_ln1 }} />}
						{greeting_ln2 && (
							<span
								dangerouslySetInnerHTML={{ __html: greeting_ln2 }}
								className="hidden xa:inline-block"
							/>
						)}
					</div>
				)}
				<div className={displayText ? "emphasize_drop_shadow" : ""}>
					<SvgLogo
						className={`${
							autoBreak && !manualBreak ? "hidden xa:block" : manualBreak ? "hidden" : "block"
						} ${displayText ? "py-4" : "p-0"}`}
						gray={gray}
						hover={hover}
					/>
					<SvgLogoBreak
						className={`${
							autoBreak && !manualBreak ? "block xa:hidden" : manualBreak ? "block" : "hidden"
						} ${displayText ? "py-4" : "p-0"}`}
						gray={gray}
						hover={hover}
					/>
				</div>
			</div>
		</div>
	);
};

export default SiteLogo;
