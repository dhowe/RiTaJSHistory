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
rm -rf download/[Rr]i[Tt]a-* 
cp $DLDIR/RiTa-$VERSION.zip ./download/
echo

echo copying js-files to ./download/
cd $WWWDIR
rm -rf download/*.js
cp $JSPROJ/www/download/rita-*.js ./download/
echo

echo zipping: ritajs-www.zip
cd $WWWDIR
rm -rf $ZIP_FILE
jar cf $ZIP_FILE *
#jar tf $ZIP_FILE
#pwd
#ls -l $ZIP_FILE
echo

echo copying $ZIP_FILE to $DEST...
echo
cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents; mkdir -p rita; cd rita; tar xf - ; mkdir -p download; cd download;  ln -fs rita-${VERSION}.min.js rita-latest.min.js; ln -fs rita-${VERSION}.js rita-latest.js; ln -fs RiTa-${VERSION}.zip RiTa-latest.zip; ln -s rita-${VERSION}.jar rita-latest.jar; ls -l; pwd)" 

echo
rm -rf $ZIP_FILE
echo cleaning up...
echo done
echo




