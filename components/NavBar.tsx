"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
// import { usePathname } from "next/navigation";

import logo from "@/public/icons/svg/spasov.me.logo.svg";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Path } from "@/interfaces/Path";
import { usePromptopiaContext } from "@/contexts/PromptopiaContext";

import { Skeleton } from "./ui/skeleton";
import SiteLogo from "./fragments/SiteLogo";
import IconEmbedSvg from "./fragments/IconEmbedSvg";

const NavBar: React.FC = () => {
	const t = useTranslations("NavBar");
	const { authProviders, session } = usePromptopiaContext();
	const [toggleDropDown, setToggleDropDown] = useState(false);
	// const pathName = usePathname();
	const { isBelowSm } = useBreakpoint("sm");

	const openMobileNavBar = () => {
		setToggleDropDown((prevState) => !prevState);
	};

	const ligInButton = (
		<>
			{authProviders ? (
				Object.values(authProviders).map((provider) => {
					if (provider.id === "github") {
						return (
							<button
								key={provider.name}
								aria-label={t("signInWith", { provider: provider.name })}
								className="login_provider_btn"
								type="button"
								onClick={() => signIn(provider.id)}
							>
								<IconEmbedSvg
									color1="mlt-gray-2"
									color2="mlt-blue-primary"
									opacity2="BB"
									type="arrow-right-to-bracket"
								/>
							</button>
						);
					}
				})
			) : (
				<Skeleton className="bg-transparent">
					<IconEmbedSvg
						color1="mlt-gray-2"
						color2="mlt-gray-2"
						opacity2="CC"
						type="arrow-right-to-bracket"
					/>
				</Skeleton>
			)}
		</>
	);

	const profilePicture = (
		<div className="z-20" onClick={openMobileNavBar}>
			<IconEmbedSvg
				color1="mlt-gray-3"
				color2="mlt-blue-primary"
				opacity2="BB"
				type="sidebar-flip"
			/>
		</div>
	);

	return (
		<>
			<SiteLogo size="2xs" />

			<div className="flex relative">
				{session?.user ? (
					<div className="flex">
						{profilePicture}
						{toggleDropDown && (
							<div className="dropdown">
								<Link
									className="dropdown_link mt-3"
									href={Path.PROFILE}
									onClick={() => setToggleDropDown(false)}
								>
									{t("myProfile")}
								</Link>
								<Link
									className="dropdown_link"
									href={Path.POST_CREATE}
									onClick={() => setToggleDropDown(false)}
								>
									{t("createPrompt")}
								</Link>

								<button
									className="mt-2 w-full _btn gray_heavy_invert "
									type="button"
									onClick={() => {
										setToggleDropDown(false);
										signOut();
									}}
								>
									{t("signOut")}
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="flex justify-center items-center gap-3 md:gap-3">{ligInButton}</div>
				)}
			</div>
		</>
	);
};

export default NavBar;
