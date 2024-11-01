/**
 * @check the differences with '@/api/posts/[[...id]]/route.ts'
 */
import { type NextRequest, NextResponse } from "next/server";

import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import User from "@/models/user";

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * @example fetch(`/api/users/${useId}/data`)
 */
export async function GET(request: NextRequest, props: Context) {
  const params = await props.params;

  try {
    await connectToMongoDb();
    const userId = params?.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = (await User.find({ _id: userId }))[0];

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to retrieve a user!" }, { status: 200 });
  }
}
