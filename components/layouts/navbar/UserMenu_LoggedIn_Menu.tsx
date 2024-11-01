import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import RebuildMasterVercel from "@/components/fragments/RebuildMasterVercel";
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenu_NextLink_Styled,
} from "@/components/ui/navigation-menu";
import { msgs } from "@/messages";
import { Route } from "@/routes";

interface Props {
  className?: string;
}

const LoggedIn_Menu: React.FC<Props> = ({ className = "-mr-4" }) => {
  const t = msgs("Navigation");
  const { data: session } = useSession();
  const pathname = usePathname();

  type tType = Parameters<typeof t>[0];

  return (
    <div className="flex flex-row -ml-2 mr-1">
      <RebuildMasterVercel className="scale-[85%] max-2xs:hidden mt-[1px]" />
      <RevalidatePaths className="scale-[85%] max-2xs:hidden mt-[1px] -mr-2" />

      <NavigationMenu className={className} viewportPosition="-right-16">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              chevronLeft
              aria-label={t("loggedInUserMenu")}
              className="text-accent-secondary active:text-accent-secondary focus:text-accent-secondary focus-visible:text-accent-secondary"
            >
              <IconEmbedSvg
                className_Path1="icon-embed-svg-override-path-1 fill-secondary-foreground"
                className_Path2="icon-embed-svg-override-path-2 fill-ring-secondary"
                type="sidebar-flip"
              />
            </NavigationMenuTrigger>

            <NavigationMenuContent className="w-64 3xs:w-[22rem] 2xs:w-[26rem]">
              <div className="3xs:columns-2 border-b-2 border-b-primary pb-1 mb-1">
                {Object.keys(Route.admin).map((key) => (
                  <NavigationMenu_NextLink_Styled
                    key={key}
                    className={`p-3 block rounded break-inside-avoid-column hover:bg-primary/50 [&]:mt-1 ${pathname === Route.admin[key as keyof typeof Route.admin] ? "bg-accent/30 hover:!bg-accent/55" : ""}`}
                    desc={t(`${key}_DESC` as tType)}
                    href={Route.admin[key as keyof typeof Route.admin]}
                    title={t(key as tType)}
                  />
                ))}
              </div>

              <div className="3xs:columns-2">
                <div className="p-3">
                  <p className="font-bold">
                    {t("user")} ({session?.user?.accountProvider})
                  </p>
                  <p className="text-foreground-tertiary">{session?.user?.name}</p>
                </div>

                <NavigationMenu_NextLink_Styled
                  className="p-3 block rounded break-inside-avoid-column hover:bg-primary/50"
                  desc={t("signOutDescription")}
                  href="#"
                  title={t("signOut")}
                  onClick={async (e) => {
                    e.preventDefault();
                    await signOut();
                  }}
                />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default LoggedIn_Menu;
