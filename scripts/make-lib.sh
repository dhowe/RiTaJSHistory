#/bin/sh

if [ $# != 1 ]
then
  echo
    echo "tag or version required"
  echo "usage: pub-lib.sh [tag]"
  exit
fi

VERSION=$1
BUILD=../build

echo Building RiTaJS v$VERSION

# create new build dir
echo Creating $BUILD
/bin/rm -rf $BUILD
mkdir $BUILD

# copy www into $BUILD
echo Copying www dir
cp -r ../www $BUILD

# shrink lib into $BUILD/www/download
echo Minimizing JS code 
echo minimize.sh $VERSION $BUILD
minimize.sh $VERSION $BUILD

# make docs into $BUILD/www/reference
echo Building docs
make-docs.sh $BUILD

# make zip ?


# clean-up
# /bin/rm -rf $BUILD
