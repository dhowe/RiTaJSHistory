#!/bin/sh

JSDIR=../src
DEST=dhowe@rednoise.org
ZIP_FILE=rita.jsfiles.zip

cd $JSDIR

echo zipping: $ZIP_FILE
rm -rf $ZIP_FILE
tar cf $ZIP_FILE *.js

ls -l $ZIP_FILE

echo copying $ZIP_FILE to $DEST

cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents/rita/js/download; tar xf -)"

rm -rf $ZIP_FILE
echo cleaning up...
echo done




