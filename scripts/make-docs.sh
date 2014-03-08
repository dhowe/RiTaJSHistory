#!/bin/sh

# make-docs.sh OUTPUT [INPUT] [single-class-name]

set -e

cd ../tools/refgen				 

INPUT=../../docs/
OUTPUT=../../www/reference/
GENZIP="doc-gen.zip"
CLASSPATH="$GENZIP:../../lib/core.jar:../../lib/json.jar"
CLASSPATH="../../../bin:../../../lib/core.jar:../../../lib/json.jar"

#echo CP: $CLASSPATH


echo
java -Xmx512m -classpath $CLASSPATH rita.docgen.DocGenerator $OUTPUT $INPUT $1 $2 $3

echo DONE: html written to $OUTPUT

