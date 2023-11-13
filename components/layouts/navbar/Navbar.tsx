"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signIn, signOut } from "next-auth/react";

import messages from "@/messages/en.json";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenu_NextLink_Styled,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import SiteLogo from "@/components/logo/SiteLogo";
import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import { Route } from "@/routes";
import { useAppContext } from "@/contexts/AppContext";

import { cn } from "@/lib/cn-utils";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useActualVh } from "@/hooks/useActualVh";

import styles from "./_navbar.module.scss";

const Navbar: React.FC = () => {
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
								aria-label={messages.NavBar.signInWith.replace(/{\s*provider\s*}/, provider.name)}
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
					<NavigationMenuTrigger chevronLeft aria-label={messages.NavBar.loggedInUserMenu}>
						<IconEmbedSvg c1="mlt-gray-3" c2="mlt-blue-dark" op2="BB" type="sidebar-flip" />
					</NavigationMenuTrigger>

					<NavigationMenuContent className="w-48">
						<NavigationMenu_NextLink_Styled
							desc={messages.NavBar.filesDescription}
							href={Route.private.FILES}
							title={messages.NavBar.files}
						/>

						<NavigationMenu_NextLink_Styled
							desc={messages.NavBar.signOutDescription}
							href="#"
							title={messages.NavBar.signOut}
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
		const pathAsKey = path as keyof typeof Route.public;

		if (Route.public[pathAsKey] === Route.public.HOME) {
			return (
				<Link
					key={index}
					as={Route.public.HOME}
					className={cn(styles.navItemCommon, "emphasize_drop_shadow", "text-mlt-gray-3 shadow")}
					href={"/" + messages.NavBar.HOME.toLocaleLowerCase()}
					style={{}}
				>
					<SiteLogo
						autoBreak={false}
						hover={currentPathName !== Route.public.HOME}
						style={{ width: "152px", height: "auto" }}
					/>
				</Link>
			);
		} else {
			return (
				<Link
					key={index}
					className={cn(
						styles.navItem,
						styles.navItemCommon,
						"emphasize_drop_shadow",
						`tracking-menu-items sm:tracking-wide ${
							currentPathName !== Route.public[pathAsKey]
								? "text-mlt-gray-3"
								: "text-mlt-blue-bright"
						}`
					)}
					href={Route.public[pathAsKey]}
				>
					{messages.NavBar[path as keyof typeof messages.NavBar]}
				</Link>
			);
		}
	});

	const publicMenu_Narrow = (
		<Sheet>
			<SheetTrigger
				className={cn(
					styles.navItemCommon,
					"emphasize_drop_shadow",
					"text-mlt-gray-3 outline-none focus-visible:outline-none focus:outline-none"
				)}
			>
				{/* <SiteLogo manualBreak style={{ width: "120px", height: "auto" }} /> */}
				<SiteLogo
					autoBreak={false}
					hover={currentPathName !== Route.public.HOME}
					style={{ width: "152px", height: "auto" }}
				/>
			</SheetTrigger>

			<SheetContent className="flex flex-col items-start justify-start gap-10 h-full" side="left">
				<SheetHeader>
					<SheetClose>
						{/* <SiteLogo manualBreak style={{ width: "120px", height: "auto" }} /> */}
						<SiteLogo
							autoBreak={false}
							hover={currentPathName !== Route.public.HOME}
							style={{ width: "152px", height: "auto" }}
						/>
					</SheetClose>
				</SheetHeader>

				<div className="flex flex-col gap-6">
					{Object.keys(Route.public).map((path, index) => (
						<Link
							key={index}
							className={cn(
								styles.navItemCommon,
								styles.navItemSideMenu,
								"emphasize_drop_shadow",
								currentPathName === Route.public[path as keyof typeof Route.public]
									? "text-accent"
									: "text-foreground"
							)}
							href={Route.public[path as keyof typeof Route.public]}
							tabIndex={-1}
						>
							<SheetClose className="border-x-8 border-y-2 border-transparent tracking-wide">
								{messages.NavBar[path as keyof typeof messages.NavBar]}
							</SheetClose>
						</Link>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);

	const { isAboveSm } = useBreakpoint("sm");
	const {} = useActualVh(); // Just trigger the useActualVh hook to set --vh

	return (
		<nav className={styles.navbar}>
			<div className="items-center justify-center gap-4 pb-1 flex">
				{isAboveSm ? publicMenu_Wide : publicMenu_Narrow}
			</div>

			<div className="items-center justify-center gap-4 flex pt-1">
				{session?.user ? loggedIn_Menu : logIn_Button}
			</div>
		</nav>
	);
};

export default Navbar;
