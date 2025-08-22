import React, { type CSSProperties } from "react";

import IconEmbedSvg, { type IconEmbSvgPathType } from "@/components/shared/IconEmbedSvg";

interface Props {
  text: string;
  onClick: () => void;
  bgColor?: string;
  icon?: {
    size?: number;
    color?: string;
    type?: IconEmbSvgPathType;
    style?: CSSProperties;
  };
  style?: CSSProperties;
}

const Btn_PostActions: React.FC<Props> = ({
  text,
  onClick,
  bgColor = "bg-white",
  icon = {
    type: "brush",
  },
  style,
}) => {
  return (
    <span className={`post_button ml-2 ${bgColor}`} style={{ ...style }} onClick={onClick}>
      <IconEmbedSvg
        height={20}
        style={{ zIndex: 10, display: "inline-block", marginRight: "3px", ...icon.style }}
        type={icon.type}
        width={20}
      />
      {text}
    </span>
  );
};

export default Btn_PostActions;
