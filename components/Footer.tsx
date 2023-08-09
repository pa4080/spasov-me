"use client";
import React, { useLayoutEffect } from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";

import iconMlt from "@/public/icons/svg/mlt/mlw.icon.blue-gray.svg";

import { useBreakpoint } from "@/hooks/useBreakpoint";

import iconGitHub from "@/public/assets/icons/github-gray.svg";
import iconUbuntu from "@/public/assets/icons/ubuntu-gray.svg";
import iconLinkedIn from "@/public/assets/icons/linked-in-gray-square.svg";
import iconWikiMedia from "@/public/assets/icons/wikimedia-gray.svg";

const Footer: React.FC = () => {
	const t = useTranslations("Footer");

	const [isBwXs, setIsBwXs] = React.useState<boolean>(false);
	const { isBelowXs } = useBreakpoint("xs");

	useLayoutEffect(() => {
		setIsBwXs(isBelowXs);
	}, [isBelowXs]);

	return (
		<>
			<a
				className="regular-icon"
				href="https://github.com/metalevel-tech"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="GitHub Icon" height={32} src={iconGitHub} width={32} />
			</a>
			<a
				className="regular-icon"
				href="https://askubuntu.com/users/566421/pa4080"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="AskUbuntu Icon" height={32} src={iconUbuntu} width={32} />
			</a>
			<a
				className="regular-icon special-icon"
				href="https://wiki.metalevel.tech"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="Wiki Metalevel.tech Icon" height={32} src={iconMlt} width={32} />
			</a>
			<a
				className="regular-icon"
				href="https://www.linkedin.com/in/spas-z-spasov"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="LinkedIn Icon" height={32} src={iconLinkedIn} width={32} />
			</a>
			<a
				className="regular-icon"
				href="https://meta.wikimedia.org/wiki/User:Spas.Z.Spasov"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="MediaWiki Icon" height={32} src={iconWikiMedia} width={32} />
			</a>
		</>
	);
};

export default Footer;
