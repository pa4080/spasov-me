"use client";
import React from "react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import { new_tab_target } from "@/lib/process-markdown";

import styles from "./_footer.module.scss";

const Footer: React.FC = () => {
	return (
		<footer className={styles.footer}>
			<a className={styles.icon} href="https://github.com/pa4080" target={new_tab_target}>
				<IconEmbedSvg
					height={32}
					type="github-rounded"
					viewBoxHeight={512}
					viewBoxWidth={496}
					width={32}
				/>
			</a>
			<a
				className={styles.icon}
				href="https://askubuntu.com/users/566421/pa4080"
				target={new_tab_target}
			>
				<IconEmbedSvg
					height={32}
					type="ubuntu-aka-ask-ubuntu"
					viewBoxHeight={512}
					viewBoxWidth={496}
					width={32}
				/>
			</a>
			<a
				className={`${styles.icon} ${styles.iconSpecial}`}
				href="https://wiki.metalevel.tech"
				target={new_tab_target}
			>
				<IconEmbedSvg
					height={32}
					type="metalevel-wiki"
					viewBoxHeight={591.94}
					viewBoxWidth={557.41}
					width={32}
				/>
			</a>
			<a
				className={styles.icon}
				href="https://www.linkedin.com/in/spas-z-spasov"
				target={new_tab_target}
			>
				<IconEmbedSvg
					height={32}
					type="linkedin-square"
					viewBoxHeight={512}
					viewBoxWidth={448}
					width={32}
				/>
			</a>
			<a
				className={styles.icon}
				href="https://meta.wikimedia.org/wiki/User:Spas.Z.Spasov"
				target={new_tab_target}
			>
				<IconEmbedSvg
					height={32}
					type="wikimedia"
					viewBoxHeight={897}
					viewBoxWidth={900}
					width={32}
				/>
			</a>
		</footer>
	);
};

export default Footer;
