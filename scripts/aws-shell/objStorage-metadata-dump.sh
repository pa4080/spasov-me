#!/bin/bash

# doppler run -- scripts/objStorage-r2-minio-metadata-dump.sh

DUMP_FILE="$(dirname "$0")/object-storage-metadata-$(date +%Y-%m-%d-%H-%M).json"
S3_DUMP_DIR=$NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_METADATA
S3_BUCKET=$CLOUDFLARE_R2_BUCKET_NAME

# Open the JSON object in the dump file
printf '{\n' >"$DUMP_FILE"

# Dump the metadata of the Clodflare R2's bucket files as JSON
export S3_BUCKET
aws --profile cloudflare s3 ls "s3://${S3_BUCKET}/" --recursive --output text --no-paginate |
	awk '{print $NF}' |
	xargs -I{} \
		sh -c 'printf "\"%s\": %s,\n" "$(echo {})" "$(aws s3api head-object --bucket ${S3_BUCKET} --profile cloudflare --key {})"' \
		>>"$DUMP_FILE"

# Close the JSON object
printf '}' >>"$DUMP_FILE"

# Format the JSON
pnpm dlx prettier --write "$DUMP_FILE"

# Upload the dump to a MinIo bucket
aws --profile minio s3 cp "${DUMP_FILE}" "s3://${S3_BUCKET}/${S3_DUMP_DIR}/" &&
	rm "$DUMP_FILE"

# ------

# References:
# > https://developers.cloudflare.com/r2/api/s3/api/
# > https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html
# > https://docs.aws.amazon.com/cli/latest/reference/s3api/get-object-attributes.html
# > https://docs.aws.amazon.com/cli/latest/reference/s3api/head-object.html

# Examples:
# aws --profile cloudflare s3 sync "s3://spasov-me/files" --profile minio "s3://spasov-me/files/" --recursive
# aws --profile cloudflare s3 sync "s3://spasov-me/files/" --profile minio "s3://spasov-me/files/"
# aws s3api get-object-attributes --endpoint-url https://minio-share.metalevel.cloud --bucket spasov-me --profile minio --key files/Spas_Zdravkov_Spasov_CV_2024_EN.pdf --object-attributes "ObjectSize"
# aws s3api get-object-attributes --bucket spasov-me --profile minio --key files/Spas_Zdravkov_Spasov_CV_2024_EN.pdf --object-attributes "ObjectSize"
# Not implemented at R2:
# aws s3api get-object-attributes --bucket spasov-me --profile cloudflare --key files/Spas_Zdravkov_Spasov_CV_2024_EN.pdf --object-attributes "ObjectSize"
