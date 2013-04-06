#!/bin/sh

INPUT=../../docs/
OUTPUT=../../www/reference/

HTML="${INPUT}html"
CSS="${INPUT}css"
CLASSPATH=".:../../lib/core.jar:../../lib/json.jar"

cd ../tools/refgen				 # tmp: use jar instead

cp ${HTML}/*.html $OUTPUT
cp ${CSS}/*.css ${OUTPUT}../css/


java -Xmx512m -classpath $CLASSPATH DocGenerator $OUTPUT $INPUT

rm $OUTPUT/template.html

echo DONE: css written to ${OUTPUT}../css/
echo DONE: html written to $HTML

