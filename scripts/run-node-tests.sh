#!/bin/sh

echo "\nRunning tests in NodeJS...\n\n"

cd ../test/node
echo node ./run-in-qunit.js $@
node ./run-in-qunit.js $@
