#!/bin/sh

SRCFILE=../src/rita.js
JSDOC=../tools/jsdoc-toolkit


java -jar $JSDOC/jsrun.jar $JSDOC/app/run.js -d=$JSDOC/../../www/reference -a -t=$JSDOC/templates/ritajs $SRCFILE
