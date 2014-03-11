#!/bin/sh

echo "\nRunning tests in NodeJS...\n\n"

cd ../test
echo node node-qunit-runner.js $@
node node-qunit-runner.js $@
