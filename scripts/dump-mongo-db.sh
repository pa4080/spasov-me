#!/bin/bash
# run it fron the root of the project:
# $ tmp/dump-mongo-db.sh .env.local

dumppath="$(dirname -- "${BASH_SOURCE[0]}")"
mkdir "${dumppath}/dbbackup"

. "$1"

migrate_from="${MONGODB_URI}"
#migrate_to="${MONGODB_URI_LOCAl}"

mongodump --uri "$migrate_from" --out="$dumppath"/dbbackup
#mongorestore --uri "$migrate_to" "$dumppath"/dbbackup/test --drop -dcms
#rm -rf "$dumppath"/dbbackup
exit
