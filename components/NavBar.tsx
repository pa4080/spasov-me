"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signIn, signOut } from "next-auth/react";

import { useAppContext } from "@/contexts/AppContext";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenu_NextLink_Styled,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
	Sheet,
	SheetContent,
	SheetClose,
	SheetMenu,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { Path } from "@/interfaces/Path";

import { Skeleton } from "./ui/skeleton";
import SiteLogo from "./fragments/SiteLogo";
import IconEmbedSvg from "./fragments/IconEmbedSvg";

const NavBar: React.FC = () => {
	const t = useTranslations("NavBar");
	const currentPathName = usePathname();
	const { authProviders, session } = useAppContext();

	const logIn_Button = (
		<>
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

	const loggedIn_Menu = (
		<NavigationMenu className="-mr-4" viewportPosition="right-4">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger chevronLeft>
						<IconEmbedSvg
							color1="mlt-gray-3"
							color2="mlt-blue-primary"
							opacity2="BB"
							type="sidebar-flip"
						/>
					</NavigationMenuTrigger>

					<NavigationMenuContent className="w-48">
						<NavigationMenu_NextLink_Styled
							desc={t("filesDescription")}
							href={Path.private.FILES}
							title={t("files")}
						/>

						<NavigationMenu_NextLink_Styled
							desc={t("signOutDescription")}
							href="#"
							title={t("signOut")}
							onClick={(e) => {
								e.preventDefault();
								signOut();
							}}
						/>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);

	const publicMenu_Wide = Object.keys(Path.public).map((path, index) => {
		if (Path.public[path] === Path.public.HOME) {
			return (
				<Link key={index} className="text-mlt-gray-3 nav_item_common" href={Path.public.HOME}>
					<SiteLogo
						shouldBreakText={true}
						size="2xs"
						textColor={currentPathName !== Path.public.HOME ? "mlt-gray-3" : undefined}
					/>
				</Link>
			);
		} else {
			return (
				<Link
					key={index}
					className={`nav_item nav_item_common tracking-menu-items sm:tracking-menu-items-wide ${
						currentPathName !== Path.public[path] ? "text-mlt-gray-3" : "text-mlt-blue-primary"
					}`}
					href={Path.public[path]}
				>
					{t(path)}
				</Link>
			);
		}
	});

	const publicMenu_Narrow = (
		<Sheet>
			<SheetTrigger className="text-mlt-gray-3 nav_item_common outline-none">
				<SiteLogo shouldBreakText={true} size="2xs" />
			</SheetTrigger>

			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle className="text-mlt-gray-3 nav_item_common outline-none">
						<SheetClose>
							<SiteLogo
								className="justify-start -ml-[4px] -mt-[2px]"
								shouldBreakText={true}
								size="xs"
							/>
						</SheetClose>
					</SheetTitle>

					<SheetMenu className="flex flex-col gap-4 pt-5 pl-2">
						{Object.keys(Path.public).map((path, index) => (
							<Link
								key={index}
								className={`nav_item_side_menu nav_item_common ${
									currentPathName !== Path.public[path]
										? "text-mlt-gray-3"
										: "text-mlt-blue-primary"
								}`}
								href={Path.public[path]}
								tabIndex={-1}
							>
								<SheetClose className="border-x-8 border-y-2 border-transparent tracking-menu-items-wide">
									{t(path)}
								</SheetClose>
							</Link>
						))}
					</SheetMenu>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);

	return (
		<>
			<div className="items-center justify-center gap-4 hidden sm580:flex">{publicMenu_Wide}</div>
			<div className="items-center justify-center gap-4 flex sm580:hidden">{publicMenu_Narrow}</div>

			<div className="items-center justify-center gap-4 flex pt-1">
				{session?.user ? loggedIn_Menu : logIn_Button}
			</div>
		</>
	);
};

export default NavBar;
