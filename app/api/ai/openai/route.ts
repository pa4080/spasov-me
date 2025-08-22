import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";

import { type OpenAiApiRequest } from "@/interfaces/AI";
import { createForbiddenResponse, isSameOrigin } from "@/lib/api/origin-protection";
import { authOptions } from "@/lib/auth-options";

export const revalidate = 0;

export async function POST(request: NextRequest) {
  const isSameOrig = isSameOrigin(request);
  const session = await getServerSession(authOptions);

  if (!isSameOrig || !session) {
    return createForbiddenResponse();
  }

  const { prompt, temperature, max_completion_tokens, model } =
    (await request.json()) as OpenAiApiRequest;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response("Missing API_KEY", { status: 500 });
  }

  const abortController = new AbortController();

  request.signal.addEventListener("abort", () => {
    // eslint-disable-next-line no-console
    console.log("OpenAi request aborted by client");

    abortController.abort();
  });

  try {
    let request = {
      model: model ?? "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Answer directly without repeating the question.",
        },
        { role: "user", content: prompt },
      ],
      temperature: temperature ?? 0.7,
      max_completion_tokens: max_completion_tokens ?? 256,
      stream: true,
      // verbosity: "low", // "low", "medium"*, "high"
    };

    request = {
      ...request,
      temperature: ["gpt-5-nano", "gpt-5-mini"].includes(request.model) ? 1 : request.temperature,
    };

    // eslint-disable-next-line no-console
    console.log(request);

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
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

      console.warn(text);

      return new Response(`OpenAi error: ${text}`, { status: upstream.status });
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
      console.log("OpenAi request aborted by client");

      return new Response(null, { status: 499 });
    }

    console.error("OpenAi API Route Error:", err);

    return new Response("Internal Server Error", { status: 500 });
  }
}
