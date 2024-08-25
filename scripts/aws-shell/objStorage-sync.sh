#!/bin/bash

# doppler run -- scripts/aws-shell/objStorage-sync.sh

DUMP_DIR="$(dirname "$0")/object-storage-dump"
echo "${DUMP_DIR}"
mkdir -p "${DUMP_DIR}"

S3_BUCKET=$CLOUDFLARE_R2_BUCKET_NAME
S3_BUCKET_BACKUP="${S3_BUCKET}-backup"

## SYNC ClodFlare/R2 TO FOLDER
#aws --profile cloudflare s3 sync "s3://${S3_BUCKET}/" "${DUMP_DIR}"

## SYNC FOLDER TO MinIO
#aws --profile minio s3 sync "${DUMP_DIR}" "s3://${S3_BUCKET}/"

## SYNC ClodFlare/R2 TO ClodFlare/R2 backup directly
aws --profile cloudflare s3 sync "s3://${S3_BUCKET}/" "s3://${S3_BUCKET_BACKUP}/"

## SYNC ClodFlare/R2 TO MinIO directly
# aws --profile cloudflare s3 sync "s3://${S3_BUCKET}/" --profile minio "s3://${S3_BUCKET}/"
