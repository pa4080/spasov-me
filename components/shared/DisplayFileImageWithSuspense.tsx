/**
 * @see https://github.com/vercel/next.js/discussions/50617
 */

import Image, { type ImageProps } from "next/image";
import React, { Suspense } from "react";

import { type FileData } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import siteLogo from "@/public/icons/svg/spasov.me.logo.svg";
import { Route } from "@/routes";

const ImageAsync: React.FC<
  ImageProps & {
    src: string;
    alt: string;
  }
> = async ({ src, alt, ...props }) => {
  return <Image alt={alt} src={src} {...props} />;
};

interface Props extends ImageProps {
  file?: FileData;
}

/**
 * If "file?: FileData;" is provided the image will be fetched from
 * "file.metadata.html.fileUri". Otherwise the "src" prop will be used.
 */
const DisplayFileImageWithSuspense: React.FC<Props> = ({
  className,
  file,
  style,
  sizes,
  src,
  ...props
}) => {
  const isDocument = file?.filename.match(/\.(pdf|pptx|xlsx|csv|txt|docx)$/);
  const thisSrc = file
    ? isDocument
      ? `${Route.assets.MIME_TYPE}/${file.filename.split(".").pop()}.png`
      : (file.metadata.html.fileUrl ?? file.metadata.html.fileUri)
    : src;

  const theProps = {
    ...props,
    alt: file?.filename ?? props.alt,
    className: cn("h-auto w-full", className),
  };

  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Image
            alt="Loading..."
            className={cn("h-auto w-full", className)}
            height={0}
            sizes={sizes}
            src={siteLogo as string}
            style={style}
            width={0}
          />
        </div>
      }
    >
      <ImageAsync
        height={0}
        sizes={sizes}
        src={thisSrc as string}
        style={style}
        width={0}
        {...theProps}
        unoptimized={
          file?.filename.match(/\.svg$/)
            ? true
            : false || /\.svg$/.exec(src as string)
              ? true
              : false
        }
      />
    </Suspense>
  );
};

export default DisplayFileImageWithSuspense;
