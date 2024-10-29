"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SiteLogo from "@/components/layouts/logo/SiteLogo";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import styles from "./_navbar.module.css";

interface Props {
  className?: string;
}

const PublicMenu_Desktop: React.FC<Props> = ({ className }) => {
  const t = msgs("Navigation");

  type tType = Parameters<typeof t>[0];

  const currentPathName = usePathname();
  const menuItems: string[] = Object.keys(Route.public);

  return (
    <div className={className}>
      <Link
        aria-label="Link to Home page"
        as={Route.public.HOME.uri}
        className={`${styles.navItemCommon} emphasize_drop_shadow`}
        // This is a workaround for a Next.js bug, where the home page is not rerendered
        // after 404 error which is rendered on the the same URI.
        href={Route.public.HOME.uri}
        style={{}}
      >
        <SiteLogo
          autoBreak={false}
          className={`${currentPathName === Route.public.HOME.uri ? "hover:saturate-150" : ""}`}
          hover={currentPathName !== Route.public.HOME.uri}
          style={{ width: "152px", height: "28px" }}
        />
      </Link>

      {menuItems.map((path, index) => {
        const pathAsKey = path as keyof typeof Route.public;
        const menuItemPathName = Route.public[pathAsKey].uri;
        const isConcretePath = currentPathName === menuItemPathName;
        const isSubpath =
          menuItemPathName !== Route.public.HOME.uri && currentPathName.includes(menuItemPathName);

        // console.log(
        //   `currentPathName: ${currentPathName}, menuItemPathName: ${menuItemPathName}, isConcretePath: ${isConcretePath}, isSubpath: ${isSubpath}`
        // );
        if (
          Route.public[pathAsKey].uri !== Route.public.HOME.uri &&
          Route.public[pathAsKey].inNavbar &&
          Route.public[pathAsKey].visible
        ) {
          return (
            <Link
              key={index}
              className={`${styles.navItemCommon} text-[19px] translate-y-[2px] emphasize_drop_shadow ${
                isConcretePath
                  ? "text-ring"
                  : isSubpath
                    ? "text-ring-secondary"
                    : "text-muted-foreground dark:text-foreground"
              }`}
              href={Route.public[pathAsKey].uri}
            >
              {t(path as tType)}
            </Link>
          );
        }
      })}
    </div>
  );
};

export default PublicMenu_Desktop;
