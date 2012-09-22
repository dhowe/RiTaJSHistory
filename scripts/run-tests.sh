#!/bin/sh

# usage: run-tests.sh [-p (phantom) || -n (node) ] 

if [[ "$#" == 1 && $1 =~ ^-n$ ]]; then 
    shift
    ./run-node-tests.sh $@
    exit
fi

./run-phantom-tests.pl 2> tests-err.txt $@
