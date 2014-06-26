#!/bin/sh

# make-docs.sh OUTPUT [INPUT] [single-class-name]

set -e

cd ../tools/refgen				 

INPUT=../../../docs/
OUTPUT=../../../www/reference/
CLASSPATH="../../../bin:../../../libs/core.jar:../../../libs/json.jar"

#echo CP: $CLASSPATH


echo
java -Xmx512m -classpath $CLASSPATH rita.docgen.DocGenerator $OUTPUT $INPUT $1 $2 $3

echo DONE: html written to $OUTPUT

