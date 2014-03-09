#!/bin/bash

EXAMPLES=(ASimpleOne BoundingBoxes HaikuGrammar LetterGrid SlotMachine TextLayout TextMotion WordsLettersLines)

for ex in "${EXAMPLES[@]}"
do
    echo PUBLISHING $ex
    ./pub-example.sh $ex
    echo \n
done
