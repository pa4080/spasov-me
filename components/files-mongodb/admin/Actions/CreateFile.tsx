"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { createFile_mongo } from "@/components/files-mongodb/_files.actions";
import ButtonIcon from "@/components/fragments/ButtonIcon";
import { type File_FormSchema } from "@/components/fragments/files/Form/schema";
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
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";

// import FileForm from "../Form";
const FileForm = dynamic(() => import("@/components/fragments/files/Form"), {
  ssr: false,
  loading: () => <Loading />,
});

interface Props {
  className?: string;
}

const CreateFile: React.FC<Props> = ({ className }) => {
  const t = msgs("Files_Create");

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
  const pathname = usePathname();

  const handleCreateFile = async (data: File_FormSchema) => {
    setSubmitting(true);

    try {
      const response = await createFile_mongo(generateFormDataFromObject(data), [pathname]);

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
      setIsOpen(false);
    }
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger disabled={submitting}>
          <ButtonIcon
            className="pl-[0.75rem] pr-[0.7rem] rounded-lg icon_accent_secondary"
            height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
            label={t("dialog_btn_add")}
            labelSubmitting={t("dialog_btn_add_submitting")}
            submitting={submitting}
            type="file-circle-plus"
            width={42} // 62
            widthOffset={24}
            onClick={() => setIsOpen(true)}
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
                    __html: t("dialog_description", { id: "new id" }),
                  }}
                />
              )}
            </div>
          </DialogHeader>

          <FileForm
            className="mt-1"
            files_prefix="mongodb" // Important, determinate the file url!
            isContainerDialogOpen={isOpen}
            submitting={submitting}
            onSubmit={handleCreateFile}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateFile;
