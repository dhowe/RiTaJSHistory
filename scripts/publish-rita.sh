#/bin/sh

#####NEXT

# finish download links
# upgrade to 1.0.32
## test 
  # check rita.jar sym link
  # check all download links
  # check version #s
  # run examples in P5 (check version #s)
## publish-to-red


################### PLAN ###################
# make rita-js
# do ant-build (includes js in rita.jar
# do the publish

# update all version #s  -- where?

# pass from ant to make-lib.sh (make-lib updates 2)

# java:resources/build.properties
# js:src/rita.js (change this***)
# js:www/download/index.html (change this***)

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    echo "  usage:   pub-all.sh [tag] "
    echo "           pub-all.sh 1.0.63 "
    echo
    exit
fi


VERSION=$1
ANT_DIR=~/Documents/eclipse-workspace/RiTa/resources

echo
echo Publishing RiTa/RiTaJS v$VERSION ------------------------------
echo

./make-lib.sh $VERSION

echo Running RiTa-Java ant build
cd $ANT_DIR
ant
cd-

./pub-lib.sh $VERSION
