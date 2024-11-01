"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { type File_FormSchema } from "@/components/fragments/files/Form/schema";
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
import { type FileData } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { updateFile_mongo } from "../../_files.actions";

const FileForm = dynamic(() => import("@/components/fragments/files/Form"), {
  ssr: false,
  loading: () => <Loading />,
});

interface Props {
  className?: string;
  file: FileData;
}

const UpdateFile: React.FC<Props> = ({ className, file }) => {
  const t = msgs("Files_Update");

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleUpdateFile = async (data: File_FormSchema) => {
    setSubmitting(true);

    try {
      const response = await updateFile_mongo(generateFormDataFromObject(data), file._id, [
        pathname,
        Route.admin.ABOUT,
        Route.admin.PORTFOLIO,
        Route.admin.PAGES,
      ]);

      serverActionResponseToastAndLocationReload({
        trigger: !!response,
        msgSuccess: t("toast_success"),
        msgError: t("toast_error"),
        redirectTo: pathname,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger disabled={submitting} onClick={() => setIsOpen(true)}>
        <IconEmbedSvg
          className={cn("grayscale-[100%] hover:grayscale-[0%]", className)}
          className_Path1="fill-accent-secondary"
          className_Path2="fill-accent"
          height={23}
          type={"screwdriver-wrench"}
          width={23}
        />
      </DialogTrigger>
      <DialogContent
        className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
        closeOnOverlayClick={false}
      >
        <DialogHeader>
          <div className="flex flex-col gap-1">
            <DialogTitle>{t("dialog_title")}</DialogTitle>
            {t("dialog_description") && (
              <DialogDescription
                dangerouslySetInnerHTML={{
                  __html: t("dialog_description", { filename: file.filename, id: file._id }),
                }}
              />
            )}
          </div>
        </DialogHeader>

        <FileForm
          className={t("dialog_description") ? "mt-0" : "mt-1"}
          files_prefix={"mongodb"}
          formData={file}
          isContainerDialogOpen={isOpen}
          submitting={submitting}
          onSubmit={handleUpdateFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFile;
