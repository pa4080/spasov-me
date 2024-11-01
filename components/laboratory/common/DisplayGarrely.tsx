"use client";

import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { type LabEntryVisibilityType } from "@/interfaces/_common-data-types";
import { type IconEmbSvgPathType } from "@/components/fragments/IconEmbedSvg";

import DisplayResourceUrlAsIcon from "../../fragments/DisplayResourceUrlAsIcon";

interface Props {
  linkType: "Home Page" | "Admin Page" | "Source";
  size?: number;
  width?: number;
  height?: number;
  icon_className_Path1?: string;
  icon_className_Path2?: string;
  className?: string;
  isPrivateOnly?: boolean;
  entryUrl: string | undefined | null;
  entryVisibilityType: LabEntryVisibilityType;
  iconType: IconEmbSvgPathType;
}

const DisplayResourceConditionally: React.FC<Props> = ({
  linkType,
  size = 23,
  width = 23,
  height = 23,
  icon_className_Path1 = "fill-inherit",
  icon_className_Path2 = "fill-inherit",
  className,
  isPrivateOnly = true,
  entryUrl,
  entryVisibilityType,
  iconType,
}) => {
  const { session } = useAppContext();

  if (!entryUrl) {
    return null;
  }

  const t = msgs("LabEntries_CardPublic");

  if (!session && isPrivateOnly) {
    return null;
  }

  if (isPrivateOnly) {
    return (
      <DisplayResourceUrlAsIcon
        className={cn("", className)}
        height={height}
        iconType={iconType}
        icon_className_Path1={icon_className_Path1}
        icon_className_Path2={icon_className_Path2}
        label={t("tooltip_home_link", { linkType: linkType })}
        size={size}
        url={entryUrl}
        width={width}
      />
    );
  }

  return isPrivateOnly || (entryVisibilityType === "private" && !session) ? (
    <DisplayResourceUrlAsIcon
      className={cn("cursor-none", className)}
      height={height}
      iconType="lock-keyhole"
      icon_className_Path1={icon_className_Path1}
      icon_className_Path2={icon_className_Path2}
      isClickable={false}
      label={t("tooltip_home_link_private")}
      size={size}
      url={t("tooltip_home_link_private")}
      width={width}
    />
  ) : (
    <DisplayResourceUrlAsIcon
      className={cn("", className)}
      height={height}
      iconType={iconType}
      icon_className_Path1={icon_className_Path1}
      icon_className_Path2={icon_className_Path2}
      label={t("tooltip_home_link", { linkType: linkType })}
      size={size}
      url={entryUrl}
      width={width}
    />
  );
};

export default DisplayResourceConditionally;
