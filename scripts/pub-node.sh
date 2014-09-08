#/bin/sh

set -e # die on errors 

NPM=/usr/local/bin/npm

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    echo "  usage:   make-node.sh [tag] [-p] [-f]"
    echo "           make-node.sh 1.0.63a"
    echo
    echo "  options:"
    echo "       -p = npm-publish after build "
    echo "       -f = npm-publish --force "
    exit
fi


VERSION=$1
DO_FORCE=0
DO_PUBLISH=1

LINE="------------------------------------------------------"

while [ $# -ge 1 ]; do
    case $1 in
        -D) INCLUDE_DOCS=0  ;;
    esac
    case $1 in
        -p) DO_PUBLISH=1  ;;
    esac
    case $1 in
        -f) DO_FORCE=1  ;;
    esac
    shift
done

#echo "DOCS=$INCLUDE_DOCS"
#echo "PUB=$DO_PUBLISH"

##############################################################

BUILD=/tmp/build
TEST=../test
NODE_RES=..
NODE_DIR=$BUILD/node
NODE_RITA=$NODE_DIR/rita
NODE_LIB=$NODE_DIR/rita/lib
NODE_DOC=$NODE_DIR/rita/doc
NODE_TEST=$NODE_DIR/rita/test
DL_DIR=$BUILD/www/download
DOC_DIR=$BUILD/www/reference
PKG_JSON=$NODE_RITA/package.json
TARBALL=rita-$VERSION.tgz
LATEST=../../latest

echo
echo "Building [Node] RiTaJS v$VERSION -----------------------"
echo

###COMPILE-JS###################################################


echo $LINE
echo Generating NPM tarball in $LATEST
echo "CMD: $NPM pack $NODE_RITA from: "

pwd
echo

$NPM pack $NODE_RITA

echo Generated tarball 
mv $TARBALL $LATEST/$TARBALL



if [ $DO_PUBLISH = 1 ]
then
    if [ $DO_FORCE = 1 ]
    then
        echo Calling npm publish --force... 
        $NPM publish --force $LATEST/$TARBALL
    else
        echo Calling npm publish... 
        $NPM publish $LATEST/$TARBALL
    fi
    echo Done
else
    echo Done [use [-p] [-f] to publish]
fi


ls -l $LATEST/$TARBALL
#tar -tvf $LATEST/$TARBALL
