#!/bin/sh

set -e # die on errors 

lint="/opt/local/bin/jsonlint -q"
dir="../docs/json/"
files=("RiGrammar.json" "RiMarkov.json" "RiTa.json" "RiText.json" "RiLexicon.json" "RiString.json" "RiTaEvent.json")

if [ $# -gt "0"  ]
then
  files=($1)
fi


echo
for i in "${files[@]}"
do :
   echo "$lint $i"
   $lint -q  "$dir$i"
done
