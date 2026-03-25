mkdir release
cp -R ./dist release/pf2e-mobile
cp public/module.json release/module.json
cd release
zip -r module.zip ./pf2e-mobile
rm -rf ./pf2e-mobile
cd ../
gh release create 0.3.3 "./release/*" --draft --title "PF2E Mobile 0.3.3"
rm -rf ./release
