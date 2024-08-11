#!/bin/bash
# run it fron the root of the project: tmp/dump-mongo-db.sh .env.local

. "$1" # load .env provided as param

source_db_cs="${MONGODB_URI}"
destin_db_cs="${MONGODB_URI_LOCAL}"

if [ -z "$source_db_cs" ] || [ -z "$destin_db_cs" ]; then
	echo "Missing env vars: MONGODB_URI, MONGODB_URI_LOCAL"
	exit 1
fi

dumppath="$(dirname -- "${BASH_SOURCE[0]}")"
rm -rf "$dumppath"/dbbackup && mkdir -p "${dumppath}/dbbackup"

mongodump --uri "$source_db_cs" --out="$dumppath"/dbbackup
mongorestore --uri "$destin_db_cs" "$dumppath"/dbbackup --drop --authenticationDatabase=admin

# rm -rf "$dumppath"/dbbackup
exit
