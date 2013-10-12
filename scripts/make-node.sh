#/bin/sh

set -e # die on errors 

NPM_BIN=/Users/dhowe/.nvm/v0.10.15/bin

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

BUILD=../build
NODE_RES=../noderes
NODE_DIR=$BUILD/node
NODE_RITA=$NODE_DIR/rita
NODE_LIB=$NODE_DIR/rita/lib
NODE_DOC=$NODE_DIR/rita/doc
DL_DIR=$BUILD/www/download
DOC_DIR=$BUILD/www/reference
PKG_JSON=$NODE_RITA/package.json

echo
echo "Building [Node] RiTaJS v$VERSION -----------------------"
echo

###COMPILE-JS###################################################

echo Re-creating $NODE_LIB 
rm -rf $NODE_DIR
mkdir -p $NODE_LIB
mkdir -p $NODE_DOC

echo Copying $NODE_RES/package.json to $PKG_JSON
cp $NODE_RES/package.json $PKG_JSON
sed -i "" "s/##version##/${VERSION}/g" $PKG_JSON
#cat $PKG_JSON

echo Copying $NODE_RES/README.md to $NODE_RITA
cp $NODE_RES/README.md $NODE_RITA/

echo Copying $DOC_DIR to $NODE_DOC
cp -r $DOC_DIR/* $NODE_DOC/
find $NODE_DOC -name 'CVS' | xargs rm -r

echo Copying $DL_DIR/rita-$VERSION.min.js to 'lib'
cp $DL_DIR/rita-$VERSION.min.js $NODE_LIB/rita.js

#ls -R $NODE_RITA
#exit

echo $LINE
echo

if [ $DO_PUBLISH = 1 ]
then
    if [ $DO_FORCE = 1 ]
    then
        echo Calling npm publish --force... 
        $NPM_BIN/npm publish --force $NODE_RITA
    else
        echo Calling npm publish... 
        $NPM_BIN/npm publish $NODE_RITA
    fi
    echo Done
else
    echo Done [use [-p] [-f] to publish]
fi

exit
