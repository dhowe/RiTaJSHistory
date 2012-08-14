#!/bin/sh

<<<<<<< HEAD
if [ $# != 1 ]
then
  echo
  echo "output dir required"
  echo "usage: make-docs.sh [out-dir]"
  exit
fi


#OUTDIR=$JSDOC/../../www/reference

OUTDIR=$1
=======
>>>>>>> 333adb8c05f2add16a5abb95e4aada7b2c2f4a8e
SRCFILE=../src/rita.js
JSDOC=../tools/jsdoc-toolkit


<<<<<<< HEAD
java -Xmx512m -jar $JSDOC/jsrun.jar $JSDOC/app/run.js -d=$OUTDIR/www/reference -a -t=$JSDOC/templates/ritajs $SRCFILE
=======
java -jar $JSDOC/jsrun.jar $JSDOC/app/run.js -d=$JSDOC/../../www/reference -a -t=$JSDOC/templates/ritajs $SRCFILE
>>>>>>> 333adb8c05f2add16a5abb95e4aada7b2c2f4a8e
