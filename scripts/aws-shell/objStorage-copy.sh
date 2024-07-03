#!/bin/bash

DUMP_DIR="$(dirname "$0")/object-storage-dump"
mkdir -p "${DUMP_DIR}"

S3_BUCKET=$CLOUDFLARE_R2_BUCKET_NAME

## List the bucket
aws --profile cloudflare s3 ls "s3://${S3_BUCKET}/"
aws --profile minio s3 ls "s3://${S3_BUCKET}/"

## COPY PRD TO FOLDER
aws --profile cloudflare s3 cp "s3://${S3_BUCKET}/" "${DUMP_DIR}" --recursive # --exclude 'academy/*'

## COPY FOLDER TO MinI0
aws --profile minio s3 cp "${DUMP_DIR}" "s3://${S3_BUCKET}/" --recursive
