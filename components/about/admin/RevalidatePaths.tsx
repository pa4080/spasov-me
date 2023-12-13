"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { BsSendCheck } from "react-icons/bs";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { revalidatePaths } from "../_about.actions";

import { GenericActionProps } from ".";

const RevalidatePaths: React.FC<GenericActionProps> = ({ className }) => {
	const t = msgs("AboutCV_RevalidatePaths");
	const pathname = usePathname();
	const paths = [pathname, Route.public.ABOUT.uri];

	const handleRevalidatePaths = async () => {
		try {
			const response = await revalidatePaths(paths);

			if (response) {
				toast({
					description: (
						<div className="flex flex-col items-center gap-2 justify-center w-full">
							<div className="flex items-center gap-2 justify-between">
								<span className="text-base">
									{t("toast_submitted", {
										paths: paths
											.map(
												(path, index, arr) =>
													`"${path}"${
														index === arr.length - 2 ? " and " : index < arr.length - 1 ? ", " : ""
													}`
											)
											.join(""),
									})}
								</span>
								<span className="text-3xl">
									<BsSendCheck />
								</span>
							</div>
						</div>
					),
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={cn(className)}>
			<ButtonIcon
				className="rounded-lg icon_accent_secondary"
				height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
				label={t("btn_revalidate")}
				labelSubmitting={t("btn_revalidate_submitting")}
				type="arrow-rotate-right"
				width={26} // 62
				widthOffset={24}
				onClick={handleRevalidatePaths}
			/>
		</div>
	);
};

export default RevalidatePaths;
