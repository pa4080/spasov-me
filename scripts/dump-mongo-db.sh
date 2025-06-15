#!/bin/bash
# run it from the root of the project: scripts/dump-mongo-db.sh .env.local

if [[ -f $1 ]]; then . "$1"; fi

echo $DOPPLER_TOKEN

source_db="${MONGODB_URI}"
destination_db_copy="${MONGODB_URI_LOCAL}"
destination_db_backup="${MONGODB_URI_BACKUP}"

if [[ -z ${source_db} ]] || [[ -z ${destination_db_copy} ]] || [[ -z ${destination_db_backup} ]]; then
	echo "Missing env vars: MONGODB_URI, MONGODB_URI_LOCAL"
	exit 1
fi

echo -e "Dumping from: ${source_db}\n"
echo -e "Restoring Copy to: ${destination_db_copy}\n"
echo -e "Restoring Backup to: ${destination_db_backup}\n"

dump_dir="$(dirname -- "${BASH_SOURCE[0]}")/db_backup"
rm -rf "${dump_dir}" && mkdir -p "${dump_dir}"

echo -e "\nDumping to: ${dump_dir}"
mongodump --uri "${source_db}" --out="${dump_dir}"

echo -e "\nRestoring to Copy from: ${dump_dir}"
mongorestore --uri "${destination_db_copy}" "${dump_dir}" --drop --authenticationDatabase=admin

echo -e "\nRestoring to Backup from: ${dump_dir} \n"
mongorestore --uri "${destination_db_backup}" "${dump_dir}" --drop --authenticationDatabase=admin

if [[ ! -z $2 ]] && [[ $2 == "rm-dump" ]]; then
	rm -rf "${dump_dir}"
fi

echo -e "\nMongoDB Dump/Restore Done...\n"

exit
