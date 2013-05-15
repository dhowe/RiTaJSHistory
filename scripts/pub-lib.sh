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

# TODO: need to add these soft-links
# unlink rita-latest.min.js ; ln -s rita-0.23a.min.js rita-latest.min.js
# unlink rita-latest.js ; ln -s rita-0.23a.js rita-latest.js
# unlink rita-latest-full.zip ; ln -s rita-full-0.23a.zip rita-latest-full.zip


rm -rf $ZIP_FILE
echo
echo cleaning up...
echo done




