#! /usr/bin/env sh

SCRIPT_DIR=$(dirname "$0")
PROJECT_DIR=$(realpath "$SCRIPT_DIR/..")
PROJECT_NAME=$(basename "$PROJECT_DIR")
TMP_DIR="/var/tmp/$PROJECT_NAME"

if [ ! -e ./package.json ]
then
	echo "Working directory '$PROJECT_DIR' is not a valid project directory."
	exit 1
fi

echo "Copying project data to temporary working directory '$TMP_DIR'."
mkdir -p "$TMP_DIR"

touch "$TMP_DIR/.development"
cp package.json "$TMP_DIR/"
cp yarn.lock "$TMP_DIR/"
cp tsconfig.json "$TMP_DIR/"
cp -R src "$TMP_DIR/"

cd "$TMP_DIR" || exit 1

if [ ! -e ./package.json ]
then
	echo "Working directory '$TMP_DIR' is not a valid project directory, copy incomplete."
	exit 1
fi

echo "Installing project development dependencies for build."
yarn

echo "Building project."
yarn build

echo "Copying output project distribution files."
rm -r "$PROJECT_DIR/dist" > /dev/null
cp -R "$TMP_DIR/dist" "$PROJECT_DIR/"

rm -r "$TMP_DIR"