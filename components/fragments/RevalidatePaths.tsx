"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { BsSendCheck } from "react-icons/bs";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { toast } from "@/components/ui/use-toast";
import { msgs } from "@/messages";

import { revalidatePaths } from "@/components/_common.actions";

interface Props {
	className?: string;
	paths?: string[];
}

const RevalidatePaths: React.FC<Props> = ({ className, paths }) => {
	const t = msgs("RevalidatePaths");
	const pathname = usePathname();
	const pathsToRevalidate = paths ? [...paths, pathname] : [pathname];
	const pathsToString = pathsToRevalidate
		.map((p, i, a) => `"${p}"${i === a.length - 2 ? " and " : i < a.length - 1 ? ", " : ""}`)
		.join("");

	const handleRevalidatePaths = async () => {
		try {
			const response = await revalidatePaths({ paths: pathsToRevalidate, redirectTo: pathname });

			if (response) {
				toast({
					description: (
						<div className="flex flex-col items-center gap-2 justify-center w-full">
							<div className="flex items-center gap-2 justify-between">
								<span
									dangerouslySetInnerHTML={{
										__html: t("toast_submitted", {
											paths: pathsToString,
										}),
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
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={className}>
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
