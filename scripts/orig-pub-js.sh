#!/bin/sh

if [ $# != 1 ]
then
  echo
  echo "tag or version required"
  echo "usage: pub-lib.sh [tag]"
  exit
fi

VERSION=$1

JSDIR=../build/www/download
DEST=dhowe@rednoise.org
ZIP_FILE=rita.codefiles.zip

cd $JSDIR

echo zipping $ZIP_FILE

rm -rf $ZIP_FILE
tar cf $ZIP_FILE *$VERSION*.js *$VERSION*.zip
ls -l $ZIP_FILE

echo copying $ZIP_FILE to $DEST

#cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents/rita/js/download; tar xf -)"

echo cleaning up...
rm -rf $ZIP_FILE

echo done




