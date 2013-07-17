#!/bin/sh

set -e # die on errors 


JSPROJ="/Users/dhowe/Documents/eclipse-workspace/RiTa/RiTaLibraryJS"
GENZIP="$JSPROJ/tools/refgen/doc-gen.zip"
GENPROJ="/Users/dhowe/Documents/eclipse-workspace/RiTa_DocGen"
GENBIN="$GENPROJ/bin"

cd $GENBIN

jar cvf $GENZIP *.class

jar tf $GENZIP

echo done

