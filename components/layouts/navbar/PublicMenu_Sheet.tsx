import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
	children: React.ReactNode;
}

const PublicMenu_Sheet: React.FC<Props> = ({ className, children }) => {
	const t = msgs("Navigation");

	type tType = Parameters<typeof t>[0];

	const currentPathName = usePathname();
	const menuItems: string[] = Object.keys(Route.public);

	return (
		<div className={className}>
			<Sheet>
				<SheetTrigger
					aria-label={t("altMenuButton")}
					className={`${styles.navItemCommon} outline-none focus-visible:outline-none focus:outline-none`}
				>
					{children}
				</SheetTrigger>

				<SheetContent className="flex flex-col items-start justify-start gap-10 h-full" side="left">
					<SheetTitle className="hidden">{t("publicMenu_title")}</SheetTitle>
					<SheetDescription className="hidden">{t("publicMenu_title")}</SheetDescription>

					<SheetHeader>
						<SheetClose>{children}</SheetClose>
					</SheetHeader>

					<div className="flex flex-col gap-8 pl-2">
						{menuItems.map((path, index) => {
							const pathAsKey = path as keyof typeof Route.public;

							if (Route.public[pathAsKey].visible) {
								return (
									<Link
										key={index}
										className={`emphasize_drop_shadow ${
											currentPathName === Route.public[pathAsKey].uri
												? "text-accent"
												: "text-foreground"
										}`}
										href={Route.public[pathAsKey].uri}
										tabIndex={-1}
									>
										<SheetClose
											// The SheetClose overrides the CSS from the module so we can't use a specific class here
											className="font-unicephalon !tracking-widest text-[18px] hover:text-ring active:text-ring-secondary hover:transition-colors"
										>
											{t(path as tType)}
										</SheetClose>
									</Link>
								);
							}
						})}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default PublicMenu_Sheet;
