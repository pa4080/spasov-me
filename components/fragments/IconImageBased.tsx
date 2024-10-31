import Image from "next/image";
import React, { type CSSProperties } from "react";

import { type FilesImagesExtensions } from "@/interfaces/_common-data-types";

// import IconA from "@/public/images/icons/items/Address.svg";

export interface IconInvocation {
  name: string; // name
  extension?: FilesImagesExtensions; // extension
  location?: "assets" | "images"; // type
  style?: CSSProperties;
  size?: number;
}

export interface IconProps {
  icon: IconInvocation;
  width?: number;
  height?: number;
  size?: number; // size in pixels: width = height = size
  style?: CSSProperties;
  [unknownProp: string]: unknown;
}

const IconImageBased: React.FC<IconProps> = ({
  icon,
  size = 22,
  width,
  height,
  style,
  ...rest
}) => {
  const file = `${icon.name}.${icon.extension ?? "svg"}`;
  const iconUri = `/${icon.location ?? "assets"}/icons/${file}`;

  size = icon.size ?? size;
  width = width ?? size;
  height = height ?? size;

  return (
    <Image
      priority
      alt={`Icon for ${icon.name}`}
      height={height}
      src={iconUri}
      width={width}
      {...rest}
      className="icon"
      draggable={false}
      style={{ width, height, ...icon.style, ...style }}
      unoptimized={/\.svg$/.exec(iconUri) ? true : false}
    />
  );
};

export default IconImageBased;
