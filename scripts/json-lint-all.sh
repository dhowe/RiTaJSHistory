#!/bin/sh

lint="/opt/local/bin/jsonlint -q"
dir="../docs/json/"
files=("RiGrammar.json" "RiMarkov.json" "RiTa.json" "RiText.json" "RiLexicon.json" "RiString.json" "RiTaEvent.json")

echo
for i in "${files[@]}"
do :
   echo "$lint $i"
   $lint -q  "$dir$i"
done
