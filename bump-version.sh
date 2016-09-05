#!/bin/bash

allowed_versions=(major minor patch)

if [ $# -ne 1 ] || ! [[ " ${allowed_versions[@]} " =~ " $1 " ]]; then
  echo "Usage: $0 <major|minor|patch>"
  exit
fi

echo "Making a $1 bump to the woorank-theme"
echo "Press <Enter> to continue or <Ctrl-C> to cancel"

read

VERSION=$(npm version $1)
VERSION=$(echo $VERSION | cut -c 2-)

if [ "$VERSION" -eq "" ]; then
  echo "Something went wrong when setting the version"
  exit
fi

echo "New package version: $VERSION"

# Set the version of the woo-components' package.json to match the styleguide
sed -i '' 's/"version": "\([0-9]*.\)\{2\}[0-9]"/"version": "'$VERSION'"/' woo-components/package.json

git add package.json
git add woo-components/package.json
git commit -m "v$VERSION"
git tag v$VERSION

echo "All done!"
echo "To push the changes, use the following commands:"
echo "$ git push"
echo "$ git push --tags"

