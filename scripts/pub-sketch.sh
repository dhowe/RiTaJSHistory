#!/bin/sh

# packages and publishes a sketch @ rednoise/~www/sketches
# assumes the sketch is in $SKETCHBOOK, as defined below

if [ $# != 1 ]
then
  echo
  echo "sketch-name required!"
	echo
  echo  packages and publishes a js-sketch to rednoise/~www/sketches
  echo
  echo "usage: pub-sketch.sh [sketch-name]"
  echo 
  echo "example: pub-sketch.sh MySketch "
  exit
fi

TMP_DIR=/tmp
SKETCH_NAME=$1
SKETCHBOOK=~/Documents/Processing/$SKETCH_NAME/web-export
#SKETCHBOOK=~/Documents/eclipse-workspace/$SKETCH_NAME/applet
ZIP_FILE=$SKETCH_NAME.zip
 
#cp ../rita-loading.gif applet/loading.gif

/bin/rm -rf $TMP_DIR/$SKETCH_NAME
cp -rf $SKETCHBOOK $TMP_DIR/$SKETCH_NAME
 
ls -l $TMP_DIR/$SKETCH_NAME

echo zipping: $ZIP_FILE

cd $TMP_DIR
jar cf $ZIP_FILE $SKETCH_NAME

ls -l $ZIP_FILE

jar tf $ZIP_FILE 

echo moving $ZIP_FILE

cat $ZIP_FILE | ssh dhowe@${RED} "(cd /Library/WebServer/Documents/sketches; tar xf -; /bin/rm -rf $ZIP_FILE; chmod -R 775 $SKETCH_NAME; )"

# STRIP SOURCE-CODE LINK: sed  -i".bak" '/<p id="sources">.*<\/p>/d' index.html

echo cleaning up...

mv -f $SKETCH_NAME ~/.Trash
mv -f $ZIP_FILE ~/.Trash

cd -

echo Published to ${RED}/sketches/$SKETCH_NAME

exit
