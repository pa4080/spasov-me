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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";

import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Post from "@/models/post";
import User from "@/models/user";
import Page from "@/models/page";

interface Context {
	params: { query: string[] };
}

function idFindObject(id: string) {
	return id ? { _id: id } : {};
}

export async function GET(request: NextRequest, { params }: Context) {
	if (!params.query) {
		return NextResponse.json({ error: "Extensions to the request are required." }, { status: 510 });
	}

	const [type, id] = params.query;

	try {
		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let response: Omit<any, never>[] = [];

		switch (type) {
			case "pages": {
				response = await Page.find(idFindObject(id)).populate(["creator", "image"]);
				break;
			}

			case "posts": {
				response = await Post.find(idFindObject(id)).populate(["creator", "image"]);
				break;
			}

			case "users": {
				response = await User.find(idFindObject(id));
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
		return NextResponse.json({ error: "Failed to retrieve!" }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: Context) {
	if (!params.query) {
		return NextResponse.json({ error: "Extensions to the request are required." }, { status: 510 });
	}

	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
	}

	const [type] = params.query;
	const request_object = await request.json();

	try {
		await connectToMongoDb();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let db_object: any;

		switch (type) {
			case "pages": {
				db_object = new Page(request_object);
				break;
			}

			case "posts": {
				db_object = new Post(request_object);
				break;
			}

			case "users": {
				db_object = new User(request_object);
				break;
			}
		}

		await db_object.save();
		await db_object.populate(["creator", "image"]);

		return NextResponse.json(
			{
				message: { type, created: true, method: request.method },
				data: db_object,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
		// return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: Context) {
	const { creator, prompt, tags, aiCategory, link, image } = await request.json();

	try {
		await connectToMongoDb();
		const updatedPost = await Post.findOneAndUpdate(
			idFindObject(params[1]),
			{ creator, prompt, tags, aiCategory, link, image },
			{ new: true }
		);

		if (!updatedPost) {
			return NextResponse.json({ error: "Post not found!" }, { status: 404 });
		}

		await updatedPost.populate(["creator", "image"]);

		return NextResponse.json(
			{ message: "Post updated successfully!", post: updatedPost },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error: "Failed to update post!" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest, { params }: Context) {
	const { creator, prompt, tags, aiCategory, link, image } = await request.json();

	try {
		await connectToMongoDb();

		const updatedPost = await Post.findOneAndUpdate(
			idFindObject(params),
			{ creator, prompt, tags, aiCategory, link, image },
			{ new: true }
		);

		if (!updatedPost) {
			return NextResponse.json({ error: "Post not found!" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Post updated successfully!", post: updatedPost },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error: "Failed to update post!" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Context) {
	try {
		await connectToMongoDb();

		const deletedPost = await Post.findOneAndDelete(idFindObject(params));

		if (!deletedPost) {
			return NextResponse.json({ error: "Post not found!" }, { status: 404 });
		}

		return NextResponse.json({ message: "Post deleted successfully!" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to delete post!" }, { status: 500 });
	}
}
