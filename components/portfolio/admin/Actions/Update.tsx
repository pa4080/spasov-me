"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { type ButtonIconProps } from "@/components/fragments/ButtonIcon";
import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import Loading from "@/components/fragments/Loading";
import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/AppContext";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { updateProject } from "../../_portfolio.actions";
import { type Project_FormSchema } from "../Form/schema";

const ProjectForm = dynamic(() => import("../Form"), {
  ssr: false,
  loading: () => <Loading height="100%" maxHeight="100%" />,
});

interface Props {
  className?: string;
  project: ProjectData;
  dialogTrigger_buttonIconProps?: ButtonIconProps;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const UpdateProject: React.FC<Props> = ({
  className,
  project,
  fileList,
  iconList,
  iconsMap,
  tags,
}) => {
  const t = msgs("Projects_Update");
  const entryTypeLabel = (
    msgs("Projects_Form")("project_type_list") as unknown as Record<string, string>
  )[project.entryType];

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { session } = useAppContext();

  const handleUpdateProject = async (data: Project_FormSchema) => {
    setSubmitting(true);
    try {
      /**
       * In case we were used <form action={addPage}> this conversion will not be needed,
       * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
       * form.action()... @see https://stackoverflow.com/a/40552372/6543935
       */

      const response = await updateProject(generateFormDataFromObject(data), project._id, [
        pathname,
        Route.public.PORTFOLIO.uri,
        Route.admin.FILES_MONGODB,
        Route.admin.FILES_CFR2,
      ]);

      serverActionResponseToastAndLocationReload({
        trigger: !!response,
        msgSuccess: t("toast_success"),
        msgError: t("toast_error"),
        // redirectTo: pathname,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      // setIsOpen(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={className}
        disabled={submitting || !session}
        onClick={() => setIsOpen(true)}
      >
        <IconEmbedSvg
          className="grayscale-[100%] hover:grayscale-[0%]"
          className_Path1="fill-accent-secondary"
          className_Path2="fill-accent"
          height={23}
          type={"screwdriver-wrench"}
          width={23}
        />
      </DialogTrigger>
      <DialogContent
        className="ma:max-w-[calc(100%_-_2rem)] ma:w-full ma:h-[calc(100%_-_2rem)] flex flex-col"
        closeOnOverlayClick={false}
      >
        <DialogHeader>
          <div className="flex flex-col gap-1">
            <DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
            {t("dialog_description") && (
              <DialogDescription
                dangerouslySetInnerHTML={{
                  __html: t("dialog_description", { id: project._id }),
                }}
              />
            )}
          </div>
        </DialogHeader>

        <ProjectForm
          className={t("dialog_description") ? "mt-0" : "mt-1"}
          entryType={project.entryType}
          fileList={fileList}
          formData={project}
          iconList={iconList}
          iconsMap={iconsMap}
          submitting={submitting}
          tags={tags}
          onClose={() => setIsOpen(false)}
          onSubmit={handleUpdateProject}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProject;
