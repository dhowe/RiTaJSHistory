#!/bin/sh

# packages and publishes a sketch @ rednoise/~www/examples
# assumes the sketch is in $SKETCHBOOK, as defined 

SKETCHBOOK=~/Documents/Processing/libraries/RiTa/examples/$SKETCH_NAME/web-export

if [ $# != 1 ]
then
  echo
  echo "sketch-name required!"
	echo
  echo  packages and publishes a example to rednoise/~www/examples
  echo
  echo "usage: pub-example [sketch-name]"
  echo 
  echo "example: pub-example.sh MySketch "
  exit
fi

TMP_DIR=/tmp
SKETCH_NAME=$1
#SKETCHBOOK=~/Documents/eclipse-workspace/$SKETCH_NAME/applet
ZIP_FILE=$SKETCH_NAME.zip
 
/bin/rm -rf $TMP_DIR/$SKETCH_NAME
cp -rf $SKETCHBOOK $TMP_DIR/$SKETCH_NAME

 
#ls -l $TMP_DIR/$SKETCH_NAME
#sed  -i".bak" '/<p id="sources">.*<\/p>/d' $TMP_DIR/$SKETCH_NAME/index.html
sed  -i".bak" 's/<a href="http:\/\/processing.org" title="Processing">Processing<\/a>/<a href="http:\/\/rednoise.org\/rita" title="RiTa">RiTa<\/a>/g' $TMP_DIR/$SKETCH_NAME/index.html
rm $TMP_DIR/$SKETCH_NAME/index.html.bak
#cat $TMP_DIR/$SKETCH_NAME/index.html
#exit

echo zipping: $ZIP_FILE

cd $TMP_DIR
jar cf $ZIP_FILE $SKETCH_NAME

ls -l $ZIP_FILE

jar tf $ZIP_FILE 

echo moving $ZIP_FILE

cat $ZIP_FILE | ssh dhowe@${RED} "(cd /Library/WebServer/Documents/rita/examples/; tar xf -; /bin/rm -rf $ZIP_FILE; chmod -R 775 $SKETCH_NAME; ls -Fla $SKETCH_NAME)"


echo cleaning up...

rm -rf ~/.Trash/$SKETCH_NAME
mv -f $SKETCH_NAME ~/.Trash
mv -f $ZIP_FILE ~/.Trash

echo Published to ${RED}/rita/examples/$SKETCH_NAME

exit
