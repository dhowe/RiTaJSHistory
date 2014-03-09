#!/bin/bash
#
# to run one test pass it as an argument: $script RiString
#

set -e # die on errors 

cd ../test

QUNIT=node_modules/qunit/bin/cli.js
SRC=../src

if [ $# -lt "1"  ]
then
  tests="RiGrammar-tests.js RiLexicon-tests.js RiString-tests.js RiTa-tests.js RiTaEvent-tests.js LibraryStructure-tests.js RiMarkov-tests.js"
else
  tests="$1-tests.js"
fi

$QUNIT -c $SRC/rita.js -d $SRC/rita_lts.js $SRC/rita_dict.js node_modules/request  -t $tests

#for test in "${tests[@]}"
#do
#    echo
#done

