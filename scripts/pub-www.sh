#!/bin/sh

#./make-www.sh

WWWDIR=../www
ZIP_FILE=ritajs-www.zip
DEST=dhowe@rednoise.org

cd $WWWDIR
echo zipping: $ZIP_FILE
rm -rf $ZIP_FILE
tar cf $ZIP_FILE *

ls -l $ZIP_FILE

echo copying $ZIP_FILE to $DEST

cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents/rita/js; tar xf -)"

rm -rf $ZIP_FILE
echo cleaning up...
echo done




