/**
 * Download from a object storage (CloudflareR2 or MinIo bucket)
 * on the base of a file list generated from the content of a local directory.
 *
 * From the root directory of the project:
 * > doppler run -- pnpm exec ts-node --skip-project scripts/aws/index-copy-r2-minio.ts
 */
import { listObjects } from "../../lib/aws";
import { minIoConfig, r2BucketName, r2cfConfig } from "./config";
import { downloadObjectList } from "./obj-download-to-fs";
import { uploadObjectList } from "./obj-upload-from-fs";

(async () => {
  // Generate the list of the files from the R2 bucket
  const fileList = await listObjects();

  // eslint-disable-next-line no-console
  console.log(fileList);

  // Download the files (note the batches must be small enough)
  const fileMapDownloaded = await downloadObjectList({
    fileList: fileList,
    bucket: r2BucketName,
    config: r2cfConfig,
    downloadDirFs: "public/tmp",
    batchSize: 5,
  });

  // eslint-disable-next-line no-console
  console.log(fileMapDownloaded);

  if (!fileMapDownloaded) {
    return;
  }

  await uploadObjectList({
    fileList: fileMapDownloaded,
    bucket: r2BucketName,
    config: minIoConfig,
    batchSize: 10,
  });
})();
