"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

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
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { deletePageCard } from "../../_pages.actions";

export interface Props {
  className?: string;
  page_id: string;
  page_title: string;
}

const DeletePage: React.FC<Props> = ({ className, page_id, page_title }) => {
  const t = msgs("PageCards_Delete");

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleDeletePage = async () => {
    setSubmitting(true);

    try {
      const response = await deletePageCard(page_id, [
        pathname,
        Route.public.HOME.uri,
        Route.admin.FILES_MONGODB,
        Route.admin.FILES_CFR2,
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
    <div className={className}>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger onClick={() => setIsOpen(true)}>
          <IconEmbedSvg
            className={cn("grayscale-[100%] hover:grayscale-[0%] mt-1", className)}
            className_Path1="fill-accent"
            className_Path2="fill-accent-secondary"
            height={22}
            type="trash"
            width={22}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ring-secondary">{t("dialog_title")}</AlertDialogTitle>
            {t("dialog_description") && (
              <AlertDialogDescription
                className="hyphens-auto break-words"
                dangerouslySetInnerHTML={{
                  __html: t("dialog_description", { id: page_id, title: page_title }),
                }}
              />
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => handleDeletePage()}
            >
              {submitting ? t("dialog_btn_delete_submitting") : t("dialog_btn_delete")}
            </AlertDialogAction>
            <AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>
              {t("dialog_btn_cancel")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeletePage;
