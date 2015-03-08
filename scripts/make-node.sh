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
DO_PUBLISH=0
INCLUDE_DOCS=1

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

DIST_DIR=../dist
TEST_DIR=../test
BUILD=/tmp/build
NODE_DIR=$BUILD/node
NODE_RITA=$NODE_DIR/rita
NODE_LIB=$NODE_DIR/rita/lib
NODE_DOC=$NODE_DIR/rita/doc
NODE_TEST=$NODE_DIR/rita/test
DL_DIR=$BUILD/www/download
TARBALL=rita-$VERSION.tgz

RITA_PROJ=../..
RITA_DIST=$RITA_PROJ/dist
DOC_DIR=$RITA_DIST/RiTa/reference


echo
echo "Building [Node] RiTaJS v$VERSION -----------------------"
echo

###COMPILE-JS###################################################

echo Re-creating $NODE_LIB 
rm -rf $NODE_DIR
mkdir -p $NODE_LIB || die
mkdir -p $NODE_TEST || die
mkdir -p $NODE_DOC || die


echo 1: Copying package.json/README/gulpfile to $NODE_RITA
cp ../README.node.md $NODE_RITA/README.md
cp ../package.json $NODE_RITA/
cp ../gulpfile.js $NODE_RITA/

echo "2: Copying TESTS to $NODE_TEST"
cp -r $TEST_DIR/*.js $NODE_TEST/

echo 3: Copying DOCS to $NODE_DOC
cp -r $DOC_DIR/* $NODE_DOC/

echo 4: Copying rita.js to $NODE_LIB
#minimize everything, no ritext
cp $DIST_DIR/rita-$VERSION.node.js $NODE_LIB/rita.js

echo $LINE
echo Generating NPM tarball in $DIST_DIR
#echo "CMD: $NPM pack $NODE_RITA from: "
#pwd
echo

$NPM pack $NODE_RITA

mv $TARBALL $DIST_DIR/$TARBALL

echo

if [ $DO_PUBLISH = 1 ]
then
    if [ $DO_FORCE = 1 ]
    then
        echo Calling npm publish --force... 
        $NPM publish --force $DIST_DIR/$TARBALL
    else
        echo Calling npm publish... 
        $NPM publish $DIST_DIR/$TARBALL
    fi
    echo Done
else
    echo Done [use [-p] [-f] to publish]
fi


echo
#ls -l $DIST_DIR
#tar -tvf $DIST_DIR/$TARBALL | less
