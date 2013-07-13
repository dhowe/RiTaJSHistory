#!/bin/sh

set -e

# make-docs.sh OUTPUT [INPUT] [single-class-name]

INPUT=../../docs/
OUTPUT=../../www/reference/
GENZIP="doc-gen.zip"
CLASSPATH="$GENZIP:../../lib/core.jar:../../lib/json.jar"

#echo CP: $CLASSPATH

cd ../tools/refgen				 

echo
java -Xmx512m -classpath $CLASSPATH DocGenerator $OUTPUT $INPUT $1 $2 $3

echo DONE: html written to $OUTPUT

