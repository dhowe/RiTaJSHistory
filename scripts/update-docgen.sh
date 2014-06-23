#!/bin/sh

# IS THIS BEING USED??

# update-docgen.sh: rebuilds ../tools/refgen/doc-gen.zip from src

set -e

ls ../../../../eclipse-workspace/RiTa_DocGen/bin

exit
INPUT=../../docs/
OUTPUT=../../www/reference/
GENZIP="doc-gen.zip"
CLASSPATH="$GENZIP:../../../libs/core.jar:../../../libs/json.jar"

#echo CP: $CLASSPATH

cd ../tools/refgen				 

echo
java -Xmx512m -classpath $CLASSPATH DocGenerator $OUTPUT $INPUT $1 $2 $3

echo DONE: html written to $OUTPUT

