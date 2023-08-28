"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signIn, signOut } from "next-auth/react";

import { Route } from "@/routes";

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

import { Skeleton } from "./ui/skeleton";
import SiteLogo_ManualBreak from "./logo/SiteLogo_ManualBreak";
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
									c1="mlt-gray-2"
									c2="mlt-blue-dark"
									op2="BB"
									type="arrow-right-to-bracket"
								/>
							</button>
						);
					}
				})
			) : (
				<Skeleton className="bg-transparent">
					<IconEmbedSvg c1="mlt-gray-2" c2="mlt-gray-2" op2="CC" type="arrow-right-to-bracket" />
				</Skeleton>
			)}
		</>
	);

	const loggedIn_Menu = (
		<NavigationMenu className="-mr-4" viewportPosition="right-4">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger chevronLeft aria-label={t("loggedInUserMenu")}>
						<IconEmbedSvg c1="mlt-gray-3" c2="mlt-blue-dark" op2="BB" type="sidebar-flip" />
					</NavigationMenuTrigger>

					<NavigationMenuContent className="w-48">
						<NavigationMenu_NextLink_Styled
							desc={t("filesDescription")}
							href={Route.private.FILES}
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

	const publicMenu_Wide = Object.keys(Route.public).map((path, index) => {
		if (Route.public[path] === Route.public.HOME) {
			return (
				<Link
					key={index}
					className="text-mlt-gray-3 nav_item_common emphasize_drop_shadow"
					href={Route.public.HOME}
				>
					<SiteLogo_ManualBreak
						hover
						className={`mt-[13px] transition-all logo_menu_item ${
							currentPathName === Route.public.HOME ? "" : ""
						}`}
						fontSize={19}
						shouldBreakText={true}
						textColor={currentPathName === Route.public.HOME ? "mlt-blue-bright" : "mlt-gray-3"}
						textColorBreak={
							currentPathName === Route.public.HOME ? "mlt-purple-bright" : "mlt-gray-3"
						}
					/>
				</Link>
			);
		} else {
			return (
				<Link
					key={index}
					className={`nav_item nav_item_common emphasize_drop_shadow tracking-menu-items sm:tracking-menu-items-wide ${
						currentPathName !== Route.public[path] ? "text-mlt-gray-3" : "text-mlt-blue-bright"
					}`}
					href={Route.public[path]}
				>
					{t(path)}
				</Link>
			);
		}
	});

	const publicMenu_Narrow = (
		<Sheet>
			<SheetTrigger className="text-mlt-gray-3 nav_item_common emphasize_drop_shadow outline-none">
				<SiteLogo_ManualBreak className="mt-[13px]" fontSize={19} shouldBreakText={true} />
				{/* <SiteLogo_ManualBreak className="" fontSize={19} shouldBreakText={false} /> */}
			</SheetTrigger>

			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle className="text-mlt-gray-3 nav_item_common emphasize_drop_shadow outline-none">
						<SheetClose>
							<SiteLogo_ManualBreak
								className="justify-start -ml-[4px] -mt-[2px]"
								fontSize={28}
								shouldBreakText={true}
							/>
						</SheetClose>
					</SheetTitle>

					<SheetMenu className="flex flex-col gap-4 pt-5 pl-2">
						{Object.keys(Route.public).map((path, index) => (
							<Link
								key={index}
								className={`nav_item_side_menu nav_item_common emphasize_drop_shadow ${
									currentPathName === Route.public[path]
										? "text-mlt-blue-bright"
										: "text-mlt-gray-3"
								}`}
								href={Route.public[path]}
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
		<nav className="nav_container">
			<div className="items-center justify-center gap-4 pb-[4px] hidden sm580:flex">
				{publicMenu_Wide}
			</div>
			<div className="items-center justify-center gap-4 pb-[4px] flex sm580:hidden">
				{publicMenu_Narrow}
			</div>

			<div className="items-center justify-center gap-4 flex pt-1">
				{session?.user ? loggedIn_Menu : logIn_Button}
			</div>
		</nav>
	);
};

export default NavBar;
