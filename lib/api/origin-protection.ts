import type { NextRequest } from "next/server";

/**
 * Checks if the request is coming from the same origin
 * @param request - The incoming NextRequest
 * @returns boolean - true if same origin, false otherwise
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // Allow requests without origin/referer (like direct API calls from server)
  if (!origin && !referer) {
    return false;
  }

  // Check origin header
  if (origin) {
    const originHost = new URL(origin).host;

    return originHost === host;
  }

  // Fallback to referer header
  if (referer) {
    const refererHost = new URL(referer).host;

    return refererHost === host;
  }

  return false;
}

/**
 * Returns a 403 Forbidden response for cross-origin requests
 */
export function createForbiddenResponse() {
  return new Response(JSON.stringify({ error: "Forbidden: Cross-origin requests not allowed" }), {
    status: 403,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
