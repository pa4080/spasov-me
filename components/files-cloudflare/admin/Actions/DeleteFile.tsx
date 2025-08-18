"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { deleteFile } from "@/components/files-cloudflare/_files.actions";
import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import serverActionResponseToastAndLocationReload from "@/components/shared/ServerActionResponseNotify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { type FileData } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

export interface Props {
  className?: string;
  file: FileData;
  files_prefix: string;
}

const DeleteFile: React.FC<Props> = ({ className, file, files_prefix }) => {
  const t = msgs("Files_Delete");

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleDeleteEntry = async () => {
    setSubmitting(true);

    try {
      const response = await deleteFile({
        file_id: file._id,
        paths: [pathname],
        prefix: files_prefix,
      });

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

  const isDisabled =
    !!(file.metadata.attachedTo && file.metadata.attachedTo?.length > 0) || submitting;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger disabled={isDisabled}>
        <IconEmbedSvg
          className={cn(
            "grayscale-[100%]",
            isDisabled ? "opacity-60 hover:grayscale-[100%]" : "hover:grayscale-[0%]",
            className
          )}
          className_Path1="fill-accent"
          className_Path2="fill-accent-secondary"
          cursor={isDisabled ? "not-allowed" : "pointer"}
          height={21}
          type="trash"
          width={21}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-ring-secondary">{t("dialog_title")}</AlertDialogTitle>
          {t("dialog_description") && (
            <AlertDialogDescription
              className="hyphens-auto break-words"
              dangerouslySetInnerHTML={{
                __html: t("dialog_description", { filename: file.filename, id: file._id }),
              }}
            />
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => handleDeleteEntry()}
          >
            {submitting ? t("dialog_btn_delete_submitting") : t("dialog_btn_delete")}
          </AlertDialogAction>
          <AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>
            {t("dialog_btn_cancel")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFile;
