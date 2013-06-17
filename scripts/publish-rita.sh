#/bin/sh

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
#ant
cd-

echo Zipping the web directory
jar 




