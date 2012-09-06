#!/bin/sh

#TODO: add flags for options

DEST=".."
VERSION="0.XXa"

if [ $# -ge 1 ]
then
    VERSION=$1;
fi

if [ $# -ge 2 ]
then
    DEST=$2;
fi

#echo DEST=$DEST
#echo VER=$VERSION

LIB=../tools/compiler-latest

SRCFILE=../src/rita.js
LTSFILE=../src/rita_lts.js
DICTFILE=../src/rita_dict.js
SRCFILES="${SRCFILE} ${DICTFILE} ${LTSFILE}"

DSTFILE=$DEST/www/download/rita-core-$VERSION.min.js
DICTDST=$DEST/www/download/rita_dict-$VERSION.min.js
FULLDST=$DEST/www/download/rita-$VERSION.min.js

#filename="${fullfile##*/}"

##### just print     #####
#echo "Compiling rita-lib to ${DSTFILE}" 
#echo "java -jar $LIB/compiler.jar --js $SRCFILE  \
#    --js_output_file $DSTFILE  --summary_detail_level 3  \
#    --compilation_level SIMPLE_OPTIMIZATIONS"

##### just rita.js     #####
#echo "Compiling rita-lib to ${DSTFILE}" 
#java -jar $LIB/compiler.jar --js $SRCFILE  \
#    --js_output_file $DSTFILE  --summary_detail_level 3  \
#    --compilation_level SIMPLE_OPTIMIZATIONS

##### just rita dict      #####

#echo "Compiling rita-dict to ${DICTDST}"; java -jar $LIB/compiler.jar --js $DICTFILE \
#    --js_output_file $DICTDST  --summary_detail_level 3 \
#   --compilation_level SIMPLE_OPTIMIZATIONS


##### combine the 3 (core,dict,ls) #####

echo "Compiling rita (full) to ${FULLDST}"; java -jar $LIB/compiler.jar --js  ${SRCFILES} \
  --js_output_file $FULLDST --summary_detail_level 3 \
  --compilation_level SIMPLE_OPTIMIZATIONS -D="phase:Alpha" -D="version:"

##### output help/options #####
#java -jar $LIB/compiler.jar --help

