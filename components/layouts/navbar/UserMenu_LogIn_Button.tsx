import React from "react";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/cn-utils";
import { AuthProviders } from "@/types/next-auth-providers";
import messages from "@/messages/en.json";
import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import { Skeleton } from "@/components/ui/skeleton";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
	authProviders: AuthProviders;
}

const LogIn_Button: React.FC<Props> = ({ className, authProviders }) => {
	return (
		<div className={cn(styles.logInButton, className)}>
			{authProviders ? (
				Object.values(authProviders).map((provider) => {
					if (provider.id === "github") {
						return (
							<button
								key={provider.name}
								aria-label={messages.NavBar.signInWith.replace(/{\s*provider\s*}/, provider.name)}
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
