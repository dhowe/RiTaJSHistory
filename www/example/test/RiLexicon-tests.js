var runtests = function() {

    // Called after each test finishes...
    QUnit.testStart = function(test, failed, passed, total)  {
        RiLexicon.data = undefined;
    };


    var functions = ["addWord", 
                     "clear",
                     "containsWord", 
                     "getAlliterations", 
                     "getLexicalData", 
                     "getRandomWord", 
                     "getRhymes",
                     "getWords" ,
                     "isAdverb",
                     "isNoun",
                     "isVerb",
                     "isAdjective",
                     "isAlliteration", 
                     "isRhyme", 
                     "removeWord", 
                     "setLexicalData",
                     "similarByLetter", 
                     "similarBySound", 
                     "similarBySoundAndLetter",
                     "size",
                     "substrings", 
                     "superstrings"];
    
    test("RiLexicon[singleton]", function() {

        var lex1 = new RiLexicon();
        var lex2 = new RiLexicon();
        ok(1);
    });

    test("RiLexicon-functions", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = RiLexicon();
        for ( var i = 0; i < functions.length; i++) {

            equal(typeof lex[functions[i]], 'function', functions[i]);
        }

    });


    test("RiLexicon-lookups", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(typeof RiLexicon.data != 'undefined');
        ok(typeof RiLexicon != 'undefined', "RiLexicon OK");

        ok(lex._getPhonemes('gonna'));
        ok(lex._getPhonemes('gotta'));

        ok(lex.isRhyme("cat", "hat"));
        ok(!lex.isRhyme("cat", "dog"));
        ok(lex.isAlliteration("cat", "kill"));
        ok(!lex.isAlliteration("cat", "dog"));
    });

    test("RiLexicon-gets", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        var word = "aberrations";
        var output1 = lex._getSyllables(word);
        var output2 = lex._getPhonemes(word);
        var output3 = lex._getStresses(word);

        var expected1 = "ae-b/er/ey-sh/ax-n-z";
        equal(output1, expected1);

        var expected2 = "ae-b-er-ey-sh-ax-n-z";
        equal(output2, expected2);

        var expected3 = "1/0/1/0";
        equal(output3, expected3);

    });

    test("RiLexicon.addWord()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();
        var result = lex.addWord("bananana", "b-ax-n ae1-n ax ax", "nn");
        ok(lex.containsWord("bananana"));

        lex.addWord("hehehe", "hh-ee1 hh-ee1 hh-ee1", "uh");
        ok(lex.containsWord("hehehe"));

        equal(lex._getPhonemes("hehehe"), "hh-ee-hh-ee-hh-ee");

        lex.addWord("HAHAHA", "hh-aa1 hh-aa1 hh-aa1", "uh");
        ok(lex.containsWord("HAHAHA"));

        lex.addWord("HAHAHA", "hh-aa1 hh-aa1 hh-aa1", "uh");
        equal(lex._getPhonemes("HAHAHA"), "hh-aa-hh-aa-hh-aa");

        var lex = new RiLexicon();
        lex.addWord("", "", "");

        lex.clear();
    });


    test("RiLexicon.clear()", function() {

        var lex = new RiLexicon();
        ok(lex.containsWord("banana"));
        lex.removeWord("banana");

        ok(!lex.containsWord("banana"));

        lex.clear();
        lex = new RiLexicon();

        ok(lex.containsWord("banana"));
        ok(lex.containsWord("funny"));

        var obj = [];
        obj["wonderfullyy"] = [ "w-ah1-n-d er-f ax-l iy", "rb" ];
        var result = lex.setLexicalData(obj);
        deepEqual(result, obj);
        ok(lex.containsWord("wonderfullyy"));

        lex.clear();
        var lex = new RiLexicon();
        ok(!lex.containsWord("wonderfullyy"));
        ok(lex.containsWord("wonderful"));

        var lex = new RiLexicon();
        var result = lex.getLexicalData();
        ok(Object.keys(result).length > 1000);

        lex.clear();
        var lex = new RiLexicon();
        ok(Object.keys(result).length > 1000);
    });


    test("RiLexicon.containsWord()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(lex.containsWord("cat"));
        ok(lex.containsWord("cats"));
        ok(!lex.containsWord("cated"));
        ok(lex.containsWord("funny"));
        ok(lex.containsWord("shit"));
        ok(!lex.containsWord("123"));
        ok(!lex.containsWord("hellx"));
        ok(lex.containsWord("hello"));
        ok(lex.containsWord("HeLLo"));
        ok(lex.containsWord("HELLO"));

        RiLexicon.data['hello'] = undefined;
        ok(!lex.containsWord("hello"));

        ok(!lex.containsWord(""));

    });

    test("RiLexicon.getAlliterations()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon(); // only 1 per test needed
        var result = lex.getAlliterations("cat");
        ok(result.length > 2000);

        var result = lex.getAlliterations("dog");
        ok(result.length > 1000);

        var result = lex.getAlliterations("URL");
        ok(!(result.length > 1000));

        var result = lex.getAlliterations("no stress");
        ok(!(result.length > 1000));

        var result = lex.getAlliterations("#$%^&*");
        ok(!(result.length > 1000));

        var result = lex.getAlliterations("");
        ok(!(result.length > 1000));


    });


    test("RiLexicon.getLexicalData()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();
        var result = lex.getLexicalData();
        ok(Object.keys(result).length > 1000);

        var re = lex.getLexicalData();
        var result = re.a;
        var answer = [ "ey1", "dt vb vbn nnp fw jj ls nn" ];

        deepEqual(result, answer);

        var re = lex.getLexicalData();
        var result = re.the;
        var answer = [ "dh-ax", "dt vbd vbp nn in jj nnp pdt" ];

        deepEqual(result, answer);

        //no error checks needed              
    });

    test("RiLexicon.getRandomWord()", function() { //TODO More Test

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        //getRandomWord();, getRandomWord(targetLength);, getRandomWord(pos);, getRandomWord(pos, targetLength);
        var lex = new RiLexicon();

        var result = lex.getRandomWord();
        ok(result.length > 0, "getRandomWord: " + result);

        var result = lex.getRandomWord("nn");
        ok(result.length > 0, "getRandomWord nn: " + result);

        var result = lex.getRandomWord("nns");
        ok(result.length > 0, "getRandomWord nns: " + result);

        var result = lex.getRandomWord(3);
        ok(result.length > 0, "3 syllableCount: " + result);

        var result = lex.getRandomWord(5);
        ok(result.length > 0, "5 syllableCount: " + result);

        var result = lex.getRandomWord("nns", 3);
        ok(result.length > 0, "3 syllableCount + nns: " + result);


    });


    test("RiLexicon.getRhymes()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        result = lex.getRhymes("apple");
        var answer = [ "chapel", "grapple", "pineapple" ];
        deepEqual(result, answer);

        result = lex.getRhymes("apple.");
        var answer = [];
        deepEqual(result, answer);

        result = lex.getRhymes("bible");
        var answer = [ "libel", "tribal" ];
        deepEqual(result, answer);

        var result = lex.getRhymes("google");
        var answer = [];
        deepEqual(result, answer);

        result = lex.getRhymes("happens in here");
        var answer = [];
        deepEqual(result, answer);

        result = lex.getRhymes("");
        var answer = [];
        deepEqual(result, answer);


    });

    test("RiLexicon.getWords()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();
        var result = lex.getWords();
        ok(result.length > 1000);

        var result2 = lex.getWords(false);
        var result1 = lex.getWords(true);
        ok(result1.length > 1000);
        ok(result2.length > 1000);
        notDeepEqual(result1, result2);

        //getWords(regex);
        var result = lex.getWords("colou*r");
        ok(result.length > 5);

        var result = lex.getWords("[^A-M]in");
        ok(result.length > 5);

        var result1 = lex.getWords("colou*r", true);
        ok(result1.length > 5);

        var result2 = lex.getWords(true, "colou*r");
        ok(result2.length > 5);
        notDeepEqual(result1, result2);

        var result1 = lex.getWords("colou*r", false);
        ok(result1.length > 5);

        var result2 = lex.getWords(false, "colou*r");
        ok(result2.length > 5);

        deepEqual(result1, result2);


    });

    test("RiLexicon().isAdverb()", function() {

        ok(!RiLexicon().isAdverb("swim"));
        ok(!RiLexicon().isAdverb("walk"));
        ok(!RiLexicon().isAdverb("walker"));
        ok(!RiLexicon().isAdverb("beautiful"));
        ok(!RiLexicon().isAdverb("dance"));
        ok(!RiLexicon().isAdverb("dancing"));
        ok(!RiLexicon().isAdverb("dancer"));

        //verb
        ok(!RiLexicon().isAdverb("wash"));
        ok(!RiLexicon().isAdverb("walk"));
        ok(!RiLexicon().isAdverb("play"));
        ok(!RiLexicon().isAdverb("throw"));
        ok(!RiLexicon().isAdverb("drink"));
        ok(!RiLexicon().isAdverb("eat"));
        ok(!RiLexicon().isAdverb("chew"));

        //adj
        ok(!RiLexicon().isAdverb("wet"));
        ok(!RiLexicon().isAdverb("dry"));
        ok(!RiLexicon().isAdverb("furry"));
        ok(!RiLexicon().isAdverb("sad"));
        ok(!RiLexicon().isAdverb("happy"));

        //n
        ok(!RiLexicon().isAdverb("dogs"));
        ok(!RiLexicon().isAdverb("wind"));
        ok(!RiLexicon().isAdverb("dolls"));
        ok(!RiLexicon().isAdverb("frogs"));
        ok(!RiLexicon().isAdverb("ducks"));
        ok(!RiLexicon().isAdverb("flowers"));
        ok(!RiLexicon().isAdverb("fish"));

        //adv
        ok(RiLexicon().isAdverb("truthfully"));
        ok(RiLexicon().isAdverb("kindly"));
        ok(RiLexicon().isAdverb("bravely"));
        ok(RiLexicon().isAdverb("doggedly"));
        ok(RiLexicon().isAdverb("sleepily"));
        ok(RiLexicon().isAdverb("excitedly"));
        ok(RiLexicon().isAdverb("energetically"));
        ok(RiLexicon().isAdverb("hard")); // +adj

        ok(!RiLexicon().isAdverb(""));

        throws(function() {

            try {
                ok(RiLexicon().isAdverb("banana split"));

            }
            catch (e) {
                throw e;
            }
        });
    });

    test("RiLexicon().isNoun()", function() {

        ok(RiLexicon().isNoun("swim"));
        ok(RiLexicon().isNoun("walk"));
        ok(RiLexicon().isNoun("walker"));
        ok(RiLexicon().isNoun("dance"));
        ok(RiLexicon().isNoun("dancing"));
        ok(RiLexicon().isNoun("dancer"));

        //verb
        ok(RiLexicon().isNoun("wash"));//"TODO:also false in processing -> nn" shoulbe be both Verb and Noun
        ok(RiLexicon().isNoun("walk"));
        ok(RiLexicon().isNoun("play"));
        ok(RiLexicon().isNoun("throw"));
        ok(RiLexicon().isNoun("drink"));//TODO:"also false in processing -> nn" shoulbe be both Verb and Noun
        ok(!RiLexicon().isNoun("eat"));
        ok(!RiLexicon().isNoun("chew"));

        //adj
        ok(!RiLexicon().isNoun("hard"));
        ok(!RiLexicon().isNoun("dry"));
        ok(!RiLexicon().isNoun("furry"));
        ok(!RiLexicon().isNoun("sad"));
        ok(!RiLexicon().isNoun("happy"));
        ok(!RiLexicon().isNoun("beautiful"));

        //n
        ok(RiLexicon().isNoun("dogs"));
        ok(RiLexicon().isNoun("wind"));
        ok(RiLexicon().isNoun("dolls"));
        ok(RiLexicon().isNoun("frogs"));
        ok(RiLexicon().isNoun("ducks"));
        ok(RiLexicon().isNoun("flowers"));
        ok(RiLexicon().isNoun("fish"));
        ok(RiLexicon().isNoun("wet")); //+v/adj

        //adv
        ok(!RiLexicon().isNoun("truthfully"));
        ok(!RiLexicon().isNoun("kindly"));
        ok(!RiLexicon().isNoun("bravely"));
        ok(!RiLexicon().isNoun("scarily"));
        ok(!RiLexicon().isNoun("sleepily"));
        ok(!RiLexicon().isNoun("excitedly"));
        ok(!RiLexicon().isNoun("energetically"));

        ok(!RiLexicon().isNoun(""));

        throws(function() {

            try {
                ok(RiLexicon().isNoun("banana split"));

            }
            catch (e) {
                throw e;
            }
        });
    });

    test("RiLexicon().isVerb()", function() {

        ok(RiLexicon().isVerb("dance"));
        ok(RiLexicon().isVerb("swim"));
        ok(RiLexicon().isVerb("walk"));
        ok(!RiLexicon().isVerb("walker"));
        ok(!RiLexicon().isVerb("beautiful"));

        ok(RiLexicon().isVerb("dancing"));
        ok(!RiLexicon().isVerb("dancer"));

        //verb
        ok(RiLexicon().isVerb("eat"));
        ok(RiLexicon().isVerb("chew"));

        ok(RiLexicon().isVerb("throw")); // +n 
        ok(RiLexicon().isVerb("walk")); // +n 
        ok(RiLexicon().isVerb("wash")); // +n 
        ok(RiLexicon().isVerb("drink")); // +n 
        ok(RiLexicon().isVerb("ducks")); // +n
        ok(RiLexicon().isVerb("fish")); // +n
        ok(RiLexicon().isVerb("dogs")); // +n
        ok(RiLexicon().isVerb("wind")); // +n
        ok(RiLexicon().isVerb("wet")); // +adj
        ok(RiLexicon().isVerb("dry")); // +adj

        //adj
        ok(!RiLexicon().isVerb("hard"));
        ok(!RiLexicon().isVerb("furry"));
        ok(!RiLexicon().isVerb("sad"));
        ok(!RiLexicon().isVerb("happy"));

        //n
        ok(!RiLexicon().isVerb("dolls"));
        ok(!RiLexicon().isVerb("frogs"));
        ok(!RiLexicon().isVerb("flowers"));

        //adv
        ok(!RiLexicon().isVerb("truthfully"));
        ok(!RiLexicon().isVerb("kindly"));
        ok(!RiLexicon().isVerb("bravely"));
        ok(!RiLexicon().isVerb("scarily"));
        ok(!RiLexicon().isVerb("sleepily"));
        ok(!RiLexicon().isVerb("excitedly"));
        ok(!RiLexicon().isVerb("energetically"));

        throws(function() {

            try {
                ok(RiLexicon().isVerb("banana split"));

            }
            catch (e) {
                throw e;
            }
        });

    });


    test("RiLexicon().isAdjective()", function() {

        ok(!RiLexicon().isAdjective("swim"));
        ok(!RiLexicon().isAdjective("walk"));
        ok(!RiLexicon().isAdjective("walker"));
        ok(RiLexicon().isAdjective("beautiful"));
        ok(!RiLexicon().isAdjective("dance"));
        ok(!RiLexicon().isAdjective("dancing"));
        ok(!RiLexicon().isAdjective("dancer"));

        //verb
        ok(!RiLexicon().isAdjective("wash"));
        ok(!RiLexicon().isAdjective("walk"));
        ok(!RiLexicon().isAdjective("play"));
        ok(!RiLexicon().isAdjective("throw"));
        ok(!RiLexicon().isAdjective("drink"));
        ok(!RiLexicon().isAdjective("eat"));
        ok(!RiLexicon().isAdjective("chew"));

        //adj
        ok(RiLexicon().isAdjective("hard"));
        ok(RiLexicon().isAdjective("wet"));
        ok(RiLexicon().isAdjective("dry"));
        ok(RiLexicon().isAdjective("furry"));
        ok(RiLexicon().isAdjective("sad"));
        ok(RiLexicon().isAdjective("happy"));
        ok(RiLexicon().isAdjective("kindly")); //+adv

        //n
        ok(!RiLexicon().isAdjective("dogs"));
        ok(!RiLexicon().isAdjective("wind"));
        ok(!RiLexicon().isAdjective("dolls"));
        ok(!RiLexicon().isAdjective("frogs"));
        ok(!RiLexicon().isAdjective("ducks"));
        ok(!RiLexicon().isAdjective("flowers"));
        ok(!RiLexicon().isAdjective("fish"));

        //adv
        ok(!RiLexicon().isAdjective("truthfully"));
        ok(!RiLexicon().isAdjective("bravely"));
        ok(!RiLexicon().isAdjective("scarily"));
        ok(!RiLexicon().isAdjective("sleepily"));
        ok(!RiLexicon().isAdjective("excitedly"));
        ok(!RiLexicon().isAdjective("energetically"));


        throws(function() {

            try {
                ok(RiLexicon().isAdjective("banana split"));

            }
            catch (e) {
                throw e;
            }
        });
    });

    test("RiLexicon.isAlliteration()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(lex.isAlliteration("apple", "polo"));
        ok(lex.isAlliteration("polo", "apple")); // swap position
        ok(lex.isAlliteration("POLO", "apple")); // CAPITAL LETTERS
        ok(lex.isAlliteration("POLO", "APPLE")); // CAPITAL LETTERS
        ok(lex.isAlliteration("polo", "APPLE")); // CAPITAL LETTERS
        ok(!lex.isAlliteration("polo ", "APPLE")); // Word with space False
        ok(!lex.isAlliteration("polo    ", "APPLE")); // Word with tab space False
        ok(lex.isAlliteration("this", "these"));
        ok(!lex.isAlliteration("solo", "tomorrow"));
        ok(!lex.isAlliteration("solo", "yoyo"));
        ok(!lex.isAlliteration("yoyo", "jojo"));
        ok(!lex.isAlliteration("", ""));

    });


    test("RiLexicon.isRhyme()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(!lex.isRhyme("solo ", "tomorrow"));
        ok(!lex.isRhyme("apple", "polo"));
        ok(!lex.isRhyme("this", "these"));

        ok(lex.isRhyme("solo", "tomorrow"));
        ok(lex.isRhyme("tomorrow", "solo"));
        ok(lex.isRhyme("SOLO", "tomorrow"));
        ok(lex.isRhyme("solo", "TomorRow"));
        ok(lex.isRhyme("soLo", "toMORrow"));

        ok(lex.isRhyme("cat", "hat"));
        ok(lex.isRhyme("yellow", "mellow"));
        ok(lex.isRhyme("toy", "boy"));
        ok(lex.isRhyme("sieve", "give"));

        ok(!lex.isRhyme("solo   ", "tomorrow")); // Word with tab space
        ok(!lex.isRhyme("solo", "yoyo"));
        ok(!lex.isRhyme("yoyo", "jojo"));
        ok(!lex.isRhyme("", ""));

    });

    test("RiLexicon.removeWord()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(lex.containsWord("banana"));
        lex.removeWord("banana");
        ok(!lex.containsWord("banana"));

        lex.removeWord("a");
        ok(!lex.containsWord("a"));
        ok(lex.containsWord("are")); //check that others r still there
        lex.removeWord("aaa");
        ok(!lex.containsWord("aaa"));

        lex.removeWord("");

        ok(!lex._getPhonemes("banana"));
    });


    test("RiLexicon.setLexicalData()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();
        var originalLex = lex.getLexicalData();
        lex.setLexicalData(originalLex);

        var obj = [];
        obj["wonderfully"] = [ "w-ah1-n-d er-f ax-l iy", "rb" ];
        var result = lex.setLexicalData(obj);
        deepEqual(result, obj);

        var obj = [];
        obj["wonderfully"] = [ "w-ah1-n-d er-f ax-l iy", "rb" ];
        obj["wonderfullyy"] = [ "w-ah1-n-d er-f ax-l iy-y", "rb" ];
        var result = lex.setLexicalData(obj);
        deepEqual(result, obj);
        deepEqual(result.wonderfullyy, [ "w-ah1-n-d er-f ax-l iy-y", "rb" ]);

        var result = lex.setLexicalData(null);
        deepEqual(result, null);

    });

    // TODO: clear() failing may be killing this test
    test(
        "RiLexicon.similarByLetter()",
        function() {

            ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

            //similarByLetter(input); similarByLetter(input, result, minMed, preserveLength); <-String Set int boolean

            var lex = RiLexicon();
            var result = lex.similarByLetter("banana");
            var answer = [ "banal", "bonanza", "cabana", "lantana", "manna", "wanna" ];
            deepEqual(result, answer);


            var result = lex.similarByLetter("banana", 1, true);
            var answer = [ "cabana" ];
            deepEqual(result, answer, "true");


            var result = lex.similarByLetter("banana", 1, false);
            var answer = [ "banal", "bonanza", "cabana", "lantana", "manna", "wanna" ];
            deepEqual(result, answer, "false");


            var result = lex.similarByLetter("tornado");
            var answer = [ "torpedo" ];
            deepEqual(result, answer);


            var result = lex.similarByLetter("ice");
            var answer = [ "ace", "dice", "iced", "icy", "ire", "lice", "mice", "nice", "rice", "vice" ];
            deepEqual(result, answer);


            var result = lex.similarByLetter("ice", 1);
            var answer = [ "ace", "dice", "iced", "icy", "ire", "lice", "mice", "nice", "rice", "vice" ];
            deepEqual(result, answer);


            var result = lex.similarByLetter("ice", 2, true);
            ok(result.length > 10);


            var result = lex.similarByLetter("ice", 0, true);
            var answer = [ "ace", "icy", "ire" ];
            deepEqual(result, answer);

            var result = lex.similarByLetter("worngword");
            var answer = [ "foreword", "wormwood" ];
            deepEqual(result, answer);


            var result = lex.similarByLetter("worngword");
            var answer = [ "foreword", "wormwood" ];
            deepEqual(result, answer);


            var result = lex.similarByLetter("123");
            ok(result.length > 400);


            var result = lex.similarByLetter("");
            var answer = [];
            deepEqual(result, answer);
        });

    test(
        "RiLexicon.similarBySound()",
        function() {

            RiLexicon.data = undefined;

            var lex = new RiLexicon();

            var result = lex.similarBySound("tornado");
            var answer = [ "torpedo" ];
            deepEqual(result, answer);

            var result = lex.similarBySound("try");
            var answer = [ "cry", "dry", "fry", "pry", "rye", "tie", "tray", "tree", "tribe", "tried", "tries", "tripe", "trite", "true", "wry" ];
            deepEqual(result, answer);

            var result = lex.similarBySound("try", 1); // same
            deepEqual(result, answer);

            var result = lex.similarBySound("try", 2);
            ok(result.length > answer.length); // more

            var result = lex.similarBySound("worngword");
            var answer = [ "watchword", "wayward", "wormwood" ];
            deepEqual(result, answer);

            var result = lex.similarBySound("happy");
            var answer = [ "happier", "hippie" ];
            deepEqual(result, answer);

            var result = lex.similarBySound("happy", 1); // same
            deepEqual(result, answer);

            var result = lex.similarBySound("happy", 2);
            ok(result.length > answer.length); // more

            var result = lex.similarBySound("cat");
            var answer = [ "at", "bat", "cab", "cache", "calf", "can", "cant", "cap", "capped", "cash", "cashed", "cast", "caste", "catch", "catty", "caught", "chat", "coat", "cot", "curt", "cut", "fat", "hat", "kit", "kite", "mat", "matt", "matte", "pat", "rat", "sat", "tat", "that" ];
            deepEqual(result, answer);

            var result = lex.similarBySound("cat", 1);
            ok(result.length == answer.length); // same     

            var result = lex.similarBySound("cat", 2);
            ok(result.length > answer.length);

            var result = lex.similarBySound("");
            var answer = [];
            deepEqual(result, answer);
        });

    test(
        "RiLexicon.similarBySoundAndLetter()",
        function() {

            RiLexicon.data = undefined;

            ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

            var lex = new RiLexicon();
            var result = lex.similarBySoundAndLetter("try");
            var answer = [ "cry", "dry", "fry", "pry", "tray", "wry" ];
            deepEqual(result, answer);

            var lex = new RiLexicon();
            var result = lex.similarBySoundAndLetter("daddy");
            var answer = [ "dandy" ];
            deepEqual(result, answer);

            var lex = new RiLexicon();
            var result = lex.similarBySoundAndLetter("daddy", 1);
            deepEqual(result, answer);

            var lex = new RiLexicon();
            var result = lex.similarBySoundAndLetter("daddy", 2);
            var answer = [ "dad", "dally", "dowdy" ];
            ok(result.length > 10);

            var result = lex.similarBySoundAndLetter("banana");
            var answer = [ "bonanza" ];
            deepEqual(result, answer);

            var result = lex.similarBySoundAndLetter("tornado");
            var answer = [ "torpedo" ];
            deepEqual(result, answer);

            var result = lex.similarBySoundAndLetter("tornado", 2);
            var answer = [ "torpedo" ];
            deepEqual(result, answer);

            var result = lex.similarBySoundAndLetter("tornado", 3);
            ok(result.length > answer.length); // more
            var answer = [ "horned", "ornate", "tirade", "torn", "torpid", "torrid", "torso", "trade" ];
            deepEqual(result, answer);


            var lex = new RiLexicon();
            var result = lex.similarBySoundAndLetter("worngword");
            var answer = [ "wormwood" ];
            deepEqual(result, answer);

            var result = lex.similarBySoundAndLetter("");
            var answer = [];
            deepEqual(result, answer);
        });

    test("RiLexicon.substrings()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon(); // only 1 per test needed

        var result = lex.substrings("thousand");
        var answer = [ "sand", "thou" ];
        deepEqual(result, answer);

        var result = lex.substrings("thousand", 2);
        var answer = [ "an", "and", "ho", "sand", "thou", "us" ];
        deepEqual(result, answer);

        var result = lex.substrings("banana", 1);
        var answer = [ "a", "an", "b", "ban", "n", "na" ];
        deepEqual(result, answer);

        var result = lex.substrings("thousand", 3);
        var answer = [ "and", "sand", "thou" ];
        deepEqual(result, answer);

        var result = lex.substrings("thousand"); // min-length=4
        var answer = [ "sand", "thou" ];
        deepEqual(result, answer);

        var result = lex.substrings("");
        var answer = [];
        deepEqual(result, answer);

    });

    test(
        "RiLexicon.superstrings()",
        function() {


            ok(!RiLexicon || typeof RiLexicon.data == 'undefined');


            var lex = new RiLexicon();
            var result = lex.superstrings("superm");
            var answer = [ "supermarket", "supermarkets" ];
            deepEqual(result, answer);

            var result = lex.superstrings("puni");
            var answer = [ "impunity", "punish", "punishable", "punished", "punishes", "punishing", "punishment", "punishments", "punitive", "unpunished" ];
            deepEqual(result, answer);

            var result = lex.superstrings("");
            var answer = [ "" ];
            ok(result.length > 1000);

        });

    test("RiLexicon.getPosData()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();
        var result = lex._getPosData("box");
        deepEqual(result, "nn vb");

        var result = lex._getPosData("there");
        deepEqual(result, "ex rb uh");

        var result = lex._getPosData("is");
        deepEqual(result, "vbz rb nns vbp");

        var result = lex._getPosData("a");
        deepEqual(result, "dt vb vbn nnp fw jj ls nn");

        var result = lex._getPosData("beautiful");
        deepEqual(result, "jj");

        //Empty String
        var result = lex._getPosData(".");
        deepEqual(result, "");

        var lex = new RiLexicon();
        var result = lex._getPosData("beautiful guy");
        deepEqual(result, "");


    });


    test("RiLexicon.isVowel()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(lex._isVowel("a"));
        ok(lex._isVowel("e"));
        ok(lex._isVowel("i"));
        ok(lex._isVowel("o"));
        ok(lex._isVowel("u"));

        ok(!lex._isVowel("y"));
        ok(!lex._isVowel("v"));
        ok(!lex._isVowel("3"));
        ok(!lex._isVowel(""));

    });


    test("RiLexicon.isConsonant()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        ok(!lex._isConsonant("vv"));
        ok(!lex._isConsonant(""));

        ok(lex._isConsonant("v"));
        ok(lex._isConsonant("b"));
        ok(lex._isConsonant("d"));
        ok(lex._isConsonant("q"));


        ok(!lex._isConsonant("a"));
        ok(!lex._isConsonant("e"));
        ok(!lex._isConsonant("i"));
        ok(!lex._isConsonant("o"));
        ok(!lex._isConsonant("uu"));

        ok(!lex._isConsonant("3"));//why fail?

    });




    test("RiLexicon.lookupRaw()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        var result = lex._lookupRaw("banana");
        deepEqual(result, [ "b-ax-n ae1-n ax", "nn" ]);

        var result = lex._lookupRaw("sand");
        deepEqual(result, [ "s-ae1-n-d", "nn" ]);

        var result = lex._lookupRaw("hex");
        deepEqual(result, null);

        var result = lex._lookupRaw("there is");
        deepEqual(result, null);

        var result = lex._lookupRaw("ajj");
        deepEqual(result, null);
    });




    //For RiTa.getPhonemes()
    test("RiLexicon.getPhonemes()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        var result = lex._getPhonemes("The");
        var answer = "dh-ax";
        equal(result, answer);

        var result = lex._getPhonemes("The.");
        var answer = "dh-ax";
        equal(result, answer);

        var result = lex._getPhonemes("The boy jumped over the wild dog.");
        var answer = "dh-ax b-oy jh-ah-m-p-t ow-v-er dh-ax w-ay-l-d d-ao-g";
        equal(result, answer);

        var result = lex._getPhonemes("The boy ran to the store.");
        var answer = "dh-ax b-oy r-ae-n t-uw dh-ax s-t-ao-r";
        equal(result, answer);

        var result = lex._getPhonemes("");
        var answer = "";
        equal(result, answer);

    });

    //For RiTa.getStresses()

    test("RiLexicon.getStresses()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        var result = lex._getStresses("The emperor had no clothes on");
        var answer = "0 1/0/0 1 1 1 1";
        equal(result, answer);

        var result = lex._getStresses("The emperor had no clothes on.");
        var answer = "0 1/0/0 1 1 1 1";
        equal(result, answer);

        var result = lex._getStresses("The emperor had no clothes on. The King is fat.");
        var answer = "0 1/0/0 1 1 1 1 0 1 1 1";
        equal(result, answer);

        var result = lex._getStresses("to preSENT, to exPORT, to deCIDE, to beGIN");
        var answer = "1 0/1 1 0/1 1 0/1 1 0/1";
        equal(result, answer);

        var result = lex._getStresses("to present, to export, to decide, to begin");
        var answer = "1 0/1 1 0/1 1 0/1 1 0/1";
        equal(result, answer);

        var result = lex._getStresses("");
        var answer = "";
        equal(result, answer);


    });

    test("RiLexicon.getSyllables()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = new RiLexicon();

        var result = lex._getSyllables("The emperor had no clothes on.");
        var answer = "dh-ax eh-m-p/er/er hh-ae-d n-ow k-l-ow-dh-z aa-n";
        equal(result, answer);

        var result = lex._getSyllables("@#$%&*()");
        var answer = "";
        equal(result, answer);

        var result = lex._getSyllables("");
        var answer = "";
        equal(result, answer);


    });

}