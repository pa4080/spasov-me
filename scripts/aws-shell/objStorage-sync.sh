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
## There was an issue with copying tags: https://search.brave.com/search?q=cloudflare+r2+An+error+occurred+%28NotImplemented%29+when+calling+the+GetObjectTagging+operation%3A+GetObjectTagging+not+implemented&source=web&conversation=e11c3fd4236d388bc29006&summary=1
aws --profile cloudflare s3 sync "s3://${S3_BUCKET}/" "s3://${S3_BUCKET_BACKUP}/" --copy-props none

## SYNC ClodFlare/R2 TO MinIO directly
# aws --profile cloudflare s3 sync "s3://${S3_BUCKET}/" --profile minio "s3://${S3_BUCKET}/"
