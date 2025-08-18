/**
 * The embedding requires @svgr/webpack to work.
 * @see https://stackoverflow.com/questions/61339259/how-to-dynamically-import-svg-and-render-it-inline
 * @see https://stackblitz.com/edit/nextjs-dynamic-svg-import?file=components%2Flazy-svg.tsx
 * @see https://react-svgr.com/docs/next/
 */
import dynamic from "next/dynamic";
import React, { type ComponentProps } from "react";

import { type IconsMap } from "@/interfaces/IconsMap";

interface Props extends ComponentProps<"svg"> {
  icon: IconsMap[string];
  size?: number;
  theme?: "light" | "dark";
}

const DisplayIconDynamicEmbed: React.FC<Props> = async ({ icon, theme = "light", ...props }) => {
  const svgFileRelative =
    theme === "dark" ? icon?.uri?.dark || icon?.uri?.light : icon?.uri?.light || icon?.uri?.dark;
  const name = `${svgFileRelative.slice(1).replace(/\.svg$/, "")}`;

  // Note: Having ".svg" literal here is required, otherwise we ending up with module not found
  const Svg = dynamic(() => import(`@/public/${name}.svg`));

  return <Svg {...props} />;
};

export default DisplayIconDynamicEmbed;
