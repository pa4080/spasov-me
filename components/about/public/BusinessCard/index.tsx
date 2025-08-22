import Image from "next/image";

import Gallery from "@/components/shared/Gallery";
import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import TooltipWrapper from "@/components/shared/TooltipWrapper";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { type AboutEntryType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import UpdateAboutEntry from "../../admin/Actions/Update";
import styles from "./_business-card.module.css";

interface Props {
  entries: AboutEntryData[] | null;
  className?: string;
  type: AboutEntryType;
  fileList: FileListItem[] | null;
  tags: TagData[] | null;
  iconsMap: IconsMap;
}

const BusinessCard: React.FC<Props> = ({ entries, className, type, fileList, tags, iconsMap }) => {
  const tCommon = msgs("AboutEntries");
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

  const entry =
    entries
      ?.filter(({ entryType }) => entryType === type)
      ?.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null;

  const descriptionArr = entry?.html.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  const cvLink = entry?.gallery
    ?.find(({ filename }) => /\.pdf$/.exec(filename))
    ?.metadata.html.fileUrl?.replace(/\?.*$/, "");

  const getGallery = entry?.gallery
    ?.map((file) => file.metadata.html)
    ?.sort((a, b) => a.filename.localeCompare(b.filename));

  const gallery = getGallery ?? [];

  return (
    entry && (
      <div
        className={cn(
          styles.cardGrid,
          "relative flex flex-col sa:grid gap-4 xa:gap-8 sa:gap-6 mb-16",
          className
        )}
        id={toggle_target_id}
      >
        <div
          dangerouslySetInnerHTML={{ __html: entry.html.title }}
          className={cn(
            styles.cardGridTitle,
            "!leading-[1.2em] 6xs:!leading-[1.15em] font-unicephalon text-2xl 6xs:text-[7.8vw] xa:text-5xl sa:text-[2.5rem] mp:text-[2.75rem] ma:text-5xl tracking-wider text-foreground-secondary flex sa:flex-col justify-center sa:justify-end items-center sa:items-start text-center sa:text-left"
          )}
        />

        <div className={cn(styles.cardGridImage, "max-sa:relative")}>
          <div
            className={`rounded-full overflow-hidden p-2 3xs:p-3 sa:p-2 w-fit h-fit mx-auto select-none bg-secondary drop-shadow-[1px_2px_4px_rgba(17,17,17,0.4)] dark:bg-foreground-secondary dark:drop-shadow-[1px_2px_4px_rgba(17,17,17,1)]`}
            style={{
              backgroundImage: `url(${Route.assets.LOGO_SVG})`,
              backgroundPosition: "center",
              backgroundSize: "160px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Image
              priority
              alt={entry.title}
              className="rounded-full drop-shadow-[0_0_3px_rgba(85,85,85,1)] w-[186px] h-[186px] 6xs:w-[60vw] 6xs:h-[60vw] 3xs:w-[300px] 3xs:h-[300px] sa:w-[200px] sa:h-[200px]"
              fetchPriority="high"
              height={200}
              src={
                entry.html.attachment?.metadata.html.fileUrl ??
                entry.html.attachment?.metadata.html.fileUri ??
                Route.assets.LOGO_SVG
              }
              unoptimized={entry.html.attachment?.filename.match(/\.svg$/) ? true : false}
              width={200}
            />
          </div>

          <div className="absolute right-0 xs:right-4 sa:right-2 bottom-0 xs:bottom-0 sa:-bottom-8 bg-transparent flex flex-row gap-4 justify-center items-center">
            <a
              className="grayscale hover:grayscale-0 transition-all duration-200"
              href={cvLink}
              rel="noreferrer"
              target="_blank"
            >
              <IconEmbedSvg
                className_Path1="fill-accent-secondary"
                className_Path2="fill-accent"
                height={21}
                type={"download"}
                width={21}
              />
            </a>

            <TooltipWrapper
              className="w-full h-full flex items-center fill-inherit"
              tooltipText={gallery.length === 0 ? "" : tCommon("tooltip_gallery")}
            >
              <Gallery entry={entry} gallery={gallery} />
            </TooltipWrapper>

            <UpdateAboutEntry entry={entry} fileList={fileList} iconsMap={iconsMap} tags={tags} />
          </div>
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: descriptionArr?.[0] ?? "" }}
          className={cn(
            styles.cardGridDescription,
            "6xs:text-lg sa:text-base ma:text-lg font-semibold tracking-widest text-foreground-tertiary text-center sa:text-left"
          )}
        />
      </div>
    )
  );
};

export default BusinessCard;
