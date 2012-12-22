#/bin/sh

if [ $# -lt "1"  ]
then
    echo
    echo "tag or version required"
    echo "usage: pub-lib.sh [tag]"
    exit
fi

VERSION=$1
INCLUDE_DOCS=1
MINIMIZE_SRC=1

while [ $# -ge 1 ]; do
    case $1 in
        -d)  INCLUDE_DOCS=0  ;;
    esac
    shift
done
#echo "DOCS=$INCLUDE_DOCS"

##############################################################

BUILD=../build
COMPILE="java -jar ../tools/compiler-latest/compiler.jar"

CSS=../www/css
JSDOC=../tools/jsdoc-toolkit
SRC=../src/rita.js
ALL_SRC="../src/rita_dict.js ../src/rita_lts.js ../src/rita.js"

DOWNLOAD_DIR=../www/download
DIST_DIR=../dist
REF_DIR=../www/reference
RITA_CODE=$DOWNLOAD_DIR/rita-$VERSION.js
RITA_CODE_MIN=$DOWNLOAD_DIR/rita-$VERSION.min.js

ZIP_TMP=/tmp/rita-$VERSION
ZIP_FILE=RiTaJS-$VERSION.zip

echo Building RiTaJS v$VERSION ------------------------------

###COMPILE############################################################

# clean the target dir first
mv $DOWNLOAD_DIR/*.js $DIST_DIR
mv $DOWNLOAD_DIR/*.zip $DIST_DIR

echo "Combining rita-*.js as ${RITA_CODE}"; 
rm -f $RITA_CODE
cat $ALL_SRC >> $RITA_CODE

if [ $MINIMIZE_SRC = 1 ]
then
    echo "Compiling rita-*.js as ${RITA_CODE_MIN}"; 
    $COMPILE --js  ${ALL_SRC} --js_output_file $RITA_CODE_MIN --summary_detail_level 3 \
                  --compilation_level SIMPLE_OPTIMIZATIONS 
else
    echo Skipping minimization
fi

#echo "Compiling rita-*.js as ${RITA_CODE_MIN}_adv.js"; 
#$COMPILE --js  ${ALL_SRC} --js_output_file "${RITA_CODE_MIN}_adv.js" --summary_detail_level 3 \
#  --compilation_level ADVANCED_OPTIMIZATIONS 

###DOCS###############################################################

if [ $INCLUDE_DOCS = 1 ]
then
    echo Building js-docs...
    rm -rf $REF_DIR/*
    java -Xmx512m -jar $JSDOC/jsrun.jar $JSDOC/app/run.js -d=$REF_DIR -a \
        -t=$JSDOC/templates/ritajs -D="status:alpha" -D="version:$VERSION" $SRC > docs-err.txt 
else
    echo Skipping docs...
fi

###EXAMPLES ##########################################################

echo Copying examples
cd .
pwd
pwd
cp -r ../test/renderer/multitest.html ../www/example/
cp -r ../test/renderer/canvas ../test/renderer/processing ../www/example/
exit

###ZIP###############################################################

echo Making complete zip 

rm -rf $ZIP_TMP
mkdir $ZIP_TMP
cd ../www
cp -r example download/*.js reference tutorial css $ZIP_TMP
cd - 
cd $ZIP_TMP
jar cf $ZIP_FILE *
cd -
mv $ZIP_TMP/$ZIP_FILE $DOWNLOAD_DIR
rm -rf $ZIP_TMP

###COPY##############################################################

echo Copying into $BUILD 

/bin/rm -rf $BUILD
mkdir $BUILD
cp -r ../www $BUILD
ls -l $BUILD/www/download

####################################################################

echo
echo Done [use pub-js.sh or pub-www.sh to publish]

#pub-www.sh
