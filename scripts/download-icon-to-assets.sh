#!/bin/bash

# Run the script from the root of the project!

# Sources of icons:
# @see https://github.com/vscode-icons/vscode-icons/blob/master/icons
# @see https://github.com/dderevjanik/vscode-icons-js-example/tree/master/docs/icons

: "${ICONS_PATH:=public/assets/icons/it}"

WGET=$(which wget)

if [[ ! -f $WGET ]]; then
	echo 'Please install "wget"'
	exit 1
fi

CMD="${WGET} -q --show-progress --no-check-certificate"

ICON="$1"

if [[ -z "$ICON" ]]; then
	echo "Usage: $0 <icon-url>"
	echo "Usage: $0 <icon-name>|<lught_icon-name>"
	exit 1
fi

if [[ $ICON != http* ]]; then
	ICON_URL="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_${ICON}.svg"
	echo "Attempt to download from: ${ICON_URL}"
else
	ICON_URL=$ICON
	echo "Download from: ${ICON_URL}"
fi

ICON_FILE=${ICON_URL##*/}
ICON_FILE=${ICON_FILE#file_type_}
ICON_FILE=${ICON_FILE#folder_type_}
ICON_FILE=${ICON_FILE#default_}

ICON_FILENAME="${ICON_FILE%.*}"
ICON_EXTENSION="${ICON_FILE##*.}"

if [[ $ICON_FILENAME == light_* ]]; then
	ICON_FILENAME=${ICON_FILENAME#light_}
	ICON_FILENAME="${ICON_FILENAME}_light"
fi

ICON_FILENAME=${ICON_FILENAME/_official/}
ICON_FILENAME=${ICON_FILENAME/official_/}

ICON_FILENAME=${ICON_FILENAME//_/-}

ICON_FILE="${ICON_FILENAME}.${ICON_EXTENSION}"

$CMD "$ICON_URL" -O "${ICONS_PATH}/${ICON_FILE}"
