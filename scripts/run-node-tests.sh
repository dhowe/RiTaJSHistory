#!/bin/sh

echo "\nRunning tests in NodeJS...\n\n"

cd ../test/node
node ./run-in-qunit.js $@
