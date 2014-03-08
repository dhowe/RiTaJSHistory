#!/bin/sh

WWWDIR=../www
EXAMPLE=../www/example

cd $WWWDIR

cp ../src/rita.js .
cp -r ../lib .

cd $EXAMPLE/test
cp -r ../../../src/test/* .
#RiTaLibraryJS/www/example/test







