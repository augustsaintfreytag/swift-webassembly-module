#! /usr/bin/env sh

SCRIPT_DIR=$(dirname "$0")

if [ -f ".development" ]
then
	echo "Skipping deferred build, directory was not installed as a module."
	exit 0
fi

"$SCRIPT_DIR/build-deferred.sh"