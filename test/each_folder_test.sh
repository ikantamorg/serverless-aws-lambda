for dir in ./test/*/
do
  testDir="$(basename $dir)";
  if [ $testDir = "api" ] || [ $testDir = "schemes" ] || [ $testDir = "factories" ]; then
    continue;
  fi
  echo "Folder: $testDir";
  mocha --compilers js:babel-register --recursive --reporter=spec --grep @api --invert "$dir"
done