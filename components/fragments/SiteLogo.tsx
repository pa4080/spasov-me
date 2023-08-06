import Image from "next/image";
import Link from "next/link";
import React from "react";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import { Path } from "@/interfaces/Path";
import logo from "@/public/icons/svg/spasov.me.logo.svg";

const SiteLogo = () => {
	const t = useTranslations("SiteLogo");
	const pathName = usePathname();

	return (
		<Link
			className="flex justify-center items-center gap-1 hover:drop-shadow-md transition-all duration-300"
			href={pathName === Path.HOME ? `${Path.HOME}?wipe=true` : Path.HOME}
		>
			<Image
				alt={t("altLogo")}
				className="object-contain w-10 h-10"
				height={40}
				src={logo}
				width={40}
			/>
			<p className="logo_text relative">
				<span className="logo_text_str0">{t("logoSubText.str0").substring(1)}</span>
				<span className="max-md:block max-md:absolute max-md:right-0 max-md:text-sm max-md:-bottom-4">
					<span className="logo_text_str1">{t("logoSubText.str1")}</span>
					<span className="logo_text_str2">{t("logoSubText.str2")}</span>
				</span>
			</p>
		</Link>
	);
};

export default SiteLogo;
