import Image from "next/image";

import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";

interface Props {
  className?: string;
  className_Image?: string;
  title: string;
  src?: string;
  unoptimized?: boolean;
  size?: number;
}

const Logo_CircleWrapper: React.FC<Props> = ({
  title,
  src,
  unoptimized,
  className,
  className_Image,
  size = 44,
}) => {
  return (
    <div
      className={cn(
        "rounded-full overflow-clip bg-primary/80",
        "flex items-center justify-center z-10",
        "min-w-[3rem] min-h-[3rem] p-1",
        // "min-w-[3.8rem] min-h-[3.8rem] drop-shadow-2xl",
        className
      )}
      style={
        {
          "--tw-drop-shadow": "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))",
        } as React.CSSProperties
      }
    >
      <Image
        alt={title}
        className={cn(
          "size-10",
          // "size-12",
          className_Image
        )}
        height={size}
        src={src ?? Route.assets.LOGO_SVG}
        style={{
          filter: src ? "" : "grayscale(1)",
        }}
        unoptimized={unoptimized}
        width={size}
      />
    </div>
  );
};

export default Logo_CircleWrapper;
