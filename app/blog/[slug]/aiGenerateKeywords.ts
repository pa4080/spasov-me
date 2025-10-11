"use server";

import { type DeepseekResponseData } from "@/lib/actions/deepseek_v1";

const defaultKeywords =
  "technology, react, next.js, javascript, typescript, databases, fontend, backend";
const apiKey = process.env.DEEPSEEK_API_KEY;

export async function aiGenerateKeywords({ postDescription }: { postDescription: string }) {
  if (!apiKey) {
    throw new Error("Missing API_KEY");
  }

  try {
    const request = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. SEO expert who generating keywords for blog posts. Output only the comma separated list of keywords. Do not output anything else!",
        },
        { role: "user", content: postDescription },
      ],
      temperature: 0.7,
      max_tokens: 256,
      stream: false, // You are using non-streaming
    };

    const upstream = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
    });

    // Check if the HTTP request was successful
    if (!upstream.ok) {
      throw new Error(`DeepSeek API request failed with status: ${upstream.status}`);
    }

    // Parse the JSON response body
    const data = (await upstream.json()) as DeepseekResponseData;

    // Extract the completion text from the response structure
    const keywords = data.choices[0]?.message?.content?.trim();

    // Check if the completion text exists
    if (!keywords) {
      throw new Error("API response did not contain valid content.");
    }

    // eslint-disable-next-line no-console
    console.log("DeepSeek generated keywords:", keywords);

    return keywords;
  } catch (err: unknown) {
    console.error("DeepSeek API Route Error:", err);

    return defaultKeywords;
  }
}
