#!/bin/sh

#TODO: add flags for options

<<<<<<< HEAD
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

DSTFILE=$DEST/www/download/rita-$VERSION.min.js
DICTDST=$DEST/www/download/rita_dict-$VERSION.min.js
FULLDST=$DEST/www/download/rita_full-$VERSION.min.js

#filename="${fullfile##*/}"

##### just print     #####
#echo "compiling rita-lib to ${DSTFILE}" 
#echo "java -jar $LIB/compiler.jar --js $SRCFILE  \
#    --js_output_file $DSTFILE  --summary_detail_level 3  \
#    --compilation_level SIMPLE_OPTIMIZATIONS"

##### just rita.js     #####
#echo "compiling rita-lib to ${DSTFILE}" 
#java -jar $LIB/compiler.jar --js $SRCFILE  \
#    --js_output_file $DSTFILE  --summary_detail_level 3  \
#    --compilation_level SIMPLE_OPTIMIZATIONS

##### just rita dict      #####
=======
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
>>>>>>> 333adb8c05f2add16a5abb95e4aada7b2c2f4a8e
#echo "compiling rita-dict to ${DICTDST}"; java -jar $LIB/compiler.jar --js $DICTFILE \
#    --js_output_file $DICTDST  --summary_detail_level 3 \
#   --compilation_level SIMPLE_OPTIMIZATIONS

<<<<<<< HEAD
##### combine the 3 (core,dict,ls) #####
=======
##### combine the two files #####
>>>>>>> 333adb8c05f2add16a5abb95e4aada7b2c2f4a8e
echo "compiling rita-full to ${FULLDST}"; java -jar $LIB/compiler.jar --js  ${SRCFILES} \
  --js_output_file $FULLDST --summary_detail_level 3 \
  --compilation_level SIMPLE_OPTIMIZATIONS

##### output help/options #####
#java -jar $LIB/compiler.jar --help

