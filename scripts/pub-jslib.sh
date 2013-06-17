#/bin/sh

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    echo "  usage:   pub-lib.sh [tag] "
    echo "           pub-lib.sh 0.63a "
    exit
fi

VERSION=$1

#./make-www.sh

WWWDIR=../build/www
ZIP_FILE=ritajs-www.zip
DEST=dhowe@rednoise.org
#DEST=dhowe@localhost

cd $WWWDIR
echo zipping: $ZIP_FILE
rm -rf $ZIP_FILE
jar cf $ZIP_FILE *

jar tf $ZIP_FILE
ls -l $ZIP_FILE

echo copying $ZIP_FILE to $DEST...
cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents/rita/js/; tar xf -; cd download; ln -fs rita-${VERSION}.min.js rita-latest.min.js; ln -fs rita-${VERSION}.js rita-latest.js; ln -fs rita-full-${VERSION}.zip rita-latest-full.zip; ls -l)" 


rm -rf $ZIP_FILE
echo
echo cleaning up...
echo done




