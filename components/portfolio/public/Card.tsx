import Link from "next/link";

import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import { Button } from "@/components/ui/button";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";
import styles from "app/_styles/card.module.css";

import ProjectLinks from "../common/ProjectLinks";

interface Props {
  className?: string;
  project: ProjectData;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const ProjectPublic_Card: React.FC<Props> = ({
  project,
  className,
  fileList,
  iconList,
  iconsMap,
  tags,
}) => {
  const t = msgs("Projects_CardPublic");

  const descriptionArr = project.html.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  return (
    <div
      className={cn("card-display-wrapper scroll-mt-20 3xl:scroll-mt-8", className)}
      id={`project_${project._id}`}
    >
      <div className={styles.card + " card-style"}>
        <div className="flex gap-2 items-center justify-start w-full">
          <IconCircleWrapper
            alt={project.title}
            src={
              project.html.icon?.metadata.html.fileUrl ?? project.html.icon?.metadata.html.fileUri
            }
            unoptimized={project.html.icon?.filename.match(/\.svg$/) ? true : false}
          />

          <div
            dangerouslySetInnerHTML={{ __html: project.html.title }}
            className="text-lg font-semibold line-clamp-2 flex-shrink leading-5 text-balance"
          />
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
          className="flex-grow line-clamp-2 pl-2"
        />

        <div className="flex flex-col 2xs:flex-row items-stretch justify-between gap-4 2xs:gap-2 w-full -mb-1 min-h-9">
          <ProjectLinks
            className="max-2xs:self-start pl-1 2xs:pl-0 translate-y-0.5"
            fileList={fileList}
            iconList={iconList}
            iconsMap={iconsMap}
            project={project}
            tags={tags}
          />

          <Link
            area-label={t("area_label_card_link")}
            className="max-2xs:self-end"
            href={`${Route.public.PORTFOLIO.uri}/${project.slug}`}
          >
            <Button
              className="transition-colors duration-300 hover:duration-150"
              size="sm"
              variant="defaultSecondary"
            >
              {t("button_call_to_action")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectPublic_Card;
