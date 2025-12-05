import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();

  return NextResponse.json({
    method: req.method,
    authenticated: !!session,
    session,
  });
}
