#! /usr/bin/env sh

SCRIPT_DIR=$(dirname "$0")
PROJECT_DIR=$(realpath "$SCRIPT_DIR/..")
PARENT_DIR=$(realpath "$PROJECT_DIR/.." | xargs -0 basename)

if [ "$PARENT_DIR" != "node_modules" ]
then
	echo "Skipping deferred build, not in 'node_modules' directory (parent is '$PARENT_DIR')."
	exit 0
fi

"$SCRIPT_DIR/build-deferred.sh"