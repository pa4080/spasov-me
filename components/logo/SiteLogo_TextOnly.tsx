import React from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { roundTo } from "@/lib/round";

interface Props {
	fontSize?: number;
	shouldBreakText?: boolean;
	shouldHideText?: boolean;
	textBreakRelativeSize?: number;
	textColor?: string;
	className?: string;
}

const SiteLogo_TextOnly: React.FC<Props> = ({
	fontSize = 56,
	shouldBreakText = false,
	shouldHideText = false,
	textBreakRelativeSize = 0.7,
	textColor,
	className,
}) => {
	const t = useTranslations("SiteLogo");
	const textColorClass = `text-${textColor}`;

	const firstLetterFontSize = roundTo(fontSize * 1.12);
	const fontSizeCompensation = roundTo((firstLetterFontSize - fontSize) / 1 / 5);
	const shapeFactor = 1.27;
	const shapeSize = roundTo(firstLetterFontSize * shapeFactor);
	const leftFactor = 0.58;
	const leftValue = roundTo(firstLetterFontSize * leftFactor);
	const topFactor = 0.04;
	const topValue = roundTo(firstLetterFontSize * topFactor);

	return (
		<div
			className={cn(
				"logo_color_container flex justify-center items-center gap-1 transition-all duration-300 select-none min-w-min",
				className
			)}
			style={{
				marginLeft: `${leftValue}px`,
			}}
		>
			<div className="relative w-fit">
				<svg
					aria-label={t("altLogo")}
					className={`absolute`}
					height={shapeSize}
					style={{
						left: `-${leftValue}px`,
						top: `${topValue}px`,
					}}
					viewBox="0 0 586.72 591.94"
					width={shapeSize}
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="logo-cls_mlt-gray-1"
						d="M141.82,43.35a294.19,294.19,0,0,0-78,69.14,268.31,268.31,0,0,0,34.91-4.68A319.13,319.13,0,0,1,141.82,43.35Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-3"
						d="M242.71,27.53A267.39,267.39,0,0,0,264,1.7a294,294,0,0,0-95.56,27.23A319.21,319.21,0,0,1,242.71,27.53Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-3"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M169.36,82.92,155.49,57.33a298.84,298.84,0,0,0-31.13,44A272.46,272.46,0,0,0,169.36,82.92Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-2"
						d="M172.87,48,186.59,73.3a270.52,270.52,0,0,0,37.28-27.49A299.69,299.69,0,0,0,172.87,48Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-2"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-3"
						d="M424.68,29.43A297.72,297.72,0,0,0,289,.08a290,290,0,0,1-22.72,30.68A318.76,318.76,0,0,1,393.36,82.94,424.15,424.15,0,0,0,424.68,29.43Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-3"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M64.53,265.18A318.67,318.67,0,0,1,88.7,129.63a289.36,289.36,0,0,1-39.65,3.19A297.47,297.47,0,0,0,1.86,263.3,423.76,423.76,0,0,0,64.53,265.18Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-2"
						d="M292.07,133.92c12.47-12.47,30.16-20,52.57-22.28,8.18-.85,17.67-1.47,28.6-1.89,2.93-3.6,5.81-7.22,8.61-10.9A298.84,298.84,0,0,0,250.26,48.06,288.67,288.67,0,0,1,196,90.6l63.3,116.82q4.69-2.74,9.29-5.6.52-8.34,1.24-15.33C272.09,164.09,279.59,146.4,292.07,133.92Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-2"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M84.07,263.85A421.54,421.54,0,0,0,242,217L178.76,100.27a289.83,289.83,0,0,1-66.84,24.85A298.53,298.53,0,0,0,84.07,263.85Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-3"
						d="M519.39,110.08c2.5.11,4.92.27,7.3.45a293.94,293.94,0,0,0-84.55-71.9A443.79,443.79,0,0,1,409.19,94.7q8.67,6.87,16.88,14.41h42.24C487.56,109.11,504.74,109.43,519.39,110.08Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-3"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M102.13,401A312.43,312.43,0,0,1,66,284.86,444.26,444.26,0,0,1,.3,282.94,294.17,294.17,0,0,0,32.83,431.37,585.76,585.76,0,0,0,118,427.11Q109.51,414.56,102.13,401Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M270.62,319.27c-2-14.37-3.06-32.62-3.31-55.56L251.4,234.34A440.7,440.7,0,0,1,85.52,283.47a293.88,293.88,0,0,0,33.9,108.14A298.29,298.29,0,0,0,139.78,424,586.41,586.41,0,0,0,298,374.54c-1.38-1.19-2.73-2.42-4-3.71C281.44,358.33,273.58,341,270.62,319.27Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M131.15,445.22a606.79,606.79,0,0,1-87.15,6A294.32,294.32,0,0,0,165.41,561.51a726.54,726.54,0,0,0,90.07-21.17A313.62,313.62,0,0,1,131.15,445.22Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M278.85,510.58c-7.8-12.74-11.59-28.72-11.59-48.86a337.17,337.17,0,0,1,1.35-34,76.75,76.75,0,0,1,4.89-20.89,604.73,604.73,0,0,1-120,34.78A295.24,295.24,0,0,0,284.91,530.7c2.89-1,5.78-2.05,8.66-3.1A68.4,68.4,0,0,1,278.85,510.58Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
					<path
						className="logo-cls_mlt-gray-1"
						d="M285.42,551.32a746.83,746.83,0,0,1-87.25,23.93,295.25,295.25,0,0,0,225.58-12.34A320.18,320.18,0,0,1,285.42,551.32Z"
						// fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-gray-1"] as string}
					/>
				</svg>
				<p
					className={`font-Unicephalon relative tracking-menu-items-wide`}
					style={{
						fontSize: `${fontSize}px`,
						display: shouldHideText ? "none" : "block",
					}}
				>
					<span
						className={`${
							textColor ? textColorClass : "text-mlt-blue-dark"
						} logo-cls_mlt-blue-dark`}
						style={{ fontSize: `${firstLetterFontSize}px` }}
					>
						{t("logoSubText.str0").charAt(0)}
					</span>
					<span
						style={{
							display: shouldHideText ? "none" : "inline-block",
							transform: `translate(0.5px, -${fontSizeCompensation}px)`,
						}}
					>
						<span
							className={`${
								textColor ? textColorClass : "text-mlt-blue-dark"
							} logo-cls_mlt-blue-dark`}
						>
							{t("logoSubText.str0").slice(1)}
						</span>
						<span
							className="absolute"
							style={{
								display: shouldBreakText ? "block" : "contents",
								right: shouldBreakText ? "0" : "unset",
								bottom: shouldBreakText ? `-${textBreakRelativeSize * 1.45}em` : "unset",
								fontSize: shouldBreakText ? `${textBreakRelativeSize}em` : "inherit",
							}}
						>
							<span
								className={`${
									textColor ? textColorClass : "text-mlt-purple-dark"
								} logo-cls_mlt-purple-dark`}
							>
								{t("logoSubText.str1")}
							</span>
							<span
								className={`${
									textColor ? textColorClass : "text-mlt-purple-dark"
								} logo-cls_mlt-purple-dark`}
							>
								{t("logoSubText.str2")}
							</span>
						</span>
					</span>
				</p>
			</div>
		</div>
	);
};

export default SiteLogo_TextOnly;
