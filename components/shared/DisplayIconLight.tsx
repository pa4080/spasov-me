"use client";
import React from "react";
import Image from "next/image";

import { type IconsMap } from "@/interfaces/IconsMap";

interface Props {
  className?: string;
  icon: IconsMap[string];
  width?: number;
  height?: number;
  theme?: "light" | "dark";
}

const DisplayIconLight: React.FC<Props> = ({ icon, width = 48, height = 48, theme = "light" }) => {
  return (
    <Image
      priority
      alt={icon?.name || "Icon"}
      height={height}
      src={
        theme === "dark" ? icon?.uri?.dark || icon?.uri?.light : icon?.uri?.light || icon?.uri?.dark
      }
      unoptimized={true}
      width={width}
    />
  );
};

export default DisplayIconLight;
