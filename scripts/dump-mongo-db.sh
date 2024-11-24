#!/bin/bash
# run it from the root of the project: scripts/dump-mongo-db.sh .env.local

if [ -f "$1" ]; then . "$1"; fi

source_db_cs="${MONGODB_URI}"
destin_db_cs="${MONGODB_URI_LOCAL}"
destin_db_bk="${MONGODB_URI_BACKUP}"

if [ -z "$source_db_cs" ] || [ -z "$destin_db_cs" ] || [ -z "$destin_db_bk" ]; then
	echo "Missing env vars: MONGODB_URI, MONGODB_URI_LOCAL"
	exit 1
fi

dumppath="$(dirname -- "${BASH_SOURCE[0]}")"
rm -rf "$dumppath"/dbbackup && mkdir -p "${dumppath}/dbbackup"

mongodump --uri "$source_db_cs" --out="$dumppath"/dbbackup
mongorestore --uri "$destin_db_cs" "$dumppath"/dbbackup --drop --authenticationDatabase=admin
mongorestore --uri "$destin_db_bk" "$dumppath"/dbbackup --drop --authenticationDatabase=admin

if [ ! -z "$2" ] && [ "$2" == "rm-dump" ]; then
	rm -rf "$dumppath"/dbbackup
fi

exit
