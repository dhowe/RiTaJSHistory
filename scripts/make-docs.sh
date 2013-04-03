#!/bin/sh

INPUT=../../docs/
OUTPUT=../../www/reference/

HTML="${INPUT}html"
CLASSPATH=".:core.jar:json.jar"

cd ../tools/refgen				 # tmp: use jar instead

java -Xmx512m -classpath $CLASSPATH DocGenerator $OUTPUT $INPUT

cp ${HTML}/*.html $OUTPUT

rm $OUTPUT/template.html

echo DONE: html written to $HTML
