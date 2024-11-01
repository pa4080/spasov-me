"use client";
import React, { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { type FileData, type FileHtmlProps } from "@/interfaces/File";
import { type PostData } from "@/interfaces/Post";
import { type ProjectData } from "@/interfaces/Project";
import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";
import { type LabEntryData } from "@/interfaces/LabEntry";

import DisplayFileImageOrEmbed from "../DisplayFileImageOrEmbed";
import Navigation from "./GalleryCarouselNav";
import GalleryCarouselNavEmbedded from "./GalleryCarouselNavEmbedded";

interface Props {
  className?: string;
  gallery: FileHtmlProps[] | undefined;
  setIsOpen?: (arg: boolean) => void;
  counterAsText?: boolean;
  descriptionDisplay?: boolean;
  navPosition?: "top" | "bottom";
  navType?: "embedded" | "default" | "none";
  entryData?: ProjectData | PostData | LabEntryData;
}

const GalleryCarousel: React.FC<Props> = ({
  className,
  gallery,
  setIsOpen,
  counterAsText,
  descriptionDisplay,
  navPosition = "bottom",
  navType = "default",
  entryData,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current_carouselItem, setCurrent] = useState(0);
  const [carouselItems_count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const Nav: React.FC = () => {
    switch (navType) {
      case "embedded":
        if (!entryData) {
          return null;
        }

        return (
          <GalleryCarouselNavEmbedded
            carouselItems_count={carouselItems_count}
            counterAsText={counterAsText}
            current_carouselItem={current_carouselItem}
            descriptionDisplay={descriptionDisplay}
            entryData={entryData}
            gallery={gallery}
          />
        );
      case "default":
        return (
          <Navigation
            carouselItems_count={carouselItems_count}
            counterAsText={counterAsText}
            current_carouselItem={current_carouselItem}
            descriptionDisplay={descriptionDisplay}
            gallery={gallery}
            setIsOpen={setIsOpen}
          />
        );
      case "none":
        return null;
      default:
        return null;
    }
  };

  return (
    <Carousel
      className={cn("flex-grow w-full flex flex-col items-center justify-center", className)}
      opts={{
        align: "start",
        loop: true,
      }}
      setApi={setApi}
      style={
        {
          "--tw-drop-shadow": "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))",
        } as React.CSSProperties
      }
    >
      {navPosition === "top" && <Nav />}
      <CarouselContent
        className={cn("w-full h-full items-center ml-0 sa:-ml-2 flex-grow")}
        container_className={"w-[100vw] max-w-[92vw] drop-shadow-2xl"}
        container_style={
          {
            "--tw-drop-shadow":
              "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2)) drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12))",
          } as React.CSSProperties
        }
      >
        {gallery?.map((item, index) => {
          return (
            <CarouselItem
              key={index}
              className="w-full flex items-center justify-center pl-0.5 sa:pl-4 select-none"
            >
              <div
                className={cn(
                  "this-container relative w-full mx-auto",
                  navType === "embedded" || navType === "none"
                    ? "max-w-projectImageMaxWidth"
                    : "max-w-galleryImageMaxWidth"
                )}
                style={{
                  backgroundImage: `url(${Route.assets.LOGO_SVG})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "200px",
                  height: "100%",
                }}
              >
                <div className={cn("relative w-full", "pb-[56.25%] h-0")}>
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      "absolute top-0 left-0"
                    )}
                  >
                    <DisplayFileImageOrEmbed
                      className={cn("rounded-md w-auto mx-auto h-auto")}
                      file={
                        {
                          filename: item.filename,
                          metadata: {
                            html: item,
                          },
                        } as FileData
                      }
                      sizes={[
                        "360px",
                        "(max-width: 520px) 480px, (max-width: 640px) 560px, (max-width: 720px) 640px, (max-width: 920px) 820px, (max-width: 1024px) 940px, 1560px",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {navPosition === "bottom" && <Nav />}
    </Carousel>
  );
};

export default GalleryCarousel;
