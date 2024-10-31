import { kv } from "@vercel/kv";

import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { type FileData } from "@/interfaces/File.js";

let filesAcc: FileData[] | null = null;

export async function getFilesR2Cached(files?: FileData[]): Promise<FileData[] | null> {
  if (files && files.length > 0) {
    filesAcc = files;

    await kv.del("files", "latest");
    await kv.hset("files", { latest: JSON.stringify(files) });

    return filesAcc;
  }

  if (filesAcc && filesAcc.length > 0) {
    return filesAcc;
  } else {
    const redisCache: FileData[] | null = await kv.hget("files", "latest");
    const redisCacheProcessed = redisCache
      ? redisCache.map((file) => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
        }))
      : null;

    // filesAcc = redisCacheProcessed || (await getFilesR2({ cache: false, hyphen: true }));
    filesAcc = redisCacheProcessed ?? (await getFilesR2());

    return filesAcc;
  }
}
