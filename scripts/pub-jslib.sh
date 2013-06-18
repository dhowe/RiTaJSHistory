#/bin/sh

set -e # die on errors 

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    echo "  usage:   pub-lib.sh [tag] [-r]"
    echo "           pub-lib.sh 0.63a [-r] "
    echo
    echo "  options:"
    echo "       -r = publish to remote (host=rednoise)"
    exit
fi

VERSION=$1
DOCDIR=~/documents
JSPROJ=$DOCDIR/javascript-workspace/RiTaLibraryJS
JAVAPROJ=$DOCDIR/eclipse-workspace/RiTa
DLDIR=$JAVAPROJ/distribution/RiTa-$VERSION/download
WWWDIR=$JSPROJ/build/www
ZIP_FILE=ritajs-www.zip
DEST=dhowe@localhost

while [ $# -ge 1 ]; do
    case $1 in
        -r) DEST=dhowe@rednoise.org  ;;
    esac
    shift
done


#./make-www.sh

echo
echo copying RiTa-$VERSION.zip ./download/
cd $WWWDIR
cp $DLDIR/RiTa-$VERSION.zip ./download/
echo

echo
echo zipping: $ZIP_FILE
rm -rf $ZIP_FILE
jar cf $ZIP_FILE *

jar tf $ZIP_FILE
ls -l $ZIP_FILE
echo

echo copying $ZIP_FILE to $DEST...
cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents/rita/; tar xf -; cd download; ln -fs rita-${VERSION}.min.js ritajs-latest.min.js; ln -fs rita-${VERSION}.js ritajs-latest.js; ln -fs rita-full-${VERSION}.zip ritajs-latest-full.zip; ls -l)" 

echo
rm -rf $ZIP_FILE
echo cleaning up...
echo done
echo




