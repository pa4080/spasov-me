"use client";
import React from "react";
// import { useTranslations } from "next-intl";

import Image from "next/image";

import iconMlt from "@/public/icons/svg/mlt/mlw.icon.blue-gray.svg";

import iconGitHub from "@/public/assets/icons/github-gray.svg";
import iconUbuntu from "@/public/assets/icons/ubuntu-gray.svg";
import iconLinkedIn from "@/public/assets/icons/linked-in-gray-square.svg";
import iconWikiMedia from "@/public/assets/icons/wikimedia-gray.svg";

const Footer: React.FC = () => {
	// const t = useTranslations("Footer");

	return (
		<footer className="footer_container">
			<a
				className="footer_icon"
				href="https://github.com/metalevel-tech"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="GitHub Icon" height={32} src={iconGitHub} width={32} />
			</a>
			<a
				className="footer_icon"
				href="https://askubuntu.com/users/566421/pa4080"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="AskUbuntu Icon" height={32} src={iconUbuntu} width={32} />
			</a>
			<a
				className="footer_icon footer_special_icon"
				href="https://wiki.metalevel.tech"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="Wiki Metalevel.tech Icon" height={32} src={iconMlt} width={32} />
			</a>
			<a
				className="footer_icon"
				href="https://www.linkedin.com/in/spas-z-spasov"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="LinkedIn Icon" height={32} src={iconLinkedIn} width={32} />
			</a>
			<a
				className="footer_icon"
				href="https://meta.wikimedia.org/wiki/User:Spas.Z.Spasov"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="MediaWiki Icon" height={32} src={iconWikiMedia} width={32} />
			</a>
		</footer>
	);
};

export default Footer;
