import { type Route } from "@/routes";

export type AiProvider = keyof typeof Route.apiAi;

export interface AiApiRequest {
  prompt: string;
  temperature: number;
  max_tokens: number;
  model: DeepSeekApiRequest["model"] | OpenAiApiRequest["model"];
}

// https://api-docs.deepseek.com/quick_start/pricing
export interface DeepSeekApiRequest {
  prompt: string;
  temperature: number;
  max_tokens: number;
  model: "deepseek-chat" | "deepseek-coder" | "deepseek-reasoner";
}

// https://platform.openai.com/docs/api-reference/chat/create
export interface OpenAiApiRequest {
  prompt: string;
  temperature: number;
  max_completion_tokens: number;
  model: "gpt-4o" | "o3" | "o4-mini" | "gpt-5-mini" | "gpt-5-nano";
}
