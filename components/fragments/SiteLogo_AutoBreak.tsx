"use client";

import React, { useLayoutEffect, useState } from "react";

import { useTranslations } from "next-intl";

import resolveConfig from "tailwindcss/resolveConfig";
import { Config } from "tailwindcss/types/config";

import { useBreakpoint } from "@/hooks/useBreakpoint";

import tailwindConfig from "@/tailwind.config";
import { cn } from "@/lib/utils";

const fullConfig = resolveConfig(tailwindConfig as unknown as Config);

interface Props {
	size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
	textHidePoint?:
		| "xs320"
		| "xs420"
		| "xs"
		| "sm"
		| "sm580"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "none";
	textHidePoint_Default?: boolean;
	textBreakpoint?:
		| "xs320"
		| "xs420"
		| "xs"
		| "sm"
		| "sm580"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "none";
	textBreakpoint_Default?: boolean;
	textBreakRelativeSize?: number;
	textColor?: string;
	className?: string;
}

const SiteLogo_AutoBreak: React.FC<Props> = ({
	size = "md",
	textHidePoint = "none",
	textBreakpoint_Default = false,
	textBreakpoint = "sm",
	textHidePoint_Default = false,
	textBreakRelativeSize = 0.7,
	textColor,
	className,
}) => {
	const t = useTranslations("SiteLogo");
	const textColorClass = `text-${textColor}`;

	let logoSize = 40;
	let yTranslate = 3;
	let fontSize = 28;
	let mrLogo = 0;

	const textBreakpointObj = useBreakpoint(textBreakpoint);
	const textHidePointObj = useBreakpoint(textHidePoint);
	const [shouldBreakText, setShouldBreakText] = useState<number | boolean>(textBreakpoint_Default);
	const [shouldHideText, setShouldHideText] = useState<number | boolean>(textHidePoint_Default);

	useLayoutEffect(() => {
		setShouldBreakText(Object.values(textBreakpointObj)[2] ?? textBreakpoint_Default);
		setShouldHideText(Object.values(textHidePointObj)[2] ?? textHidePoint_Default);
	}, [textBreakpointObj, textBreakpoint_Default, textHidePointObj, textHidePoint_Default]);

	switch (size) {
		case "2xs":
			logoSize = 28;
			yTranslate = 2;
			fontSize = 18;
			mrLogo = -0.5;
			break;
		case "xs":
			logoSize = 32;
			yTranslate = 1.2;
			fontSize = 22;
			mrLogo = 0;
			break;
		case "sm":
			logoSize = 36;
			yTranslate = 2.3;
			fontSize = 25;
			mrLogo = 0.5;
			break;
		case "md":
			logoSize = 40;
			yTranslate = 3;
			fontSize = 28;
			mrLogo = 1;
			break;
		case "xl":
			logoSize = 48;
			yTranslate = 2.5;
			fontSize = 33;
			mrLogo = 1.5;
			break;
		case "2xl":
			logoSize = 54;
			yTranslate = 2.5;
			fontSize = 37;
			mrLogo = 2;
			break;
		case "3xl":
			logoSize = 60;
			yTranslate = 2.5;
			fontSize = 42;
			mrLogo = 2.5;
			break;
	}

	return (
		<div
			className={cn(
				"logo_container flex justify-center items-center gap-1 transition-all duration-300 select-none min-w-min",
				className
			)}
		>
			<svg
				aria-label={t("altLogo")}
				className="object-contain"
				height={logoSize}
				style={{
					marginRight: `${mrLogo}px`,
				}}
				viewBox="0 0 586.72 591.94"
				width={logoSize}
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
				<path
					className="logo-cls_mlt-blue-primary"
					d="M539.36,253.33q-16.59,0-23.92-2.84t-10-7.11a15.4,15.4,0,0,1-2.37-9,28.33,28.33,0,0,0-.94-9c-.8-2.85-2.85-5.21-6.16-7.11s-9.4-2.84-18.23-2.84H411.48q-14.21,0-22,.71t-11.37,4.26c-2.37,2.37-3.71,6.09-4,11.13s-.47,12.32-.47,21.79.16,16.81.47,22,1.66,9,4,11.37,6.16,3.71,11.37,4,12.55.48,22,.48h61.57q40.72,0,63.7,2.36t34.1,13.5q11.11,11.13,13.5,34.1t2.37,63.7q0,40.74-2.37,63.7t-13.5,34.1q-11.13,11.15-34.1,13.5t-63.7,2.37H411.48q-28.41,0-49.73-.95t-35.52-6.15q-14.21-5.22-21.31-16.82t-7.11-32.91q0-19.43,1.19-30.79t5.21-17.05a18.43,18.43,0,0,1,11.6-7.34,96.68,96.68,0,0,1,19.89-1.66q16.57,0,23.92,2.84t9.94,7.11a19,19,0,0,1,2.85,9,28.23,28.23,0,0,0,1.89,9q1.65,4.26,7.58,7.1T402,442.77H421q21.32,0,32.92-.47t16.81-4q5.2-3.54,6.16-11.36a195.28,195.28,0,0,0,1-22,188.5,188.5,0,0,0-1-21.78q-1-7.58-6.16-11.13t-16.81-4.27Q442.26,367,421,367h-9.47q-39.32,0-61.81-3.07t-34.1-14.69q-11.61-11.6-14.68-34.1t-3.08-61.8q0-40.72,2.37-63.7t13.5-34.1q11.11-11.13,34.1-13.5t63.7-2.37h56.83q28.43,0,49.73,1t35.52,6.16q14.22,5.21,21.32,16.81t7.1,32.91a260.38,260.38,0,0,1-1.42,30.79q-1.42,11.37-5.68,17.05t-12.79,7.34Q553.55,253.34,539.36,253.33Z"
					fill={fullConfig?.theme?.colors?.[textColor ?? "mlt-blue-primary"] as string}
				/>
			</svg>
			<p
				className={`font-Unicephalon relative text-[28px] translate-y-[3px] tracking-menu-items-wide`}
				style={{
					transform: `translateY(${yTranslate}px)`,
					fontSize: `${fontSize}px`,
					// letterSpacing: "1.8px",
					display: shouldHideText ? "none" : "block",
				}}
			>
				<span
					className={`${
						textColor ? textColorClass : "text-mlt-blue-primary"
					} logo-cls_mlt-blue-primary`}
				>
					{t("logoSubText.str0").substring(1)}
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
							textColor ? textColorClass : "text-mlt-purple-primary"
						} logo-cls_mlt-purple-primary`}
					>
						{t("logoSubText.str1")}
					</span>
					<span
						className={`${
							textColor ? textColorClass : "text-mlt-purple-primary"
						} logo-cls_mlt-purple-primary`}
					>
						{t("logoSubText.str2")}
					</span>
				</span>
			</p>
		</div>
	);
};

export default SiteLogo_AutoBreak;
