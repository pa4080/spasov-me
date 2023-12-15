/**
 * @see https://nextjs.org/docs/app/api-reference
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * @see Ref: https://youtu.be/wm5gMKuwSYk?t=7699
 *
 * @note The PATCH and DELETE functions are created bt the help of the
 * 			 VSC extension Bito GPT-4 AI. To check how this is implemented
 *       in the original guide you can @see https://youtu.be/wm5gMKuwSYk?t=10336
 *
 * Spas Z. Spasov REST API Implementation notes:
 * A route file (only for app/ router) allows you
 * to create custom request handlers for a given route.
 *
 * export async function GET(request: Request) {}     // GET:  Retrieve a resource(s)
 * export async function HEAD(request: Request) {}    // HEAD: Retrieve resource metadata
 * export async function POST(request: Request) {}    // POST: Create a new resource
 * export async function PUT(request: Request) {}     // PUT:  Update a resource
 * export async function PATCH(request: Request) {}   // PATCH: Partially update a resource
 * export async function DELETE(request: Request) {}  // DELETE: Delete a resource
 * export async function OPTIONS(request: Request) {} // OPTIONS: Retrieve resource options
 *
 * If `OPTIONS` is not defined, Next.js will automatically
 * implement `OPTIONS` and  set the appropriate Response
 * `Allow` header depending on the other methods defined
 * in the route handler.
 *
 * Example of a route and query params:
 *
 *		/api/data 				  -> params: {}
 *		/api/data/posts     -> params: { query: [ 'posts' ] }
 *		/api/data/posts/id  -> params: { query: [ 'posts', 'id' ] }
 *
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import AboutEntry from "@/models/about-entry";

import { authOptions } from "@/lib/auth-options";

import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Page from "@/models/page";
import Post from "@/models/post";
import User from "@/models/user";

import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";

import { errorMessages } from "../../common";

interface Context {
	params: { query: string[] };
}

function _id(id: string) {
	return id ? { _id: id } : {};
}

export async function GET(request: NextRequest, { params }: Context) {
	try {
		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let response: Omit<any, never>[] = [];

		switch (type) {
			case "pages": {
				response = await Page.find(_id(id)).populate(["creator", "image"]);
				break;
			}

			case "about-entries": {
				response = await AboutEntry.find(_id(id)).populate(["creator", "image"]);
				break;
			}

			case "posts": {
				response = await Post.find(_id(id)).populate(["creator", "image"]);
				break;
			}

			case "users": {
				response = await User.find(_id(id));
				break;
			}
		}

		return NextResponse.json(
			{
				message: { type, length: response.length, method: request.method },
				data: response,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type] = params.query;

		if (!type) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const request_object = await request.json();

		deleteFalsyKeys(request_object);

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let dbDocModel: any;

		switch (type) {
			case "pages": {
				dbDocModel = new Page(request_object);
				break;
			}

			case "posts": {
				dbDocModel = new Post(request_object);
				break;
			}

			case "users": {
				dbDocModel = new User(request_object);
				break;
			}

			case "about-entries": {
				dbDocModel = new AboutEntry(request_object);
				break;
			}

			default: {
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
			}
		}

		await dbDocModel.save();

		if (dbDocModel.this.props.attachment) {
			await dbDocModel.populate(["creator", "attachment"]);
		} else {
			await dbDocModel.populate(["creator", "image"]);
		}

		return NextResponse.json(
			{
				message: { type, created: true, method: request.method },
				data: dbDocModel,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		if (!type || !id) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const request_object = await request.json();

		deleteFalsyKeys(request_object);

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let dbDocModel: any;

		switch (type) {
			case "pages": {
				dbDocModel = Page;
				break;
			}

			case "posts": {
				dbDocModel = Post;
				break;
			}

			case "users": {
				dbDocModel = User;
				break;
			}

			case "about-entries": {
				dbDocModel = AboutEntry;
				break;
			}

			default: {
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
			}
		}

		const updatedDocument = await dbDocModel.findOneAndUpdate(_id(id), request_object, {
			new: true,
			strict: true,
		});

		if (!request_object.image && updatedDocument.image) {
			updatedDocument.image = undefined;
		}

		if (!request_object.attachment && updatedDocument.attachment) {
			updatedDocument.attachment = undefined;
		}

		updatedDocument.save();

		if (!updatedDocument) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		if (updatedDocument.attachment) {
			await updatedDocument.populate(["creator", "attachment"]);
		} else {
			await updatedDocument.populate(["creator", "image"]);
		}

		return NextResponse.json(
			{
				message: { type, updated: true, method: request.method },
				data: updatedDocument,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

// The same as PUT()...
export async function PATCH(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		if (!type || !id) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const request_object = await request.json();

		deleteFalsyKeys(request_object);

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let dbDocModel: any;

		switch (type) {
			case "pages": {
				dbDocModel = Page;
				break;
			}

			case "posts": {
				dbDocModel = Post;
				break;
			}

			case "users": {
				dbDocModel = User;
				break;
			}

			case "about-entries": {
				dbDocModel = AboutEntry;
				break;
			}

			default: {
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
			}
		}

		const updatedDocument = await dbDocModel.findOneAndUpdate(_id(id), request_object, {
			new: true,
			strict: true,
		});

		if (!request_object.image && updatedDocument.image) {
			updatedDocument.image = undefined;
		}

		if (!request_object.attachment && updatedDocument.attachment) {
			updatedDocument.attachment = undefined;
		}

		updatedDocument.save();

		if (!updatedDocument) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		if (updatedDocument.attachment) {
			await updatedDocument.populate(["creator", "attachment"]);
		} else {
			await updatedDocument.populate(["creator", "image"]);
		}

		return NextResponse.json(
			{
				message: { type, updated: true, method: request.method },
				data: updatedDocument,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Context) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: errorMessages.e401 }, { status: 401 });
		}

		if (!params.query || params.query.length !== 2) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		const [type, id] = params.query;

		if (!type || !id) {
			return NextResponse.json({ error: errorMessages.e510a }, { status: 510 });
		}

		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let dbDocModel: any;

		switch (type) {
			case "pages": {
				dbDocModel = Page;
				break;
			}

			case "posts": {
				dbDocModel = Post;
				break;
			}

			case "users": {
				dbDocModel = User;
				break;
			}

			case "about-entries": {
				dbDocModel = AboutEntry;
				break;
			}

			default: {
				return NextResponse.json({ error: errorMessages.e501 }, { status: 501 });
			}
		}

		const deletedDocument = await dbDocModel.findOneAndDelete(_id(id));

		if (!deletedDocument) {
			return NextResponse.json({ error: errorMessages.e404 }, { status: 404 });
		}

		return NextResponse.json(
			{
				message: { type, delete: true, method: request.method },
				data: deletedDocument,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, message: errorMessages.e500a }, { status: 500 });
	}
}
