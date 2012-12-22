#!/bin/sh

#./make-www.sh

WWWDIR=../build/www
ZIP_FILE=ritajs-www.zip
DEST=dhowe@rednoise.org

cd $WWWDIR
echo zipping: $ZIP_FILE
rm -rf $ZIP_FILE
jar cf $ZIP_FILE *

jar tf $ZIP_FILE
ls -l $ZIP_FILE

echo copying $ZIP_FILE to $DEST...
cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents/rita/js/; tar xf -; ls /Library/WebServer/Documents/rita/js)"

rm -rf $ZIP_FILE
echo
echo cleaning up...
echo done




