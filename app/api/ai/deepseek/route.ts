import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";

import { type DeepSeekApiRequest } from "@/interfaces/AI";
import { createForbiddenResponse, isSameOrigin } from "@/lib/api/origin-protection";
import { authOptions } from "@/lib/auth-options";

export const revalidate = 0;

export async function POST(request: NextRequest) {
  const isSameOrig = isSameOrigin(request);
  const session = await getServerSession(authOptions);

  if (!isSameOrig || !session) {
    return createForbiddenResponse();
  }

  const { prompt, temperature, max_tokens, model } = (await request.json()) as DeepSeekApiRequest;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return new Response("Missing API_KEY", { status: 500 });
  }

  const abortController = new AbortController();

  request.signal.addEventListener("abort", () => {
    // eslint-disable-next-line no-console
    console.log("DeepSeek request aborted by client");

    abortController.abort();
  });

  try {
    const request = {
      model: model ?? "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "user", content: prompt },
      ],
      temperature: temperature ?? 0.7,
      max_tokens: max_tokens ?? 256,
      stream: true,
    };

    const upstream = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
      signal: abortController.signal,
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();

      return new Response(`DeepSeek error: ${text}`, { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    if ((err as Error).name === "AbortError") {
      // eslint-disable-next-line no-console
      console.log("DeepSeek request aborted by client");

      return new Response(null, { status: 499 });
    }

    console.error("DeepSeek API Route Error:", err);

    return new Response("Internal Server Error", { status: 500 });
  }
}
