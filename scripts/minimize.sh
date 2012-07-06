#!/bin/sh

#TODO: add flags for options

VERSION=0.14a
LIB=../tools/compiler-latest

SRCFILE=../src/rita.js
DICTFILE=../src/rita_dict.js
SRCFILES="${SRCFILE} --js ${DICTFILE}"

DSTFILE=../www/download/rita-$VERSION.min.js
DICTDST=../www/download/rita_dict-$VERSION.min.js
FULLDST=../www/download/rita_full-$VERSION.min.js

#filename="${fullfile##*/}"

##### just the rita lib #####
echo "compiling rita-lib to ${DSTFILE}"; java -jar $LIB/compiler.jar --js $SRCFILE  \
    --js_output_file $DSTFILE  --summary_detail_level 3  \
    --compilation_level SIMPLE_OPTIMIZATIONS


##### just the rita dict #####
#echo "compiling rita-dict to ${DICTDST}"; java -jar $LIB/compiler.jar --js $DICTFILE \
#    --js_output_file $DICTDST  --summary_detail_level 3 \
#   --compilation_level SIMPLE_OPTIMIZATIONS

##### combine the two files #####
echo "compiling rita-full to ${FULLDST}"; java -jar $LIB/compiler.jar --js  ${SRCFILES} \
  --js_output_file $FULLDST --summary_detail_level 3 \
  --compilation_level SIMPLE_OPTIMIZATIONS

##### output help/options #####
#java -jar $LIB/compiler.jar --help

