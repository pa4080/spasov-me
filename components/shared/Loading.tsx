import { cn } from "@/lib/cn-utils";

import SiteLogo from "../layouts/logo/SiteLogo";

interface Props {
  scale?: number;
  maxHeight?: string;
  className?: string;
  height?: string;
}

const Loading: React.FC<Props> = ({ scale = 2, maxHeight = "480px", height, className }) => (
  <div
    className={cn("flex items-center justify-center", className)}
    style={{
      height: height ?? `${192 * scale}px`,
      maxHeight,
    }}
  >
    <SiteLogo
      autoBreak={false}
      className="emphasize_drop_shadow"
      greeting_ln1="LOADING..."
      style={{ width: `${152 * scale}px`, height: `${28 * scale}px` }}
    />
  </div>
);

export default Loading;
