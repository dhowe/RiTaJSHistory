#!/bin/sh

# usage: run-tests.sh [-p (phantom=default) || -n (node) ]
#
# calls run-[env]-tests
# 	 phantom -> ant build-all-tests.xml 
#    node    -> run-in-qunit.js
#

if [[ "$#" == 1 && $1 =~ ^-n$ ]]; then 
shift
./run-node-tests.sh $@
exit
fi

if [[ "$#" == 1 && $1 =~ ^-p$ ]]; then
shift
fi

perl ./run-phantom-tests.pl 2> tests-err.txt $@

echo Wrote errors to tests-err.txt
