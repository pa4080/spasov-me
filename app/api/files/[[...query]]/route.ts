import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId, GridFSFile } from "mongodb";

import { authOptions } from "@/lib/auth-options";
import { gridFSBucket } from "@/lib/mongodb-mongoose";
import GridFS from "@/models/grid_fs";

import { errorMessages } from "../../common";

import { Readable } from "stream";

interface Context {
	params: { query: string[] };
}

/**
 * 1) If the query has 2 parameters,
 *    the first must be the string "id" and the second must be the {id} itself.
 * 2) If the query has 1 parameter, it must be the {filename}.
 *    > If the filename is not found in the database then return the file list
 *      or 404 in case the bucket is empty.
 *    > It is possible to have multiple files with the same name.
 *      In this case, also, an array of files will be returned.
 * 3) If the query has no parameters, return the file list.
 */
export async function GET(request: NextRequest, { params }: Context) {
	try {
		// connect to the database and get the bucket
		const bucket = await gridFSBucket();

		switch (params?.query?.length ?? 0) {
			// Return the list of all files
			case 0: {
				const files = await bucket.find().toArray();

				if (files?.length === 0) {
					return new NextResponse(null, { status: 404, statusText: errorMessages.e404 });
				}

				return NextResponse.json({ data: files }, { status: 200 });
			}

			case 1: {
				const [fileId] = params?.query;
				const _id = new ObjectId(fileId);

				const file = (await GridFS.find({ _id }))[0] as GridFSFile;

				if (!file) {
					return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
				}

				const stream = bucket.openDownloadStream(_id) as unknown as ReadableStream;

				return new NextResponse(stream, {
					headers: {
						"Content-Type": file?.contentType || "image",
					},
					status: 200,
				});
			}
		}
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

/**
 * Post a file to the database.
 * An example of how to post a file using fetch:
 *
const formData = new FormData();
formData.append('file', file); // 'file' is the key name for the uploaded file

fetch('/api/files/', { method: 'POST', body: formData })
 	.then(response => response.json())
 	.then(data => { console.log(data); })
 	.catch(error => { console.error(error); });
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest, { params }: Context) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
	}

	try {
		// connect to the database and get the bucket
		const bucket = await gridFSBucket();
		// get the form data
		const data = await request.formData();

		const response = [];
		const formEntries = Array.from(data.entries());
		const description = formEntries.find((entry) => entry[0] === "description")?.[1] as string;
		const fileName = formEntries.find((entry) => entry[0] === "name")?.[1] as string;
		const user_id = formEntries.find((entry) => entry[0] === "user_id")?.[1] as string;
		const file = formEntries.find((entry) => entry[0] === "file")?.[1];

		if (typeof file === "object") {
			const blob = file as File; // convert the file to a blob, alt.: file as Blob
			const filename = fileName || blob.name;

			//convert the blob to stream
			const buffer = Buffer.from(await blob.arrayBuffer());
			const stream = Readable.from(buffer);

			const uploadStream = bucket.openUploadStream(filename, {
				// make sure to add content type so that it will be easier to set later.
				contentType: blob.type,
				metadata: {
					description,
					creator: new ObjectId(user_id),
				},
			});

			// pipe the readable stream to a writeable stream to save it to the database
			const dbObject = stream.pipe(uploadStream!);

			response.push({ filename, _id: dbObject.id.toString() });
		}

		if (response.length === 0) {
			return NextResponse.json({ error: errorMessages.e400 }, { status: 400 });
		}

		return NextResponse.json({ data: response }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

/**
 * Delete a file from the database.
 * An example of how to delete a file using fetch:
 *
fetch('/api/files/123', { method: 'DELETE' })
  .then(response => {
    if (response.ok) console.log('File deleted successfully');
    else if (response.status === 404) console.log('File not found');
    else console.error('Error deleting file');
  })
  .catch(error => { console.error(error); });
 */
export async function DELETE(request: NextRequest, { params }: Context) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
	}

	if (!params.query || params.query.length !== 1) {
		return NextResponse.json({ error: errorMessages.e510 }, { status: 510 });
	}

	const [id] = params.query;

	try {
		const bucket = await gridFSBucket();
		const fileId = new ObjectId(id);
		const files = await bucket.find({ _id: fileId }).toArray();

		if (files.length === 0) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		await bucket.delete(fileId);

		return NextResponse.json({ data: files[0], message: errorMessages.e205 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}
