/**
 * @see https://vercel.com/dashboard/stores/blob
 * @see https://vercel.com/docs/storage/vercel-blob
 */

import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";

import { errorMessages } from "../common";

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
