import "server-only";

import { Redis } from "@upstash/redis";

export const redis_app_prefix = process.env.UPSTASH_REDIS_PREFIX ?? "spasov_me";
export const redis_ttl = Number(process.env.UPSTASH_REDIS_TTL ?? 4 * 168 * 3600); // 4 weeks in seconds

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  cache: "default",
});

export const files_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES ?? "files";
export const icons_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS ?? "icons";
export const icons_map_prefix =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS_MAP ?? "iconsMap";

export const files_prefix_mongo = process.env.MONGO_REDIS_PREFIX ?? "mongo_db_files";

export const redis_cache_app_data_key = `${redis_app_prefix}_app_data`;
