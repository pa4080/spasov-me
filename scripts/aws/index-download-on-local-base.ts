/* eslint-disable @typescript-eslint/no-floating-promises */
/**
 * Download from a object storage (CloudflareR2 or MinIo bucket)
 * on the base of a file list generated from the content of a local directory.
 *
 * From the root directory of the project:
 * > doppler run -- pnpm exec ts-node --skip-project scripts/aws/index-download-on-local-base.ts
 */
import { r2BucketIconsPath, r2BucketName, r2cfConfig } from "./config";
import generateFileMapRecursive from "./local-files-map";
import { downloadObjectList } from "./obj-download-to-fs";

(async () => {
  // Generate file map (list of the files to be uploaded)
  const iconMap = generateFileMapRecursive({
    dir: "./public/assets/icons",
    date: new Date(),
    creatorId: "spas-z-spasov",
    locale: "en",
    filename_trim_prefix: "icons",
  });

  // eslint-disable-next-line no-console
  console.log(iconMap);

  // Download the files (note the batches must be small enough)
  const fileMapDownloaded = await downloadObjectList({
    fileList: iconMap,
    prefix: r2BucketIconsPath,
    bucket: r2BucketName,
    config: r2cfConfig,
    downloadDirFs: "public/tmp",
    batchSize: 5,
  });

  // eslint-disable-next-line no-console
  console.log(fileMapDownloaded);
})();
