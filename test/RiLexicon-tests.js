var runtests = function() {
    
 	function createLex() {
 		RiLexicon.data = undefined;
 		return new RiLexicon();
 	}
 	
    var lex, functions = [
    				 "addWord", 
                     "clear",
                     "containsWord", 
                     "alliterations", 
                     "lexicalData", 
                     "randomWord", 
                     "rhymes",
                     "words" ,
                     "isAdverb",
                     "isNoun",
                     "isVerb",
                     "isAdjective",
                     "isAlliteration", 
                     "isRhyme", 
                     "removeWord", 
                     "similarByLetter", 
                     "similarBySound", 
                     "similarBySoundAndLetter",
                     "size",
                     "substrings", 
                     "superstrings"];
	 
    test("RiLexicon[singleton]", function() {
		lex = RiLexicon();
        var lex2 = RiLexicon();
        ok(lex.data === lex2.data);
    });

    test("RiLexicon-functions", function() {

		lex = RiLexicon();

        for ( var i = 0; i < functions.length; i++) {

            equal(typeof lex[functions[i]], 'function', functions[i]);
        }

    });
    
  
    test("RiLexicon-lookups", function() {

    	lex = RiLexicon();

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

      	lex = RiLexicon();

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

    	lex = RiLexicon();

        var result = lex.addWord("bananana", "b-ax-n ae1-n ax ax", "nn");
        ok(lex.containsWord("bananana"));

        lex.addWord("hehehe", "hh-ee1 hh-ee1 hh-ee1", "uh");
        ok(lex.containsWord("hehehe"));

        equal(lex._getPhonemes("hehehe"), "hh-ee-hh-ee-hh-ee");

        lex.addWord("HAHAHA", "hh-aa1 hh-aa1 hh-aa1", "uh");
        ok(lex.containsWord("HAHAHA"));

        lex.addWord("HAHAHA", "hh-aa1 hh-aa1 hh-aa1", "uh");
        equal(lex._getPhonemes("HAHAHA"), "hh-aa-hh-aa-hh-aa");

        lex = createLex();
    });

    test("RiLexicon.clear()", function() {

    	lex = RiLexicon();
        ok(lex.containsWord("banana"));
        lex.removeWord("banana");

        ok(!lex.containsWord("banana"));

        lex.clear();
        ok(lex.size()<1);
        
        lex = createLex();

        ok(lex.containsWord("funny"));
        var result = lex.lexicalData();
        ok(Object.keys(result).length > 30000);

        var obj = {};
        obj["wonderfullyy"] = [ "w-ah1-n-d er-f ax-l iy", "rb" ];
        lex.lexicalData(obj);
        var result = lex.lexicalData();
        deepEqual(result, obj)
        
		lex = createLex();
    });

    test("RiLexicon.containsWord()", function() {


    	lex = RiLexicon();
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

    test("RiLexicon.alliterations()", function() {

    	lex = RiLexicon();
    	
        var result = lex.alliterations("cat");
        ok(result.length > 2000);

        var result = lex.alliterations("dog");
        ok(result.length > 1000);

        var result = lex.alliterations("URL");
        ok(result.length<1);

		var result = lex.alliterations("no stress");
		ok(result.length < 1);
		
		var result = lex.alliterations("#$%^&*");
		ok(result.length < 1);
		
		var result = lex.alliterations("");
		ok(result.length < 1); 

        // TODO: better tests
    });

    test("RiLexicon.alliterations(int)", function() {

		var lex = RiLexicon();

		var result = lex.alliterations("dog", 15);
		ok(result.length == 3);

		var result = lex.alliterations("cat", 16);
		//for (var i = 0; i < result.length; i++)
			//console.log(i + ") " + result[i]);
		ok(result.length == 7);  // TODO: check this

    });

    test("RiLexicon.lexicalData()", function() {

    	lex = RiLexicon();
        
        var result = lex.lexicalData();
        ok(Object.keys(result).length > 1000);

        var re = lex.lexicalData();
        var result = re.a;
        var answer = [ "ey1", "dt" ];

        deepEqual(result, answer);

        var re = lex.lexicalData();
        var result = re.the;
        var answer = [ "dh-ax", "dt" ];

        deepEqual(result, answer);
        
        var obj = {};
        obj["wonderfully"] = [ "w-ah1-n-d er-f ax-l iy", "rb" ];
        var result = lex.lexicalData(obj);
        deepEqual(result.lexicalData(), obj);

        var obj = {};
        obj["wonderfullyy"] = [ "w-ah1-n-d er-f ax-l iy-y", "rb" ];
        var result = lex.lexicalData(obj);
        deepEqual(result.lexicalData().wonderfullyy, [ "w-ah1-n-d er-f ax-l iy-y", "rb" ]);

        lex = createLex();
    });

    test("RiLexicon.randomWord(1)", function() { 

	    lex = RiLexicon();
        //randomWord();, randomWord(targetLength);, randomWord(pos);, randomWord(pos, targetLength);

        var result = lex.randomWord();
        ok(result.length > 0, "randomWord: " + result);

        var result = lex.randomWord("nn");
        ok(result.length > 0, "randomWord nn: " + result);

        var result = lex.randomWord("nns");
        ok(result.length > 0, "randomWord nns: " + result);

        var result = lex.randomWord(3);
        ok(result.length > 0, "3 syllableCount: " + result);

        var result = lex.randomWord(5);
        ok(result.length > 0, "5 syllableCount: " + result);

        var result = lex.randomWord("nns", 3);
        ok(result.length > 0, "3 syllableCount + nns: " + result);
    });

    test("RiLexicon.randomWord(2)", function() { 

	    lex = RiLexicon();
        var pos = ["nn","nns","jj","jjr","wp"];
        for (var j = 0; j < pos.length; j++)
        {
          for (var i = 0; i < 5; i++)
          {
            var result = lex.randomWord(pos[j]);
            var best = lex._getBestPos(result);
            //console.log(result+": "+pos[j]+" ?= "+best);
            equal(pos[j],best,result);
          }
        }
    });

    test("RiLexicon.randomWord(3)", function() { 

	    lex = RiLexicon();
        for (var i = 0; i < 10; i++)
        {
          var result = lex.randomWord(3);
          var syllables = RiTa.getSyllables(result);
          var num = syllables.split(RiTa.SYLLABLE_BOUNDARY).length;
          ok(result.length > 0);
          ok(num==3,result+": "+syllables);// "3 syllableCount: "
        }
    });

    test("RiLexicon.randomWord(4)", function() { 

	    lex = RiLexicon();
        for (var i = 0; i < 10; i++)
        {
          var result = lex.randomWord(5);
          var syllables = RiTa.getSyllables(result);
          var num = syllables.split(RiTa.SYLLABLE_BOUNDARY).length;
          ok(result.length > 0);// "3 syllableCount: "
          ok(num==5);// "3 syllableCount: "
        }

        // TODO: more tests with both count and pos
    });


    test("RiLexicon.rhymes()", function() {
    	
	    lex = RiLexicon();
        result = lex.rhymes("apple");
        var answer = [ "chapel", "grapple", "pineapple" ];
        deepEqual(result, answer);
        
        /* result = lex.rhymes("savage");
        var answer = [ "average", "ravage", "cabbage" ];
        deepEqual(result, answer); WHY DOES THIS FAIL? */

        result = lex.rhymes("apple.");
        var answer = [];
        deepEqual(result, answer);

        result = lex.rhymes("bible");
        var answer = [ "libel", "tribal" ];
        deepEqual(result, answer);

        var result = lex.rhymes("goxgle");
        var answer = [];
        deepEqual(result, answer);

        var result = lex.rhymes("google");
        var answer = ['bugle','frugal'];
        deepEqual(result, answer);

        result = lex.rhymes("happens in here");
        var answer = [];
        deepEqual(result, answer);

        result = lex.rhymes("");
        var answer = [];
        deepEqual(result, answer);


    });

    test("RiLexicon.words()", function() {

	    lex = RiLexicon();
	    
        var result = lex.words();
        ok(result.length > 1000);

        var result2 = lex.words(false);
        var result1 = lex.words(true);
        ok(result1.length > 1000);
        ok(result2.length > 1000);
        notDeepEqual(result1, result2);

        var result = lex.words("colou*r");
        ok(result.length > 5);

        var result = lex.words("[^A-M]in");
        ok(result.length > 5);

        var result1 = lex.words("colou*r", true);
         ok(result1.length > 5);

        var result2 = lex.words(true, "colou*r");
        ok(result2.length > 5);

        deepEqual(result1, result2);
    });

    test("RiLexicon.isAdverb()", function() {
	    lex = RiLexicon();

        ok(!lex.isAdverb("swim"));
        ok(!lex.isAdverb("walk"));
        ok(!lex.isAdverb("walker"));
        ok(!lex.isAdverb("beautiful"));
        ok(!lex.isAdverb("dance"));
        ok(!lex.isAdverb("dancing"));
        ok(!lex.isAdverb("dancer"));

        //verb
        ok(!lex.isAdverb("wash"));
        ok(!lex.isAdverb("walk"));
        ok(!lex.isAdverb("play"));
        ok(!lex.isAdverb("throw"));
        ok(!lex.isAdverb("drink"));
        ok(!lex.isAdverb("eat"));
        ok(!lex.isAdverb("chew"));

        //adj
        ok(!lex.isAdverb("wet"));
        ok(!lex.isAdverb("dry"));
        ok(!lex.isAdverb("furry"));
        ok(!lex.isAdverb("sad"));
        ok(!lex.isAdverb("happy"));

        //n
        ok(!lex.isAdverb("dogs"));
        ok(!lex.isAdverb("wind"));
        ok(!lex.isAdverb("dolls"));
        ok(!lex.isAdverb("frogs"));
        ok(!lex.isAdverb("ducks"));
        ok(!lex.isAdverb("flowers"));
        ok(!lex.isAdverb("fish"));

        //adv
        ok(lex.isAdverb("truthfully"));
        ok(lex.isAdverb("kindly"));
        ok(lex.isAdverb("bravely"));
        ok(lex.isAdverb("doggedly"));
        ok(lex.isAdverb("sleepily"));
        ok(lex.isAdverb("excitedly"));
        ok(lex.isAdverb("energetically"));
        ok(lex.isAdverb("hard")); // +adj

        ok(!lex.isAdverb(""));

        throws(function() {
            RiTa.SILENT=1;
            try {
                lex.isAdverb("banana split");
                ok(!"failed");
            }
            catch (e) {
                throw e;
            }
			RiTa.SILENT = 0;
        });
    });
    
    test("RiLexicon.isNoun()", function() {
	    lex = RiLexicon();

        ok(lex.isNoun("swim"));
        ok(lex.isNoun("walk"));
        ok(lex.isNoun("walker"));
        ok(lex.isNoun("dance"));
        ok(lex.isNoun("dancing"));
        ok(lex.isNoun("dancer"));

        //verb
        ok(lex.isNoun("wash"));//"TODO:also false in processing -> nn" shoulbe be both Verb and Noun
        ok(lex.isNoun("walk"));
        ok(lex.isNoun("play"));
        ok(lex.isNoun("throw"));
        ok(lex.isNoun("drink"));//TODO:"also false in processing -> nn" shoulbe be both Verb and Noun
        ok(!lex.isNoun("eat"));
        ok(!lex.isNoun("chew"));

        //adj
        ok(!lex.isNoun("hard"));
        ok(!lex.isNoun("dry"));
        ok(!lex.isNoun("furry"));
        ok(!lex.isNoun("sad"));
        ok(!lex.isNoun("happy"));
        ok(!lex.isNoun("beautiful"));

        //n
        ok(lex.isNoun("dogs"));
        ok(lex.isNoun("wind"));
        ok(lex.isNoun("dolls"));
        ok(lex.isNoun("frogs"));
        ok(lex.isNoun("ducks"));
        ok(lex.isNoun("flowers"));
        ok(lex.isNoun("fish"));
        ok(lex.isNoun("wet")); //+v/adj

        //adv
        ok(!lex.isNoun("truthfully"));
        ok(!lex.isNoun("kindly"));
        ok(!lex.isNoun("bravely"));
        ok(!lex.isNoun("scarily"));
        ok(!lex.isNoun("sleepily"));
        ok(!lex.isNoun("excitedly"));
        ok(!lex.isNoun("energetically"));

        ok(!lex.isNoun(""));

        throws(function() {
			RiTa.SILENT=1;
            try {
                lex.isNoun("banana split");

            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT=0;
        });
    });

    test("RiLexicon.isVerb()", function() {
	    lex = RiLexicon();

        ok(lex.isVerb("dance"));
        ok(lex.isVerb("swim"));
        ok(lex.isVerb("walk"));
        ok(!lex.isVerb("walker"));
        ok(!lex.isVerb("beautiful"));

        ok(lex.isVerb("dancing"));
        ok(!lex.isVerb("dancer"));

        //verb
        ok(lex.isVerb("eat"));
        ok(lex.isVerb("chew"));

        ok(lex.isVerb("throw")); // +n 
        ok(lex.isVerb("walk")); // +n 
        ok(lex.isVerb("wash")); // +n 
        ok(lex.isVerb("drink")); // +n 
        ok(lex.isVerb("ducks")); // +n
        ok(lex.isVerb("fish")); // +n
        ok(lex.isVerb("dogs")); // +n
        ok(lex.isVerb("wind")); // +n
        ok(lex.isVerb("wet")); // +adj
        ok(lex.isVerb("dry")); // +adj

        //adj
        ok(!lex.isVerb("hard"));
        ok(!lex.isVerb("furry"));
        ok(!lex.isVerb("sad"));
        ok(!lex.isVerb("happy"));

        //n
        ok(!lex.isVerb("dolls"));
        ok(!lex.isVerb("frogs"));
        ok(!lex.isVerb("flowers"));

        //adv
        ok(!lex.isVerb("truthfully"));
        ok(!lex.isVerb("kindly"));
        ok(!lex.isVerb("bravely"));
        ok(!lex.isVerb("scarily"));
        ok(!lex.isVerb("sleepily"));
        ok(!lex.isVerb("excitedly"));
        ok(!lex.isVerb("energetically"));

        throws(function() {
            RiTa.SILENT=1;
            try {
                lex.isVerb("banana split");
            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT=0;

        });
    });


    test("RiLexicon.isAdjective()", function() {
	    lex = RiLexicon();

        ok(!lex.isAdjective("swim"));
        ok(!lex.isAdjective("walk"));
        ok(!lex.isAdjective("walker"));
        ok(lex.isAdjective("beautiful"));
        ok(!lex.isAdjective("dance"));
        ok(!lex.isAdjective("dancing"));
        ok(!lex.isAdjective("dancer"));

        //verb
        ok(!lex.isAdjective("wash"));
        ok(!lex.isAdjective("walk"));
        ok(!lex.isAdjective("play"));
        ok(!lex.isAdjective("throw"));
        ok(!lex.isAdjective("drink"));
        ok(!lex.isAdjective("eat"));
        ok(!lex.isAdjective("chew"));

        //adj
        ok(lex.isAdjective("hard"));
        ok(lex.isAdjective("wet"));
        ok(lex.isAdjective("dry"));
        ok(lex.isAdjective("furry"));
        ok(lex.isAdjective("sad"));
        ok(lex.isAdjective("happy"));
        ok(lex.isAdjective("kindly")); //+adv

        //n
        ok(!lex.isAdjective("dogs"));
        ok(!lex.isAdjective("wind"));
        ok(!lex.isAdjective("dolls"));
        ok(!lex.isAdjective("frogs"));
        ok(!lex.isAdjective("ducks"));
        ok(!lex.isAdjective("flowers"));
        ok(!lex.isAdjective("fish"));

        //adv
        ok(!lex.isAdjective("truthfully"));
        ok(!lex.isAdjective("bravely"));
        ok(!lex.isAdjective("scarily"));
        ok(!lex.isAdjective("sleepily"));
        ok(!lex.isAdjective("excitedly"));
        ok(!lex.isAdjective("energetically"));


        throws(function() {
            RiTa.SILENT=1;

            try {
                lex.isAdjective("banana split");

            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT=0;
            
        });
    });

    test("RiLexicon.isAlliteration()", function() {

	    lex = RiLexicon();

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
	    lex = RiLexicon();
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

	    lex = RiLexicon();

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
        
        lex = createLex();
    });


    // TODO: clear() failing may be killing this test ()???)
    test("RiLexicon.similarByLetter()",  function() {
    	
        lex = RiLexicon();

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

        var result = lex.similarByLetter("123");
        ok(result.length > 400);

        var result = lex.similarByLetter("");
        var answer = [];
        deepEqual(result, answer);
    });

    test("RiLexicon.similarBySound()", function() {

        lex = RiLexicon();

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

    test("RiLexicon.similarBySoundAndLetter()", function() {

        lex = RiLexicon();

        var result = lex.similarBySoundAndLetter("try");
        var answer = [ "cry", "dry", "fry", "pry", "tray", "wry" ];
        deepEqual(result, answer);

        var result = lex.similarBySoundAndLetter("daddy");
        var answer = [ "dandy" ];
        deepEqual(result, answer);

        var result = lex.similarBySoundAndLetter("banana");
        var answer = [ "bonanza" ];
        deepEqual(result, answer);

        var result = lex.similarBySoundAndLetter("tornado");
        var answer = [ "torpedo" ];
        deepEqual(result, answer);

        //var lex = createLex();
        var result = lex.similarBySoundAndLetter("worngword");
        var answer = [ "wormwood" ];
        deepEqual(result, answer);

        var result = lex.similarBySoundAndLetter("");
        var answer = [];
        deepEqual(result, answer);
    });

    test("RiLexicon.substrings()", function() {

        lex = RiLexicon();

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

    test("RiLexicon.superstrings()", function() {

	        lex = RiLexicon();

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


        lex = RiLexicon();

        var result = lex._getPosData("box");
        deepEqual(result, "nn vb");

        var result = lex._getPosData("there");
        deepEqual(result, "ex rb uh");

        var result = lex._getPosData("is");
        deepEqual(result, "vbz rb nns vbp");

        var result = lex._getPosData("a");
        deepEqual(result, "dt");

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

        lex = RiLexicon();


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


        lex = RiLexicon();


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

        ok(!lex._isConsonant("3"));

    });

    test("RiLexicon.lookupRaw()", function() { 


        lex = RiLexicon();

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
    
	//For RiTa.getPhonemes() NOT IN RiTa-Java

    test("RiLexicon.getPhonemes()", function() {


        lex = RiLexicon();


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

    //For RiTa.getStresses() NOT IN RiTa-Java

    test("RiLexicon.getStresses()", function() {

        lex = RiLexicon();

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

    //For RiTa.getSyllables() NOT IN RiTa-Java

    test("RiLexicon.getSyllables()", function() {
    	
        lex = RiLexicon();

        var result = lex._getSyllables("The emperor had no clothes on.");
        var answer = "dh-ax eh-m-p/er/er hh-ae-d n-ow k-l-ow-dh-z aa-n";
        equal(result, answer);

        var result = lex._getSyllables("@#$%*()");
        var answer = "";
        equal(result, answer);

        var result = lex._getSyllables("");
        var answer = "";
        equal(result, answer);
    });

}

if (typeof exports != 'undefined')  runtests();
