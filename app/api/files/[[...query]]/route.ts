/**
 * NOTE: This API doesn't posse all features implemented in "@/components/files/_files.actions.ts".
 *       Primary we are using the API's GET() method.
 * @see https://mongodb.github.io/mongo-csharp-driver/2.8/reference/gridfs/uploadingfiles/
 * @see https://mongodb.github.io/node-mongodb-native/6.0/classes/GridFSBucket.html#openUploadStream
 * @see https://mongodb.github.io/node-mongodb-native/6.0/classes/GridFSBucket.html#openUploadStreamWithId
 */
import { GridFSFile, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { FileDoc } from "@/interfaces/File";
import { authOptions } from "@/lib/auth-options";
import { connectToMongoDb, defaultChunkSize, gridFSBucket } from "@/lib/mongodb-mongoose";
import FileGFS from "@/models/file";
import { Route } from "@/routes";

import { errorMessages } from "../../common";

import { Readable } from "stream";

interface Context {
	params: { query: string[] };
}

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
				// In this case we just check does the file exists,
				// and redirect to the next case.

				const [fileId] = params?.query;
				const _id = new ObjectId(fileId);

				await connectToMongoDb();
				const file = (await FileGFS.find({ _id }))[0] as GridFSFile;

				if (!file) {
					return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
				}

				return NextResponse.redirect(
					new URL(
						`${Route.api.FILES}/${fileId}/${file?.filename}`,
						process.env.NEXTAUTH_URL ?? request.url
					),
					301
				);
			}

			case 2: {
				// We ant to use this path: /api/files/[id]/[filename],
				// because in this wej when we open the file in a new tab,
				// the save as option shows the correct filename.

				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [fileId, fileName] = params?.query;
				const _id = new ObjectId(fileId);

				await connectToMongoDb();
				const file = (await FileGFS.find({ _id }))[0] as GridFSFile;

				if (!file) {
					return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
				}

				const stream = bucket.openDownloadStream(_id) as unknown as ReadableStream;

				return new NextResponse(stream, {
					/**
					 * Actually we do not need to set headers manually...
					 *
					headers: {
						// "Content-Type": `image/${file.filename.split(".").at(-1)}`,
						"Content-Type": file?.metadata?.contentType || "image",
					},
					 */
					status: 200,
				});
			}

			default: {
				return NextResponse.json({ message: errorMessages.e501 }, { status: 501 });
			}
		}
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (params?.query?.length ?? 0 !== 0) {
			return NextResponse.json({ error: errorMessages.e510b }, { status: 510 });
		}

		switch (params?.query?.length ?? 0) {
			case 0: {
				// connect to the database and get the bucket
				const bucket = await gridFSBucket();
				// get the form data
				const data = await request.formData();

				const formEntries = Array.from(data.entries());
				const description = formEntries.find((entry) => entry[0] === "description")?.[1] as string;
				const file_name = formEntries.find((entry) => entry[0] === "name")?.[1] as string;
				const user_id = formEntries.find((entry) => entry[0] === "user_id")?.[1] as string;
				const file_form_field = formEntries.find((entry) => entry[0] === "file")?.[1];

				let responseObject: GridFSFile = {} as FileDoc;

				if (typeof file_form_field === "object") {
					// convert the file to a blob, alt.: file_form_field as Blob
					const file = file_form_field as File;
					const filename = file_name || file.name;

					// Convert the blob to stream
					const buffer = Buffer.from(await file.arrayBuffer());
					const stream = Readable.from(buffer);

					const uploadStream = bucket.openUploadStream(filename, {
						// Make sure to add content type so that it will be easier to set later.
						metadata: {
							description,
							creator: new ObjectId(user_id),
							size: file.size,
							contentType: file.type,
							lastModified: file.lastModified,
							originalName: file.name,
						},
						chunkSizeBytes: file.size < defaultChunkSize ? file.size + 16 : defaultChunkSize,
					});

					// Pipe the readable stream to a writeable stream to save it to the database
					const dbObject = stream.pipe(uploadStream);

					await new Promise((resolve, reject) => {
						uploadStream.on("finish", resolve);
						uploadStream.on("error", reject);
					});

					// Construct the response file object
					if (dbObject.id) {
						responseObject = {
							_id: dbObject.id,
							length: dbObject.length,
							chunkSize: dbObject.chunkSizeBytes,
							uploadDate: new Date(),
							filename: dbObject.filename,
							contentType: dbObject.options.contentType,
							metadata: dbObject.options.metadata,
						};
					}
				}

				if (Object.keys(responseObject).length === 0) {
					return NextResponse.json({ error: errorMessages.e400 }, { status: 400 });
				}

				return NextResponse.json({ data: responseObject }, { status: 201 });
			}

			default: {
				return NextResponse.json({ message: errorMessages.e501 }, { status: 501 });
			}
		}
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PATCH(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query || params.query.length !== 1) {
			return NextResponse.json({ error: errorMessages.e510b }, { status: 510 });
		}

		switch (params?.query?.length ?? 0) {
			case 1: {
				// Get the file document from the database
				const [fileId] = params?.query;
				const _id = new ObjectId(fileId);

				// Get the form data
				const data = await request.formData();
				const formEntries = Array.from(data.entries());
				const newDocData = {
					description: formEntries.find((entry) => entry[0] === "description")?.[1] as string,
					filename: formEntries.find((entry) => entry[0] === "name")?.[1] as string,
					user_id: formEntries.find((entry) => entry[0] === "user_id")?.[1] as string,
					fileFormField: formEntries.find((entry) => entry[0] === "file")?.[1],
				};

				let responseObject: GridFSFile = {} as FileDoc;
				// Connect to the database and get the bucket
				const bucket = await gridFSBucket();

				if (newDocData.fileFormField && typeof newDocData.fileFormField === "object") {
					/**
					 * In this case we need to replace the file itself,
					 * so firs we need to remove it from the database, and
					 * then we need to create a new one with the same _id.
					 */
					// Remove the file from the database
					await bucket.delete(_id);

					// convert the file to a blob, alt.: file_form_field as Blob
					const file = newDocData.fileFormField as File;
					const filename = newDocData.filename || file.name;

					// Convert the blob to stream
					const buffer = Buffer.from(await file.arrayBuffer());
					const stream = Readable.from(buffer);

					const uploadStream = bucket.openUploadStreamWithId(_id, filename, {
						metadata: {
							description: newDocData.description,
							creator: new ObjectId(newDocData.user_id),
							size: file.size,
							contentType: file.type,
							lastModified: new Date(file.lastModified),
							originalName: file.name,
						},
						chunkSizeBytes: file.size < defaultChunkSize ? file.size + 16 : defaultChunkSize,
					});

					// Pipe the readable stream to a writeable stream to save it to the database
					const dbDocumentNewContent = stream.pipe(uploadStream);

					await new Promise((resolve, reject) => {
						uploadStream.on("finish", resolve);
						uploadStream.on("error", reject);
					});

					// Construct the response file object
					if (dbDocumentNewContent.id) {
						responseObject = {
							_id: dbDocumentNewContent.id,
							length: dbDocumentNewContent.length,
							chunkSize: dbDocumentNewContent.chunkSizeBytes,
							uploadDate: new Date(),
							filename: dbDocumentNewContent.filename,
							contentType: dbDocumentNewContent.options.contentType,
							metadata: dbDocumentNewContent.options.metadata,
						};
					}
				} else {
					/**
					 * In this case we only need to update the "metadata", and/or the "filename".
					 * So we do not need to create a new file and stream its content.
					 */
					await connectToMongoDb();
					const dbDocument = await FileGFS.findOne(_id);

					if (!dbDocument) {
						return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
					}

					if (
						newDocData.description !== undefined &&
						dbDocument?.metadata?.description !== newDocData.description
					) {
						dbDocument.metadata.description = newDocData.description;
						dbDocument.save();
					}

					if (newDocData.filename !== undefined && dbDocument.filename !== newDocData.filename) {
						bucket.rename(_id, newDocData.filename);
					}

					responseObject = responseObject = {
						_id: dbDocument._id,
						length: dbDocument.length,
						chunkSize: dbDocument.chunkSize,
						uploadDate: dbDocument.uploadDate,
						filename: newDocData.filename,
						metadata: dbDocument.metadata,
					};
				}

				if (Object.keys(responseObject).length === 0) {
					return NextResponse.json({ error: errorMessages.e400 }, { status: 400 });
				}

				return NextResponse.json({ data: responseObject }, { status: 201 });
			}

			default: {
				return NextResponse.json({ message: errorMessages.e501 }, { status: 501 });
			}
		}
	} catch (error) {
		console.error(error);

		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query || params.query.length !== 1) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [fileId] = params.query;

		const bucket = await gridFSBucket();
		const _id = new ObjectId(fileId);
		const files = await bucket.find({ _id }).toArray();

		if (files.length === 0) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		await bucket.delete(_id);

		return NextResponse.json({ data: files[0], message: errorMessages.e205 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}
