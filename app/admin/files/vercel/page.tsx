"use client";

import { useEffect, useRef, useState } from "react";

import { Route } from "@/routes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { PutBlobResult } from "@vercel/blob";

export default function UploadPage() {
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [blob, setBlob] = useState<PutBlobResult | null>(null);
	const [list, setList] = useState<PutBlobResult[] | null>(null);

	const getList = async () => {
		const response = await fetch(Route.api.FILES_VERCEL_BLOB);
		const list = await response.json();

		setList(list.blobs as PutBlobResult[]);
	};

	const uploadBlob = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!inputFileRef.current?.files) {
			throw new Error("No file selected");
		}

		const file = inputFileRef.current.files[0];

		const response = await fetch(`${Route.api.FILES_VERCEL_BLOB}?filename=${file.name}`, {
			method: "POST",
			body: file,
		});

		const newBlob = (await response.json()) as PutBlobResult;

		setBlob(newBlob);
		getList();
	};

	const delBlob = async (blob: PutBlobResult) => {
		const response = await fetch(Route.api.FILES_VERCEL_BLOB + "?url=" + blob.url, {
			method: "DELETE",
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const data = await response.json();

		getList();
	};

	useEffect(() => {
		getList();
	}, []);

	return (
		<div className="margin_vh_top margin_vh_bottom space-y-12 scroll-m-40">
			<div>
				<h1 className="section_title">Upload Blob</h1>

				<form onSubmit={uploadBlob}>
					<div className="flex gap-4">
						<Input ref={inputFileRef} required name="file" type="file" />
						<Button type="submit">Upload</Button>
					</div>
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

			<div>
				<h1 className="section_title">Blobs</h1>
				<div className="space-y-4">
					{list?.map((blob) => (
						<div key={blob.url} className="flex gap-4 border rounded-md p-2 justify-between">
							<div className="space-y-2">
								<b>{blob.pathname}</b>
								<p>{blob.url}</p>
							</div>
							<Button onClick={() => delBlob(blob)}>Delete</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
