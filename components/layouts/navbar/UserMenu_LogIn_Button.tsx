import { signIn } from "next-auth/react";
import React from "react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { AuthProviders } from "@/types/next-auth-providers";

import { Skeleton } from "@/components/ui/skeleton";

import { msgs } from "@/messages";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
	authProviders: AuthProviders;
}

const LogIn_Button: React.FC<Props> = ({ className, authProviders }) => {
	const t = msgs("Navigation");

	return (
		<div className={`${styles.logInButton} ${className}`}>
			{authProviders ? (
				Object.values(authProviders).map((provider) => {
					if (provider.id === "github") {
						return (
							<button
								key={provider.name}
								aria-label={t("signInWith", { provider: provider.name })}
								type="button"
								onClick={() => signIn(provider.id)}
							>
								<IconEmbedSvg type="arrow-right-to-bracket" />
							</button>
						);
					}
				})
			) : (
				<Skeleton className="bg-transparent">
					<IconEmbedSvg type="arrow-right-to-bracket" />
				</Skeleton>
			)}
		</div>
	);
};

export default LogIn_Button;
