import Image from "next/image";
import Link from "next/link";
import React from "react";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import { Path } from "@/interfaces/Path";
import logo from "@/public/icons/svg/spasov.me.logo.svg";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface Props {
	size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
	textHidePoint?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | false;
	textBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | false;
	textBreakRelativeSize?: number;
}
const SiteLogo: React.FC<Props> = ({
	size = "md",
	textHidePoint = "xs",
	textBreakpoint = "md",
	textBreakRelativeSize = 0.7,
}) => {
	const t = useTranslations("SiteLogo");
	const pathName = usePathname();
	let logoSize = 40;
	let yTranslate = 3;
	let fontSize = 28;
	let mrLogo = 0;

	const textBreakpointObj = useBreakpoint(textBreakpoint);
	const shouldBreakText = Object.values(textBreakpointObj)[2] ?? false;
	const textHidePointObj = useBreakpoint(textHidePoint);
	const shouldHideText = Object.values(textHidePointObj)[2] ?? false;

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
		<Link
			className="flex justify-center items-center gap-1 hover:drop-shadow-md transition-all duration-300"
			href={pathName === Path.HOME ? `${Path.HOME}?wipe=true` : Path.HOME}
		>
			<Image
				alt={t("altLogo")}
				className="object-contain"
				height={logoSize}
				src={logo}
				style={{
					marginRight: `${mrLogo}px`,
				}}
				width={logoSize}
			/>
			<p
				className={`font-Unicephalon relative text-[28px] translate-y-[3px]`}
				style={{
					transform: `translateY(${yTranslate}px)`,
					fontSize: `${fontSize}px`,
					letterSpacing: "1.8px",
					display: shouldHideText ? "none" : "block",
				}}
			>
				<span className="text-mlt-blue-primary">{t("logoSubText.str0").substring(1)}</span>
				<span
					className="absolute"
					style={{
						display: shouldBreakText ? "block" : "inline",
						right: shouldBreakText ? "0" : "unset",
						bottom: shouldBreakText ? `-${textBreakRelativeSize * 1.45}em` : "unset",
						fontSize: shouldBreakText ? `${textBreakRelativeSize}em` : "inherit",
					}}
				>
					<span className="text-mlt-purple-primary">{t("logoSubText.str1")}</span>
					<span className="text-mlt-purple-primary">{t("logoSubText.str2")}</span>
				</span>
			</p>
		</Link>
	);
};

export default SiteLogo;
