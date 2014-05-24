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

SSH="/usr/bin/ssh -p"
SSHPORT=22022

VERSION=$1
DOCDIR=~/documents
JAVAPROJ=$DOCDIR/eclipse-workspace/RiTa
JSPROJ=$JAVAPROJ/RiTaLibraryJS
DLDIR=$JAVAPROJ/distribution/RiTa-$VERSION/download
WWWDIR=$JSPROJ/build/www
ZIP_FILE=rita-www.zip
PROPS_FILE=$JAVAPROJ/latest/RiTa.txt
DEST=dhowe@localhost

while [ $# -ge 1 ]; do
    case $1 in
        -r) DEST=dhowe@rednoise.org; SSHPORT=22  ;;
    esac
    shift
done


#./make-www.sh

cd $WWWDIR

echo
echo copying RiTa-$VERSION.zip ./download/
rm -rf download/[Rr]i[Tt]a-* 
cp $DLDIR/RiTa-$VERSION.zip ./download/
echo

echo copying js/jars to ./download/
cp $JAVAPROJ/www/download/rita-*.js ./download/
cp $JAVAPROJ/latest/rita-$VERSION.jar ./download/
echo

echo zipping...
rm -rf $ZIP_FILE
jar cf $ZIP_FILE *
#jar tf $ZIP_FILE
#pwd
#ls -l $ZIP_FILE
echo

echo ssh -p $SSHPORT 
echo copying to $DEST...
echo

cat $ZIP_FILE | ssh -p $SSHPORT $DEST "(cd /Library/WebServer/Documents; mkdir -p rita; cd rita; tar xf - ; mkdir -p download; cd download;  ln -fs rita-${VERSION}.min.js rita-latest.min.js; ln -fs rita-${VERSION}.js rita-latest.js; ln -fs RiTa-${VERSION}.zip RiTa-latest.zip; ln -fs rita-${VERSION}.jar rita-latest.jar; ls -l ..)" 

echo copying $PROPS_FILE to $DEST...
echo
scp -P $SSHPORT $PROPS_FILE $DEST:/Library/WebServer/Documents/rita

#TODO: git tag BOTH versions here!!!
########################################

# cd PROJ_HOME

# commit your changes
# git commit -am "Release version $VERSION"

# tag the commit
# git tag -a v$VERSION -m "Release version $VERSION"

# push to GitHub
# git push origin master --tags

echo
rm -rf $ZIP_FILE
#rm -rf $WWWDIR
echo cleaning up...
echo done
echo




