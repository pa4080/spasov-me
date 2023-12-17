"use client";

import { useRef, useState } from "react";

import { Route } from "@/routes";

import type { PutBlobResult } from "@vercel/blob";

export default function AvatarUploadPage() {
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [blob, setBlob] = useState<PutBlobResult | null>(null);

	return (
		<div className="margin_vh_top margin_vh_bottom space-y-12">
			<h1 className="section_title">Upload Blob</h1>

			<form
				onSubmit={async (event) => {
					event.preventDefault();

					if (!inputFileRef.current?.files) {
						throw new Error("No file selected");
					}

					const file = inputFileRef.current.files[0];

					const response = await fetch(`${Route.api.BLOB}?filename=${file.name}`, {
						method: "POST",
						body: file,
					});

					const newBlob = (await response.json()) as PutBlobResult;

					setBlob(newBlob);
				}}
			>
				<input ref={inputFileRef} required name="file" type="file" />
				<button type="submit">Upload</button>
			</form>
			{blob && (
				<div>
					<b>Blob url:</b>{" "}
					<a className="text-ring hover:text-ring-secondary hover:underline" href={blob.url}>
						{blob.url}
					</a>
				</div>
			)}
		</div>
	);
}
