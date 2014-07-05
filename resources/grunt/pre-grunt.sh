#/bin/sh

set -e # die on errors 

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required!"
    echo
    echo "  usage:   pre-grunt.sh [tag] "
    exit
fi

VERSION=$1
LINE="------------------------------------------------------"

echo
echo Copying grunt-package.json to package.json
cp grunt-package.json package.json
sed -i "" "s/##version##/${VERSION}/g" package.json

echo Copying README.md to current directory
cp ../../README.md .

echo Done
exit
