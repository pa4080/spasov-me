"use client";

import React from "react";
import { BsSendCheck } from "react-icons/bs";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { toast } from "@/components/ui/use-toast";
import { msgs } from "@/messages";
import { vercelRebuildMaster } from "@/components/_common.actions";

interface Props {
  className?: string;
}

const RebuildMasterVercel: React.FC<Props> = ({ className }) => {
  const t = msgs("RebuildMasterVercel");

  const handleVercelRebuildMaster = async () => {
    try {
      const response = await vercelRebuildMaster();

      // eslint-disable-next-line no-console
      console.log("response", response);

      toast({
        description: (
          <div className="flex flex-col items-center gap-2 justify-center w-full">
            <div className="flex items-center gap-2 justify-between">
              <span
                dangerouslySetInnerHTML={{
                  __html: response
                    ? t("toast_success", {
                        url: String(process.env.NEXT_PUBLIC_VERCEL_BUILD_BOARD),
                      })
                    : t("toast_error"),
                }}
                className="text-base"
              />

              <span className="text-3xl">
                <BsSendCheck />
              </span>
            </div>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={className}>
      <ButtonIcon
        className="rounded-lg icon_accent_secondary pl-0 pr-[0.35rem]"
        height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
        label={t("btn_rebuild")}
        labelSubmitting={t("btn_rebuild_submitting")}
        type="cloud-arrow-up"
        width={43} // 62
        widthOffset={1}
        onClick={handleVercelRebuildMaster}
      />
    </div>
  );
};

export default RebuildMasterVercel;
