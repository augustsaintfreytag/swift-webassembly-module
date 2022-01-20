#! /usr/bin/env sh

PROJECT_PATH=$(pwd)
PROJECT_DIR=$(basename "$PROJECT_PATH")
TMP_PATH="/var/tmp/$PROJECT_DIR"

if [ ! -e ./package.json ]; then
	echo "Working directory '$PROJECT_PATH' is not a valid project directory."
	exit 1
fi

echo "Copying project data to temporary working directory '$TMP_PATH'."
mkdir -p "$TMP_PATH"

# cp -R "$PROJECT_PATH" "$TMP_PATH/"
touch "$TMP_PATH/.development"
cp package.json "$TMP_PATH/"
cp yarn.lock "$TMP_PATH/"
cp tsconfig.json "$TMP_PATH/"
cp -R src "$TMP_PATH/"

cd "$TMP_PATH"

if [ ! -e ./package.json ]; then
	echo "Working directory '$TMP_PATH' is not a valid project directory, copy incomplete."
	exit 1
fi

echo "Installing project development dependencies for build."
yarn

echo "Building project."
yarn build

echo "Copying output project distribution files."
rm -r "$PROJECT_PATH/dist"
cp -R "$TMP_PATH/dist" "$PROJECT_PATH/"

rm -r "$TMP_PATH"