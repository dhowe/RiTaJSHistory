#/bin/sh

set -e # die on errors 


if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    echo "  usage:   tag-release.sh [tag]" 
    exit
fi

VERSION=$1

cd ../dist

