"use client";
import Image from "next/image";
import React from "react";

import { type IconsMap } from "@/interfaces/IconsMap";

interface Props {
  className?: string;
  icon: IconsMap[string];
  width?: number;
  height?: number;
  theme?: "light" | "dark";
}

/**
 * For some reason the <Image/> component produces the following error for unoptimized SVGs here:
 * Image with src "https://..." has either width or height modified, but not the other.
 * If you use CSS to change the size of your image, also include the styles 'width: "auto"'
 * or 'height: "auto"' to maintain the aspect ratio.
 */
const DisplayIconLight: React.FC<Props> = ({ icon, width = 48, height = 48, theme = "light" }) => {
  const src =
    theme === "dark" ? icon?.uri?.dark || icon?.uri?.light : icon?.uri?.light || icon?.uri?.dark;
  const isSvg = /\.svg(?:\?v=.*$)/.exec(src || "") ? true : false;
  const Component = isSvg ? "img" : Image;

  return (
    <Component
      {...(isSvg ? {} : { priority: true, unoptimized: true })}
      alt={icon?.name || "Icon"}
      height={height}
      src={src}
      width={width}
    />
  );
};

export default DisplayIconLight;
