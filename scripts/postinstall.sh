#! /usr/bin/env sh

SCRIPT_DIR=$(dirname "$0")
APP_DIR=$(realpath "$SCRIPT_DIR/..")

if [ -f "$APP_DIR/.development" ]
then
	exit 0
fi

"$SCRIPT_DIR/build-deferred.sh"