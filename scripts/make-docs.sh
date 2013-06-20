#!/bin/sh

set -e

# make-docs.sh OUTPUT [INPUT] [single-class-name]

INPUT=../../docs/
OUTPUT=../../www/reference/
GENZIP="doc-gen.zip"
CLASSPATH="$GENZIP:../../lib/core.jar:../../lib/json.jar"

#HTML="${INPUT}html"
#CSS="${INPUT}css"


#echo CP: $CLASSPATH

cd ../tools/refgen				 

#cp ${HTML}/*.html $OUTPUT
#cp ${CSS}/*.css ${OUTPUT}../css/
#cp ${HTML}/Ri*.html $OUTPUT

echo
java -Xmx512m -classpath $CLASSPATH DocGenerator $OUTPUT $INPUT $1 $2 $3

#rm $OUTPUT/template.html

#echo DONE: html written to $OUTPUT

