#/bin/sh

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    exit
fi

VER=$1


ln -fs rita-${VER}.js rita-latest.js
ln -fs rita-${VER}.min.js rita-latest.min.js
ln -fs rita-${VER}.micro.js rita-latest.micro.js
#ln -fs rita-${VER}.microp5.js rita-latest.microp5.js
ln -fs ritext-${VER}.js ritext-latest.js

#ln -fs rita-${VER}.jar rita-latest.jar
#ln -fs RiTa-${VER}.zip RiTa-latest.zip
