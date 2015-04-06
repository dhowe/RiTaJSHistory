#/bin/sh

set -e # die on errors 

##############################################################

if [ $# -lt "1"  ]
then
    echo
    echo "  error:   tag or version required"
    echo
    echo "  usage:   pub-node.sh [tag] [-p] [-f]"
    echo "           pub-node.sh 1.0.85a"
    echo
    echo "  options:"
    echo "       -p = publish to npm after build "
    echo "       -f = publish with --force option "
    exit
fi

##############################################################

while [ $# -ge 1 ]; do
    case $1 in
        -p) DO_PUBLISH=1  ;;
    esac
    case $1 in
        -f) DO_FORCE=1  ;;
    esac
    shift
done

##############################################################

# do build
cd ..
./node_modules/.bin/gulp build.node
cd -

# create pkg
cd dist/node/rita/
npm pack

# optional publish
if [ $DO_PUBLISH = 1 ]
then
    if [ $DO_FORCE = 1 ]
    then
        echo Calling npm publish --force... 
        npm publish --force rita-$1.tgz
    else
        echo Calling npm publish... 
        npm publish rita-$1.tgz
    fi
    echo Done
else
    echo Done [use [-p] [-f] to publish]
fi

# back to start dir
cd ../../../scripts

echo done

##############################################################
