#!/bin/sh

INDIR=$1
OUTDIR=$2

cd ../tools/refgen # tmp: make into jar

#echo copying css to $OUTDIR 
#ls $OUTDIR
#cp -r $CSS $OUTDIR

java -Xmx512m -classpath .:core.jar:json.jar DocGenerator ../../www/reference/ ../../docs/
