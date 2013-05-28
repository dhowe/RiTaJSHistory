#!/bin/sh

# make-docs.sh OUTPUT [INPUT] [single-class-name]

INPUT=../../docs/
OUTPUT=../../www/reference/
GENZIP="doc-gen.zip"

HTML="${INPUT}html"
CSS="${INPUT}css"
CLASSPATH="$GENZIP:../../lib/core.jar:../../lib/json.jar"

echo CP: $CLASSPATH

cd ../tools/refgen				 # tmp: use jar instead

cp ${HTML}/*.html $OUTPUT
cp ${CSS}/*.css ${OUTPUT}../css/


java -Xmx512m -classpath $CLASSPATH DocGenerator $OUTPUT $INPUT $1 $2 $3

rm $OUTPUT/template.html

echo DONE: css written to ${OUTPUT}../css/
echo DONE: html written to $HTML

