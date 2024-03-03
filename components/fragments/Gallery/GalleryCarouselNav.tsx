"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FileHtmlProps } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

interface Props {
	className?: string;
	gallery: FileHtmlProps[] | undefined;
	current_carouselItem: number;
	carouselItems_count: number;
	setIsOpen?: (arg: boolean) => void;
}

const Navigation: React.FC<Props> = ({
	className,
	gallery,
	current_carouselItem,
	carouselItems_count,
	setIsOpen,
}) => {
	const t = msgs("Gallery");

	return (
		<div className={cn("w-full flex flex-wrap gap-2 justify-between items-end", className)}>
			{/* Close button */}
			{setIsOpen && (
				<Button className="hidden sa:block" type="button" onClick={() => setIsOpen(false)}>
					{t("dialog_btn_close")}
				</Button>
			)}

			{/* Description and Counter */}
			<div>
				{gallery && current_carouselItem > 0 && (
					<div
						dangerouslySetInnerHTML={{ __html: gallery[current_carouselItem - 1].description }}
						className="flex-shrink"
					></div>
				)}
				<div className="text-center text-sm text-muted-foreground min-w-20">
					{t("counter", { current: current_carouselItem, count: carouselItems_count })}
				</div>
			</div>

			{/* Next/Previous buttons and Counter */}
			<div className="flex gap-3">
				<CarouselPrevious unstyled variant="default" />
				<CarouselNext unstyled variant="default" />
			</div>
		</div>
	);
};

export default Navigation;
