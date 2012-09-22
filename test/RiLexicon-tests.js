var runtests = function() {
    
	QUnit.module("RiLexicon", {
	    setup: function () {
			RiLexicon.data = undefined;
	    },
	    teardown: function () {
	    }
	});

 	function createLex() {
 		RiTa.SILENT = 1;
 		var rl = new RiLexicon();
 		RiTa.SILENT = 0;
 		return rl;
 	}
 	
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

        var lex1 = createLex();
        var lex2 = createLex();
        ok(1);
    });

    test("RiLexicon-functions", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex();
        for ( var i = 0; i < functions.length; i++) {

            equal(typeof lex[functions[i]], 'function', functions[i]);
        }

    });


    test("RiLexicon-lookups", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex();

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

        var lex = createLex();

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

        var lex = createLex()
        var result = lex.addWord("bananana", "b-ax-n ae1-n ax ax", "nn");
        ok(lex.containsWord("bananana"));

        lex.addWord("hehehe", "hh-ee1 hh-ee1 hh-ee1", "uh");
        ok(lex.containsWord("hehehe"));

        equal(lex._getPhonemes("hehehe"), "hh-ee-hh-ee-hh-ee");

        lex.addWord("HAHAHA", "hh-aa1 hh-aa1 hh-aa1", "uh");
        ok(lex.containsWord("HAHAHA"));

        lex.addWord("HAHAHA", "hh-aa1 hh-aa1 hh-aa1", "uh");
        equal(lex._getPhonemes("HAHAHA"), "hh-aa-hh-aa-hh-aa");

        var lex = createLex()
        lex.addWord("", "", "");

        lex.clear();
    });


    test("RiLexicon.clear()", function() {

        var lex = createLex()
        ok(lex.containsWord("banana"));
        lex.removeWord("banana");

        ok(!lex.containsWord("banana"));

        lex.clear();
        lex = createLex();

        ok(lex.containsWord("banana"));
        ok(lex.containsWord("funny"));

        var obj = [];
        obj["wonderfullyy"] = [ "w-ah1-n-d er-f ax-l iy", "rb" ];
        var result = lex.setLexicalData(obj);
        deepEqual(result, obj);
        ok(lex.containsWord("wonderfullyy"));

        lex.clear();
        var lex = createLex()
        ok(!lex.containsWord("wonderfullyy"));
        ok(lex.containsWord("wonderful"));

        var lex = createLex()
        var result = lex.getLexicalData();
        ok(Object.keys(result).length > 1000);

        lex.clear();
        var lex = createLex()
        ok(Object.keys(result).length > 1000);
    });


    test("RiLexicon.containsWord()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex()

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

        var lex = createLex() // only 1 per test needed
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
        
        // TODO: better tests
    });


    test("RiLexicon.getLexicalData()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex()
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
    });

    test("RiLexicon.getRandomWord()", function() { //TODO More Test

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined'); 

        //getRandomWord();, getRandomWord(targetLength);, getRandomWord(pos);, getRandomWord(pos, targetLength);
        var lex = createLex()

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

        // TODO: more tests with both count and pos
    });


    test("RiLexicon.getRhymes()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex()

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

        var lex = createLex()
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

    test("RiLexicon.isAdverb()", function() {

        ok(!createLex().isAdverb("swim"));
        ok(!createLex().isAdverb("walk"));
        ok(!createLex().isAdverb("walker"));
        ok(!createLex().isAdverb("beautiful"));
        ok(!createLex().isAdverb("dance"));
        ok(!createLex().isAdverb("dancing"));
        ok(!createLex().isAdverb("dancer"));

        //verb
        ok(!createLex().isAdverb("wash"));
        ok(!createLex().isAdverb("walk"));
        ok(!createLex().isAdverb("play"));
        ok(!createLex().isAdverb("throw"));
        ok(!createLex().isAdverb("drink"));
        ok(!createLex().isAdverb("eat"));
        ok(!createLex().isAdverb("chew"));

        //adj
        ok(!createLex().isAdverb("wet"));
        ok(!createLex().isAdverb("dry"));
        ok(!createLex().isAdverb("furry"));
        ok(!createLex().isAdverb("sad"));
        ok(!createLex().isAdverb("happy"));

        //n
        ok(!createLex().isAdverb("dogs"));
        ok(!createLex().isAdverb("wind"));
        ok(!createLex().isAdverb("dolls"));
        ok(!createLex().isAdverb("frogs"));
        ok(!createLex().isAdverb("ducks"));
        ok(!createLex().isAdverb("flowers"));
        ok(!createLex().isAdverb("fish"));

        //adv
        ok(createLex().isAdverb("truthfully"));
        ok(createLex().isAdverb("kindly"));
        ok(createLex().isAdverb("bravely"));
        ok(createLex().isAdverb("doggedly"));
        ok(createLex().isAdverb("sleepily"));
        ok(createLex().isAdverb("excitedly"));
        ok(createLex().isAdverb("energetically"));
        ok(createLex().isAdverb("hard")); // +adj

        ok(!createLex().isAdverb(""));

        throws(function() {
            RiTa.SILENT=1;
            try {
                createLex().isAdverb("banana split");
            }
            catch (e) {
                throw e;
            }
			RiTa.SILENT = 0;
        });
    });
    
    return;

    test("RiLexicon.isNoun()", function() {

        ok(createLex().isNoun("swim"));
        ok(createLex().isNoun("walk"));
        ok(createLex().isNoun("walker"));
        ok(createLex().isNoun("dance"));
        ok(createLex().isNoun("dancing"));
        ok(createLex().isNoun("dancer"));

        //verb
        ok(createLex().isNoun("wash"));//"TODO:also false in processing -> nn" shoulbe be both Verb and Noun
        ok(createLex().isNoun("walk"));
        ok(createLex().isNoun("play"));
        ok(createLex().isNoun("throw"));
        ok(createLex().isNoun("drink"));//TODO:"also false in processing -> nn" shoulbe be both Verb and Noun
        ok(!createLex().isNoun("eat"));
        ok(!createLex().isNoun("chew"));

        //adj
        ok(!createLex().isNoun("hard"));
        ok(!createLex().isNoun("dry"));
        ok(!createLex().isNoun("furry"));
        ok(!createLex().isNoun("sad"));
        ok(!createLex().isNoun("happy"));
        ok(!createLex().isNoun("beautiful"));

        //n
        ok(createLex().isNoun("dogs"));
        ok(createLex().isNoun("wind"));
        ok(createLex().isNoun("dolls"));
        ok(createLex().isNoun("frogs"));
        ok(createLex().isNoun("ducks"));
        ok(createLex().isNoun("flowers"));
        ok(createLex().isNoun("fish"));
        ok(createLex().isNoun("wet")); //+v/adj

        //adv
        ok(!createLex().isNoun("truthfully"));
        ok(!createLex().isNoun("kindly"));
        ok(!createLex().isNoun("bravely"));
        ok(!createLex().isNoun("scarily"));
        ok(!createLex().isNoun("sleepily"));
        ok(!createLex().isNoun("excitedly"));
        ok(!createLex().isNoun("energetically"));

        ok(!createLex().isNoun(""));

        throws(function() {
			RiTa.SILENT=1;
            try {
                createLex().isNoun("banana split");

            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT=0;
        });
    });

    test("RiLexicon.isVerb()", function() {

        ok(createLex().isVerb("dance"));
        ok(createLex().isVerb("swim"));
        ok(createLex().isVerb("walk"));
        ok(!createLex().isVerb("walker"));
        ok(!createLex().isVerb("beautiful"));

        ok(createLex().isVerb("dancing"));
        ok(!createLex().isVerb("dancer"));

        //verb
        ok(createLex().isVerb("eat"));
        ok(createLex().isVerb("chew"));

        ok(createLex().isVerb("throw")); // +n 
        ok(createLex().isVerb("walk")); // +n 
        ok(createLex().isVerb("wash")); // +n 
        ok(createLex().isVerb("drink")); // +n 
        ok(createLex().isVerb("ducks")); // +n
        ok(createLex().isVerb("fish")); // +n
        ok(createLex().isVerb("dogs")); // +n
        ok(createLex().isVerb("wind")); // +n
        ok(createLex().isVerb("wet")); // +adj
        ok(createLex().isVerb("dry")); // +adj

        //adj
        ok(!createLex().isVerb("hard"));
        ok(!createLex().isVerb("furry"));
        ok(!createLex().isVerb("sad"));
        ok(!createLex().isVerb("happy"));

        //n
        ok(!createLex().isVerb("dolls"));
        ok(!createLex().isVerb("frogs"));
        ok(!createLex().isVerb("flowers"));

        //adv
        ok(!createLex().isVerb("truthfully"));
        ok(!createLex().isVerb("kindly"));
        ok(!createLex().isVerb("bravely"));
        ok(!createLex().isVerb("scarily"));
        ok(!createLex().isVerb("sleepily"));
        ok(!createLex().isVerb("excitedly"));
        ok(!createLex().isVerb("energetically"));

        throws(function() {
            RiTa.SILENT=1;
            try {
                createLex().isVerb("banana split");
            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT=0;

        });
    });


    test("RiLexicon.isAdjective()", function() {

        ok(!createLex().isAdjective("swim"));
        ok(!createLex().isAdjective("walk"));
        ok(!createLex().isAdjective("walker"));
        ok(createLex().isAdjective("beautiful"));
        ok(!createLex().isAdjective("dance"));
        ok(!createLex().isAdjective("dancing"));
        ok(!createLex().isAdjective("dancer"));

        //verb
        ok(!createLex().isAdjective("wash"));
        ok(!createLex().isAdjective("walk"));
        ok(!createLex().isAdjective("play"));
        ok(!createLex().isAdjective("throw"));
        ok(!createLex().isAdjective("drink"));
        ok(!createLex().isAdjective("eat"));
        ok(!createLex().isAdjective("chew"));

        //adj
        ok(createLex().isAdjective("hard"));
        ok(createLex().isAdjective("wet"));
        ok(createLex().isAdjective("dry"));
        ok(createLex().isAdjective("furry"));
        ok(createLex().isAdjective("sad"));
        ok(createLex().isAdjective("happy"));
        ok(createLex().isAdjective("kindly")); //+adv

        //n
        ok(!createLex().isAdjective("dogs"));
        ok(!createLex().isAdjective("wind"));
        ok(!createLex().isAdjective("dolls"));
        ok(!createLex().isAdjective("frogs"));
        ok(!createLex().isAdjective("ducks"));
        ok(!createLex().isAdjective("flowers"));
        ok(!createLex().isAdjective("fish"));

        //adv
        ok(!createLex().isAdjective("truthfully"));
        ok(!createLex().isAdjective("bravely"));
        ok(!createLex().isAdjective("scarily"));
        ok(!createLex().isAdjective("sleepily"));
        ok(!createLex().isAdjective("excitedly"));
        ok(!createLex().isAdjective("energetically"));


        throws(function() {
            RiTa.SILENT=1;

            try {
                createLex().isAdjective("banana split");

            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT=0;
            
        });
    });

    test("RiLexicon.isAlliteration()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex()

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

        var lex = createLex()

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

        var lex = createLex()

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

        var lex = createLex()
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

            var lex = createLex()
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

            var lex = createLex()

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

            var lex = createLex()
            var result = lex.similarBySoundAndLetter("try");
            var answer = [ "cry", "dry", "fry", "pry", "tray", "wry" ];
            deepEqual(result, answer);

            var lex = createLex()
            var result = lex.similarBySoundAndLetter("daddy");
            var answer = [ "dandy" ];
            deepEqual(result, answer);

            var lex = createLex()
            var result = lex.similarBySoundAndLetter("daddy", 1);
            deepEqual(result, answer);

            var lex = createLex()
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


            var lex = createLex()
            var result = lex.similarBySoundAndLetter("worngword");
            var answer = [ "wormwood" ];
            deepEqual(result, answer);

            var result = lex.similarBySoundAndLetter("");
            var answer = [];
            deepEqual(result, answer);
        });

    test("RiLexicon.substrings()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex() // only 1 per test needed

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


            var lex = createLex()
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

        var lex = createLex()
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

        var lex = createLex()
        var result = lex._getPosData("beautiful guy");
        deepEqual(result, "");


    });


    test("RiLexicon.isVowel()", function() {

        ok(!RiLexicon || typeof RiLexicon.data == 'undefined');

        var lex = createLex()

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

        var lex = createLex()

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

        var lex = createLex()

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

        var lex = createLex()

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

        var lex = createLex()

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

        var lex = createLex()

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

if (typeof exports != 'undefined') exports.unwrap = runtests;
