mkdir release
cp -R ./dist release/pf2e-mobile
cp public/module.json release/module.json
cd release
zip -r module.zip ./pf2e-mobile
rm -rf ./pf2e-mobile
cd ../
gh release create 0.4.1 "./release/*" --draft --title "PF2E Mobile 0.4.1"
rm -rf ./release
