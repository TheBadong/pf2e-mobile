# Read release version from dist module.json
VERSION="$(jq -r '.version' module.json)"
echo "Preparing release for version $VERSION";

mkdir release
cp -R ./dist release/pf2e-mobile
cp public/module.json release/module.json
cd release
zip -r module.zip ./pf2e-mobile
rm -rf ./pf2e-mobile
cd ../
gh release create $VERSION "./release/*" --draft --title "PF2E Mobile $VERSION"
rm -rf ./release
