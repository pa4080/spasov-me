/**
 * @see https://vercel.com/dashboard/stores/blob
 * @see https://vercel.com/docs/storage/vercel-blob
 */

import { del, list, put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { errorMessages } from "@/app/api/common";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: Request): Promise<NextResponse> {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
	}

	if (!request.body) {
		return NextResponse.json(
			{
				error: "Request body is empty",
			},
			{ status: 500 }
		);
	}

	const { searchParams } = new URL(request.url);
	const filename = searchParams.get("filename");

	if (!filename) {
		return NextResponse.json(
			{
				error: "Missing filename",
			},
			{ status: 500 }
		);
	}

	const blob = await put(filename, request.body, {
		access: "public",
	});

	return NextResponse.json(blob);
}

/**
	* @example fetch("/api/blob")
	*
	{
		"hasMore": false,
		"blobs": [
			{
				"url": "https://zmav0fjeywgydpex.public.blob.vercel-storage.com/simple-vercel-replica.logo-Yp3Urwt01ayuboYadZFpXwqWeh2sdk.svg",
				"pathname": "simple-vercel-replica.logo.svg",
				"size": 5087,
				"uploadedAt": "2024-04-19T05:59:35.498Z"
			},
		]
	}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request): Promise<NextResponse> {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
	}

	const blobRes = await list();

	return NextResponse.json(blobRes);
}

export async function DELETE(request: Request): Promise<NextResponse> {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{
				error: "Missing file url",
			},
			{ status: 500 }
		);
	}

	del(url);

	return NextResponse.json({ url: url, deleted: true });
}
