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
JAVAPROJ=$DOCDIR/eclipse-workspace/RiTa
JSPROJ=$JAVAPROJ/RiTaLibraryJS
DLDIR=$JAVAPROJ/distribution/RiTa-$VERSION/download
WWWDIR=$JSPROJ/build/www
ZIP_FILE=ritajs-www.zip
PROPS_FILE=$JAVAPROJ/latest/RiTa.txt
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

echo copying js/jars to ./download/
cd $WWWDIR
cp $JSPROJ/www/download/rita-*.js ./download/
cp $JAVAPROJ/latest/rita-*.jar ./download/
echo

echo zipping...
cd $WWWDIR
rm -rf $ZIP_FILE
jar cf $ZIP_FILE *
#jar tf $ZIP_FILE
#pwd
#ls -l $ZIP_FILE
echo


#
# NEXT: add a separate scp for library.properties -> rita/RiTa.txt?
#

echo copying to $DEST...
echo
cat $ZIP_FILE | ssh $DEST "(cd /Library/WebServer/Documents; mkdir -p rita; cd rita; tar xf - ; mkdir -p download; cd download;  ln -fs rita-${VERSION}.min.js rita-latest.min.js; ln -fs rita-${VERSION}.js rita-latest.js; ln -fs RiTa-${VERSION}.zip RiTa-latest.zip; ln -fs rita-${VERSION}.jar rita-latest.jar; ls -l ../js)" 

echo copying $PROPS_FILE to $DEST...
echo
scp $PROPS_FILE $DEST:/Library/WebServer/Documents/rita

echo
rm -rf $ZIP_FILE
#rm -rf $WWWDIR
echo cleaning up...
echo done
echo




