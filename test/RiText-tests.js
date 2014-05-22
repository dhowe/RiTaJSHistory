var runtests = function() {
  	
    QUnit.module("RiText", {
	    setup: function () {},
	    teardown: function () {}
	});

  // TODO: check that all these have tests...
  // TODO: fetch these from the JSON docs
  var statics = [
                   "createFont",
                   "createLetters",
                   "createWords",
                   "createLines",
                   "drawAll",
                   "dispose",
                   "disposeAll",
                   "defaultFill",
                   "defaultFont",
				   "defaultFontSize",
                   "randomColor",
                   "picked",
                   "timer",
                   "random",
                   "timer",
                   "pauseTimer",
                   "stopTimer",
    ];
  

    // TODO: check that all these have tests...
    // TODO: fetch these from the JSON docs
    var functions = [ 
                   "align",
                   "alpha",
                   "boundingBox",
                   "center",
                   "charOffset",
                   "copy",
                   "fill",           
                   "distanceTo",
                   "draw",               
                   "font",
                   "fontSize",
                   "motionType",
                   "position",
                   "rotate",
                   "scale",
                   "showBounds",
                   "splitLetters",
                   "splitWords",
                   "text",
                   "textHeight",
                   "textAscent",
                   "textDescent",
                   "textWidth",
                   "isVisible",
                   "wordOffset",
                   "fadeIn",
                   "fadeOut",
                   "moveTo",
                   "colorTo",
                   "rotateTo",
                   "scaleTo",
                   "stopBehavior",
                   "stopBehaviors",
                   "textTo"
    ];
  
    var RiString_functions = [
                  "analyze", 
                  "charAt", 
                  "concat", 
                  "containsWord", 
                  "endsWith", 
                  "equals", 
                  "equalsIgnoreCase", 
                  "get",
                  "features",
                  "indexOf",  
                  "lastIndexOf", 
                  "length", 
                  "match", 
                  "pos", 
                  "posAt", 
                  
                  "insertChar",
                  "removeChar", 
                  "replaceChar", 
                  
                  "replaceFirst", 
                  "replaceLast", 
                  "replaceAll", 
                  
                  "insertWord",
                  "removeWord",
                  "replaceWord",
                   
                  "slice", 
                  "split", 
                  "startsWith", 
                  "substring", 
                  "substr", 
                  "text",
                  //"toCharArray", 
                  "toLowerCase", 
                  "toUpperCase", 
                  "trim", 
                  "wordAt", 
                  "wordCount", 
                  "words" 
    ];
    
    test("RiText.functions", function() {

        for ( var i = 0; i < statics.length; i++) {
            equal(typeof RiText[statics[i]], 'function', statics[i]);
        }
        var rt = new RiText();
        for ( var i = 0; i < functions.length; i++) {
            equal(typeof rt[functions[i]], 'function', functions[i]);
        }
        for ( var i = 0; i < RiString_functions.length; i++) {
        	if (RiString_functions[i]=="split") continue; // ?
            equal(typeof rt[RiString_functions[i]], 'function', RiString_functions[i]);
        }

    });

    test("RiText()", function() {

        ok(new RiText("The dog was white"));

        ok(RiText("The dog was white"));
        
        ok(RiText(""));

        ok(RiText());
        ok(RiText(123));
        
        ok(RiText(" "));
        equal(RiText(" ").length(), 1);

	    ok(new RiText(RiString("The dog was white")));
        ok(RiText(RiString("The dog was white")));
        ok(RiText(new RiString("The dog was white")));
        ok(new RiText(new RiString("The dog was white")));
        
        ok(RiText(new RiString("")));
        ok(RiText(new RiString(123)));

        var BADS = [ null, undefined ]
        for ( var i = 0; i < BADS.length; i++) {
            throws(function() {

                try {
                    new RiText(BADS[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
            });
            throws(function() {

                try {
                    RiText(BADS[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
            });
        }

    });
    
	test("RiText(this)", function() {

        ok(new RiText(this, "The dog was white"));

        ok(RiText(this, "The dog was white"));

        ok(RiText(this, ""));

        ok(RiText(this));
        ok(RiText(this, 123));
        
        ok(RiText(this," "));
        equal(RiText(this," ").length(), 1);

        ok(new RiText(this, RiString("The dog was white")));
        ok(RiText(this, RiString("The dog was white")));
        ok(RiText(this, new RiString("The dog was white")));
        ok(new RiText(this, new RiString("The dog was white")));

        ok(RiText(this, RiString("")));

        ok(RiText(this, new RiString(123)));

        var BADS = [ null, undefined ]
        for ( var i = 0; i < BADS.length; i++) {
            throws(function() {

                try {
                    new RiText(this,BADS[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
            });
            throws(function() {

                try {
                    RiText(this,BADS[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
            });
        }

    });


    //--------------------------RiString Functions-----------------------------

    //---------------------------COPY FROM RISTRING TESTS

    test("RiText.analyze()", function() {

        var features = RiText("the laggin dragon").analyze().features();
        ok(features);
        equal(features.phonemes, "dh-ax l-ae-g-ih-n d-r-ae-g-ax-n");
        equal(features.syllables, "dh-ax l-ae/g-ih-n d-r-ae-g/ax-n");
        equal(features.stresses, "0 1/1 1/0");

        var features = RiText("123").analyze().features();
        ok(features);
        equal(features.phonemes, "w-ah-n-t-uw-th-r-iy");
        equal(features.syllables, "w-ah-n/t-uw/th-r-iy");
        equal(features.stresses, "0/0/0");

        var features = RiText("123").analyze().features();
        ok(features);
        equal(features.phonemes, "w-ah-n-t-uw-th-r-iy");
        equal(features.syllables, "w-ah-n/t-uw/th-r-iy");
        equal(features.stresses, "0/0/0");

        var features = RiText("1 2 7").analyze().features();
        ok(features);
        equal(features.phonemes, "w-ah-n t-uw s-eh-v-ax-n");
        equal(features.syllables, "w-ah-n t-uw s-eh/v-ax-n");
        equal(features.stresses, "0 0 1/0");
    });

    test("RiText.features()", function() {
    	
    	var rs = [ RiText("Returns the array of words."), RiText(this,"Returns the array of words.")];
    	for (var i=0; i < rs.length; i++) {

		    var features = rs[i].features();
		    //console.log(features);
		    ok(features);
		    ok(features.syllables);
		    ok(features.phonemes);
		    ok(features.stresses);
		    
		    //ok(features.mutable);
		    ok(features.tokens);
		    ok(features.text);
		    ok(features.pos);
	    }
	    
    });
    	
    test("RiText.charAt()", function() {

        var rs = [new RiText("The dog was white"),RiText("The dog was white")];
        
		for (var i=0; i < rs.length; i++) {
			var r = rs[i];
	        var result = r.charAt(0);
	        equal(result, "T");
	
	        var result = r.charAt(5);
	        notEqual(result, "O");
	
	        var result = r.charAt(5);
	        notEqual(result, '*');
	
	        var result = r.charAt(200); //out of range character
	        equal(result, "");
       }
    });
    
    test("RiText.concat()", function() { //TODO

        var rs = new RiText("The dog was white");
        var rs2 = new RiText("The dog was not white");
        var result = rs.concat(rs2);
        equal(result, "The dog was whiteThe dog was not white");

        var rs = new RiText(" The dog was white ");
        var rs2 = new RiText("The dog was not white ");
        var result = rs.concat(rs2);
        equal(result, " The dog was white The dog was not white ");

        var rs = new RiText("#$#@#$@#");
        var rs2 = new RiText("The dog was not white ");
        var result = rs.concat(rs2);
        equal(result, "#$#@#$@#The dog was not white ");

    });

    test("RiText.containsWord", function() {

        // check that these are ok --- ------------
        var rs = new RiText("The dog was white");

        ok(rs.containsWord("dog"));
        ok(rs.containsWord(""));
        ok(!rs.containsWord("*"));
        ok(!rs.containsWord("."));
        ok(!rs.containsWord("brown"));
    });

    test("RiText.endsWith()", function() {

        // check that these are ok --------------
        var rs = new RiText("girls");
        var result = rs.endsWith("s");
        ok(result);

        var rs = new RiText("closed");
        var result = rs.endsWith("ed");
        ok(result);

        var rs = new RiText("The dog was white");
        var result = rs.endsWith("white");
        ok(result);

        var rs = new RiText("");
        var result = rs.endsWith("");
        ok(result);

    });

    test("RiText.equals()", function() { // compare Object

        // check that these are ok ---------------
        var rs = new RiText("closed");
        var rs2 = new RiText("closed");
        var result = rs.equals(rs2);
        ok(result);

        var rs = new RiText("closed");
        var rs2 = new RiText("Closed");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiText("clOsed");
        var rs2 = new RiText("closed");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiText("There is a cat.");
        var rs2 = new RiText("There is a cat.");
        var result = rs.equals(rs2);
        ok(result);

        var rs = new RiText("There is a cat.");
        var rs2 = new RiText("There is a cat. ");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiText("There is a cat.");
        var rs2 = new RiText("There is a cat");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiText("There is a cat.");
        var rs2 = new RiText("");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiText("");
        var rs2 = new RiText("");
        var result = rs.equals(rs2);
        ok(result);
    });


    test("RiText.equalsIgnoreCase()", function() {

        // check that these are ok ---------------
        var rs = new RiText("closed");
        var result = rs.equalsIgnoreCase("Closed");
        ok(result);

        var rs = new RiText("There is a cat.");
        var result = rs.equalsIgnoreCase("TheRe Is a cAt.");
        ok(result);

        var rs = new RiText("THere iS a Cat.");
        var result = rs.equalsIgnoreCase("TheRe Is a cAt.");
        ok(result);

        var rs = new RiText("THere iS a Cat.");
        var rs2 = new RiText("THere iS a Cat.");
        var result = rs.equalsIgnoreCase(rs2);
        ok(result);

        var rs = new RiText("THere iS a Cat.");
        var rs2 = new RiText("THere iS not a Cat.");
        var result = rs.equalsIgnoreCase(rs2);
        ok(!result);

        var rs = new RiText("");
        var result = rs.equalsIgnoreCase("");
        ok(result);


    });

    /*
     * test("RiText.get()", function () {
     * 
     * var rs = RiText("The laggin dragon").analyze(); var ph = rs.get(RiTa.PHONEMES); var sy =
     * rs.get(RiTa.SYLLABLES); var st = rs.get(RiTa.STRESSES); equal(ph, "dh-ax l-ae-g-ih-n
     * d-r-ae-g-ax-n"); equal(sy, "dh-ax l-ae/g-ih-n d-r-ae-g/ax-n"); equal(st, "0 1/1 1/0");
     * });
     */


    test("RiText.indexOf()", function() {

        // check that these are ok ---------------
        var rs = new RiText("Returns the array of words.");
        var result = rs.indexOf("e");
        equal(result, 1);

        var rs = new RiText("Returns the array of words .");
        var result = rs.indexOf("a");
        equal(result, 12);

        var rs = new RiText("s ."); //space
        var result = rs.indexOf(" ");
        equal(result, 1);

        var rs = new RiText("s  ."); //double space
        var result = rs.indexOf("  ");
        equal(result, 1);

        var rs = new RiText(" abc"); //space
        var result = rs.indexOf(" ");
        equal(result, 0);

        var rs = new RiText("  abc"); //double space
        var result = rs.indexOf("  ");
        equal(result, 0);

        var rs = new RiText("   abc"); //tap space
        var result = rs.indexOf("   ");
        equal(result, 0);

        var rs = new RiText("Returns the array of words .");
        var result = rs.indexOf("array");
        equal(result, 12);

        var rs = new RiText("Returns the array of words.");
        var result = rs.indexOf(",");
        equal(result, -1);

        var rs = new RiText("Returns the array of words. Returns the array of words.");
        var result = rs.indexOf("a", 13);
        equal(result, 15);

        var rs = new RiText("Returns the array of words. Returns the array of words?");
        var result = rs.indexOf("array", 13);
        equal(result, 40);

        var rs = new RiText("Returns the array of words. Returns the array of words.");
        var result = rs.indexOf("");
        equal(result, 0);

    });

    test( "RiText.insertWord()", function() { 
    	
        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(4,"then");
        equal(rs.text(), "Inserts at wordIdx and then shifts each subsequent word accordingly.");

        var rs = new RiText("inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(0,"He");
        equal("He inserts at wordIdx and shifts each subsequent word accordingly.", rs.text());

        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(1,"newWord");
        var rs2 = new RiText(
            "Inserts newWord at wordIdx and shifts each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(1,"newWord and newWords");
        var rs2 = new RiText(
            "Inserts newWord and newWords at wordIdx and shifts each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(5,"");
        var rs2 = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(5," "); //space
        var rs2 = new RiText(
            "Inserts at wordIdx and shifts   each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

//console.log(rs.text()); return;

        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(5,"  "); //tab space
        var rs2 = new RiText(
            "Inserts at wordIdx and shifts    each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        // not sure what to do about this one, either it OR the next one will fail either way  
        /* TODO: reconsider */
        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(5,"**");
        var rs2 = new RiText(
            "Inserts at wordIdx and shifts ** each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiText("Inserts at wordIdx shifting each subsequent word accordingly.");
        rs.insertWord(3,",");
        var rs2 = new RiText("Inserts at wordIdx , shifting each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiText("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(-2, "newWord"); //error -- (no change to original string);
        equal("Inserts at wordIdx and shifts each subsequent word newWord accordingly.", rs.text());

	});

    test("RiText.lastIndexOf()", function() { //TODO revise

        // check that these are ok --- ------------
        var rs = new RiText("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("r");
        equal(result, 48);

        var rs = new RiText("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("Start");
        equal(result, 26);

        var rs = new RiText("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("start");
        equal(result, -1);

        var rs = new RiText("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("a", 12);
        equal(result, 6);

        var rs = new RiText("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("at", 12);
        equal(result, 6);

        var rs = new RiText("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("");
        equal(result, rs.length()); // should be 50 or -1? 50(DCH)
    });

    test("RiText.length()", function() {

        var rs = new RiText("S");
        var result = rs.length();
        equal(result, 1);

        var rs = new RiText("s "); //space
        var result = rs.length();
        equal(result, 2);

        var rs = new RiText("s" + '\t'); //tab space
        var result = rs.length();
        equal(result, 2);

        var rs = new RiText(" s "); //2 space
        var result = rs.length();
        equal(result, 3);

        var rs = new RiText('\t' + "s" + '\t'); // 2 tab space
        var result = rs.length();
        equal(result, 3);

        var rs = new RiText("s b");
        var result = rs.length();
        equal(result, 3);

        var rs = new RiText("s b.");
        var result = rs.length();
        equal(result, 4);

        var rs = new RiText("s b ."); //space
        var result = rs.length();
        equal(result, 5);

        var rs = new RiText("><><><#$!$@$@!$");
        var result = rs.length();
        equal(result, 15);

        var rs = new RiText("");
        var result = rs.length();
        equal(result, 0);

        // no error checks needed
    });


    test("RiText.match()", function() { //TODO

        var rs = new RiText("The rain in SPAIN stays mainly in the plain");
        var result = rs.match(/ain/g);
        deepEqual(result, [ "ain", "ain", "ain" ]);

        var rs = new RiText("The rain in SPAIN stays mainly in the plain");
        var result = rs.match(/ain/gi);
        deepEqual(result, [ "ain", "AIN", "ain", "ain" ]);

        var rs = new RiText("Watch out for the rock!");
        var result = rs.match(/r?or?/g);
        deepEqual(result, [ "o", "or", "ro" ]);

    });

    test("RiText.pos()", function() {

        // check that these are ok ---------------
        var txt = "The dog"; // tmp: move to RiTa.tests
        var words = RiTa.tokenize(txt);
        deepEqual(words, [ "The", "dog" ]);

        var words = RiTa.tokenize("closed"); // tmp: move to RiTa.tests 
        deepEqual(words, [ "closed" ]);

        var rs = new RiText("asdfaasd");
        var result = rs.pos();
        deepEqual(result, [ "nn" ]);

        var rs = new RiText("clothes");
        var result = rs.pos();
        deepEqual(result, [ "nns" ]);

        var rs = new RiText("There is a cat.");
        var result = rs.pos();
        deepEqual([ "ex", "vbz", "dt", "nn", "." ], result);

        var rs = new RiText("The boy, dressed in red, ate an apple.");
        var result = rs.pos();
        deepEqual([ "dt", "nn", ",", "vbn", "in", "jj", ",", "vbd", "dt", "nn", "." ], result);


    });

    test("RiText.posAt()", function() {

        // check that these are ok ---------------
        var rs = new RiText("The emperor had no clothes on.");
        var result = rs.posAt(4);
        equal("nns", result);

        var rs = new RiText("There is a cat.");
        var result = rs.posAt(3);
        equal("nn", result);
    });

    test("RiText.removeChar()", function() {

        var rs = new RiText("The dog was white");
        var result = rs.removeChar(1);
        equal(rs.text(), "Te dog was white");

        var rs = new RiText("The dog was white");
        var result = rs.removeChar(rs.length() - 1);
        equal(rs.text(), "The dog was whit");

        var rs = new RiText("The dog was white");
        var result = rs.removeChar(rs.length());
        equal(rs.text(), "The dog was white");

        var rs = new RiText("The dog was white");
        var result = rs.removeChar(0);
        equal(rs.text(), "he dog was white");

        var rs = new RiText("The dog was white");
        var result = rs.removeChar(-1);
        equal(rs.text(), "The dog was whit");

        var rs = new RiText("The dog was white");
        var result = rs.removeChar(1000);
        equal(rs.text(), "The dog was white");

        var rs = new RiText("The dog was white.");
        var result = rs.removeChar(rs.length() - 1);
        equal(rs.text(), "The dog was white");
    });

    test("RiText.replaceChar()", function() {

        var rs = new RiText("Who are you?");
        rs.replaceChar(2, "");
        equal(rs.text(), "Wh are you?");

        var rs = new RiText("Who are you?");
        rs.replaceChar(2, "e");
        equal(rs.text(), "Whe are you?");

        var rs = new RiText("Who are you?");
        rs.replaceChar(2, "ere");
        equal(rs.text(), "Where are you?");

        var rs = new RiText("Who are you?");
        rs.replaceChar(11, "!!");
        equal(rs.text(), "Who are you!!");

        var rs = new RiText("Who are you?");
        rs.replaceChar(0, "me");
        equal(rs.text(), "meho are you?");

        var rs = new RiText("Who are you?");
        rs.replaceChar(-1, "me");
        equal(rs.text(), "Who are youme");

        var rs = new RiText("Who are you?");
        rs.replaceChar(10000, "me");
        equal(rs.text(), "Who are you?");

    });

    test("RiText.replaceFirst()", function() {

        var rs = new RiText("Who are you?");
        rs.replaceFirst("e", "E");
        equal(rs.text(), "Who arE you?");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("o", "O");
        equal(rs.text(), "WhO are you?");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("Who", "Where");
        equal(rs.text(), "Where are you?");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("notExist", "Exist");
        equal(rs.text(), "Who are you?");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("Who are", "Dare");
        equal(rs.text(), "Dare you?");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("Who aRe", "Dare");
        equal(rs.text(), "Who are you?");

        var rs = new RiText("Who are you? Who are you?");
        rs.replaceFirst("Who are", "Dare");
        equal(rs.text(), "Dare you? Who are you?");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("?", "?!");
        equal(rs.text(), "Who are you?!");

        var rs = new RiText("Who are you?");
        rs.replaceFirst("", "");
        equal(rs.text(), "Who are you?");


    });


    test("RiText.replaceLast()", function() { //TODO

        var rs = new RiText("Who are you?");
        rs.replaceLast("e", "E");
        equal(rs.text(), "Who arE you?");

        var rs = new RiText("Who are you?");
        rs.replaceLast("o", "O");
        equal(rs.text(), "Who are yOu?");

        var rs = new RiText("Who are you?");
        rs.replaceLast("Who", "Where");
        equal(rs.text(), "Where are you?");

        var rs = new RiText("Who are you?");
        rs.replaceLast("notExist", "Exist");
        equal(rs.text(), "Who are you?");

        var rs = new RiText("Who are you?");
        rs.replaceLast("Who are", "Dare");
        equal(rs.text(), "Dare you?");

        var rs = new RiText("Who are you?");
        rs.replaceLast("Who aRe", "Dare");
        equal(rs.text(), "Who are you?");

        var rs = new RiText("Who are you? Who are you?");
        rs.replaceLast("Who are", "Dare");
        equal(rs.text(), "Who are you? Dare you?");

        var rs = new RiText("Who are you?");
        rs.replaceLast("?", "?!");
        equal(rs.text(), "Who are you?!");

        var rs = new RiText("Who are you?");
        rs.replaceLast("", "");
        equal(rs.text(), "Who are you?");

    });

    test("RiText.replaceAll()", function() {

        //replaceAll(regex, replacement);
        var rs = new RiText("Who are you? Who is he? Who is it?");
        equal(rs.replaceAll("e", "E").text(), "Who arE you? Who is hE? Who is it?");

        var rs = new RiText("Who are you? Who is he? Who is it?");
        equal(rs.replaceAll("Who", "O").text(), "O are you? O is he? O is it?");

        var rs = new RiText("Whom is he? Where is he? What is it?");
        equal(rs.replaceAll("Wh*", "O").text(), "Oom is he? Oere is he? Oat is it?");

        //   var rs = new RiText("Who are you? Who is he? Who is it?");
        //   equal(rs.replaceAll(rs, "Where is the text").text(), "Where is the text");

        //  var rs = new RiText("Who are you?");          
        //  equal(rs.replaceAll(rs, "Where are you!").text(), "Where are you!?");
        var rs = new RiText("%^&%&?");
        equal(rs.replaceAll("%^&%&?", "!!!").text(), "%^&%&?");

        var rs = new RiText("Who are you?");
        equal(rs.replaceAll("notExist", "Exist").text(), "Who are you?");

        var rs = new RiText("Who are you?");
        equal(rs.replaceAll("", "").text(), "Who are you?");

        var rs = new RiText("");
        equal(rs.replaceAll("", "").text(), "");

    });

    test("RiText.replaceWord()", function() {

        var rs = new RiText("Who are you?");
        equal("Who are What?", rs.replaceWord(2, "What").text());

        var rs = new RiText("Who are you?");
        equal(rs.replaceWord(0, "What").text(), "What are you?");

        var rs = new RiText("Who are you?");
        rs.replaceWord(3, "!!"); //
        equal(rs.text(), "Who are you!!"); // nice! this is a strange one...
        
        var rs = new RiText("Who are you?");
        rs.replaceWord(-1, "asfasf");
        equal("Who are you asfasf", rs.text());

        var rs = new RiText("Who are you?");
        rs.replaceWord(20, "asfasf");
        equal(rs.text(), "Who are you?");

    });

    test("RiText.slice()", function() { //very similar to substring

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(1, 3).text(), "he");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(-3, -2).text(), "f");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(15, 500).text(),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiText("!@#$%^&**()");
        equal(rs.slice(2, 5).text(), "#$%");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(15, 500).text(),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiText("The Australian");
        equal(rs.slice(-5, -3).text(), "al");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(500, 501).text(), "");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(10, 10).text(), "");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(3, 1).text(), "");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(-2, 3).text(), "");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(-2, -3).text(), "");


    });
/*
    test("RiText.split()", function() {

        var rs = new RiText("Who are you?");
        var result = rs.split();
        var answer = [ RiText("Who are you?") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split(" ");
        var answer = [ RiText("Who"), RiText("are"), RiText("you?") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("are");
        var answer = [ RiText("Who "), RiText(" you?") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("?");
        var answer = [ RiText("Who are you"), RiText("") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("W");
        var answer = [ RiText(""), RiText("ho are you?") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("abc");
        var answer = [ RiText("Who are you?") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("");
        var answer = [];
        var chars = [ "W", "h", "o", " ", "a", "r", "e", " ", "y", "o", "u", "?" ];
        for ( var i = 0; i < chars.length; i++) {
            answer[i] = RiText(chars[i]);
        }
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("", 3);
        var answer = [ RiText("W"), RiText("h"), RiText("o") ];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("", 0);
        var answer = [];
        deepEqual(result, answer);

        var rs = new RiText("Who are you?");
        var result = rs.split("", 100);
        var answer = [];
        var chars = [ "W", "h", "o", " ", "a", "r", "e", " ", "y", "o", "u", "?" ];
        for ( var i = 0; i < chars.length; i++) {
            answer[i] = RiText(chars[i]);
        }
        deepEqual(result, answer);

    });*/
   
    test(
        "RiText.startsWith()",
        function() {

            var rs = new RiText(
                "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith("T"));

            var rs = new RiText(
                "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith("The"));

            var rs = new RiText(
                "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(!rs.startsWith("Aus"));

            var rs = new RiText(
                "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(!rs.startsWith("*"));

            var rs = new RiText(
                "*The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith("*"));

            var rs = new RiText(
                " The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith(" ")); //single space
            var rs = new RiText(
                "  The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith("  ")); //double space
            var rs = new RiText(
                "   The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith("  ")); // tab space
            var rs = new RiText(
                "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
            ok(rs.startsWith("")); // fail here should not be true -- DCH: this is ok -- everything matches ""
        });

    test("RiText.substring()", function() {

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(1, 3).text(), "he");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(3, 1).text(), "he");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(-2, 3).text(), "The");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(15, 500).text(),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(500, 501).text(), "");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(10, 10).text(), "");

        var rs = new RiText("!@#$%^&**()");
        equal(rs.substring(2, 5).text(), "#$%");

        var rs = new RiText("Start at first character.");
        equal(rs.substring(1, 5).text(), "tart");

        var rs = new RiText("Start at first character.");
        equal(rs.substring(0, 1).text(), "S");

        var rs = new RiText("Start at first character.");
        equal(rs.substring(0, 1).text(), "S");

        var rs = new RiText("Start at first character.");
        equal(rs.substring(3).text(), "rt at first character.");

    });

    test("RiText.substr()", function() { // Duplicated with substring() and slice()?

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(1, 3).text(), "he ");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(-2, 3).text(), "t.");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(15, 500).text(),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(500, 501).text(), "");

        var rs = new RiText(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(10, 10).text(), "lian Pavil");

        var rs = new RiText("!@#$%^&**()");
        equal(rs.substr(2, 5).text(), "#$%^&");

    });


    test("RiText.text()", function() {

        // check that these are ok ---------------
        var rs = new RiText("this door is closed");
        var result = rs.text();
        equal(result, "this door is closed");

        var rs = new RiText("this door, is closed.*&)*^");
        var result = rs.text();
        equal(result, "this door, is closed.*&)*^");

        var rs = new RiText("   this door    , is closed.");
        var result = rs.text();
        equal(result, "   this door    , is closed.");

        var rs = new RiText("this Door is closed");
        var result = rs.text();
        notEqual(result, "this door is closed");

        var rs = new RiText("");
        var result = rs.text();
        equal(result, "");

        // no error checks needed ------------
    });

    /*test(
        "RiText.toCharArray()",
        function() {

            var rs = new RiText("The Australian Pavilion.");
            var result = rs.toCharArray();
            var answer = [ "T", "h", "e", " ", "A", "u", "s", "t", "r", "a", "l", "i", "a", "n", " ", "P", "a", "v", "i", "l", "i", "o", "n", "." ];
            deepEqual(result, answer);

            // no error checks needed ------------
    }); */

    test("RiText.toLowerCase()", function() {

        var rs = new RiText("The Australian Pavilion.");
        rs.toLowerCase();
        equal("the australian pavilion.", rs.text());

        var rs = new RiText("the Australian pavilion.");
        rs.toLowerCase();
        equal("the australian pavilion.", rs.text());

        var rs = new RiText(")(*(&^%%$!#$$%%^))");
        rs.toLowerCase();
        equal(")(*(&^%%$!#$$%%^))", rs.text());

        // no error checks needed
    });

    test("RiText.toUpperCase()", function() {

        var rs = new RiText("The Australian Pavilion.");
        equal("THE AUSTRALIAN PAVILION.", rs.toUpperCase().text());

        var rs = new RiText(")(*(&^%%$!#$$%%^))");
        rs.toUpperCase();
        equal(")(*(&^%%$!#$$%%^))", rs.text());

        // no error checks needed
    });

    test("RiText.trim()", function() {

        // check that these are ok ---------------
        var rs = new RiText("Start at first character. ");
        equal(rs.trim().text(), "Start at first character.");

        var rs = new RiText(" Start at first character.");
        equal(rs.trim().text(), "Start at first character.");

        var rs = new RiText("     Start at first character.   "); // tabs
        equal(rs.trim().text(), "Start at first character.");

        var rs = new RiText("     Start at first character.    "); // spaces/tabs
        equal(rs.trim().text(), "Start at first character.");

        //TODO: add tests for 'hard' tabs
        // no error checks needed
    });

    test("RiText.wordAt()", function() {

        // check that these are ok ---------------
        var rs = new RiText("Returns the word at wordIdx using the default WordTokenizer.");
        var result = rs.wordAt(0);
        equal(result, "Returns");

        var result = rs.wordAt(1);
        equal(result, "the");

        var result = rs.wordAt(9);
        equal(result, ".");

        var result = rs.wordAt(500);
        equal(result, "");

        var result = rs.wordAt(-5);
        equal(result, "");

        var rs = new RiText("");
        var result = rs.wordAt(0);
        equal(result, "");

    });

    test("RiText.wordCount()", function() {

        // check that these are ok --- ------------
        var rs = new RiText("Returns the word at wordIdx using the default WordTokenizer.");
        var result = rs.wordCount();
        equal(result, 10); // correct, according to WordTokenizer, need to try with RegexTokenizer
        var rs = new RiText("Returns the word.Returns the word. Returns the word .");
        var result = rs.wordCount();
        equal(result, 12);

        var rs = new RiText("   Returns the word at wordIdx , using the default WordTokenizer."); //space
        var result = rs.wordCount();
        equal(result, 11);

        var rs = new RiText("   Returns the word at wordIdx , using the default WordTokenizer.  "); //tab space
        var result = rs.wordCount();
        equal(result, 11);

        var rs = new RiText("");
        var result = rs.wordCount();
        equal(result, 0);

    });

    test("RiText.words()", function() {

        // check that these are ok ---------------
        var rs = new RiText("Returns the array of words.");
        var result = rs.words();
        var answer = [ "Returns", "the", "array", "of", "words", "." ];
        deepEqual(result, answer);

        var rs = new RiText("The boy, dressed in red, ate an array.");
        var result = rs.words();
        var answer = [ "The", "boy", ",", "dressed", "in", "red", ",", "ate", "an", "array", "." ];
        deepEqual(result, answer);

        var rs = new RiText("Returns the array of words .");
        var result = rs.words();
        var answer = [ "Returns", "the", "array", "of", "words", "." ];
        deepEqual(result, answer);

        var rs = new RiText("The boy, dressed in red , ate an array?");
        var result = rs.words();
        var answer = [ "The", "boy", ",", "dressed", "in", "red", ",", "ate", "an", "array", "?" ];
        deepEqual(result, answer);

        var rs = new RiText("");
        var result = rs.words();
        var answer = [ "" ];
        deepEqual(result, answer);

        // no error checks needed
    });



    //---------------------------END COPY FROM RISTRING TESTS


    test("RiText.copy()", function() { 
      var rt = new RiText(100,270,"hello");
      
      rt.fill(101,102,103,104);
      rt.showBounds(true);
      
      var rt2 = rt.copy();
      equal(rt.x,rt2.x);
      equal(rt.y,rt2.y);
      equal(rt.z,rt2.z);
      equal(rt.alpha(),rt2.alpha());
      equal(rt.text(),rt2.text());
      equal(rt.showBounds(),rt2.showBounds());

      deepEqual(rt.fill(),rt2.fill());

      // ...
      //
    });


    test("RiText.createFont()", function() { //TODO

        var result = RiText.createFont("Arial");
        ok(result);
        console.error("DO TEST! RiText.createFont()");
        ok(1, "Tested in specific renders");
    });

    test("RiText.createWords()", function() { //TODO

        var result = RiText.createWords();
        console.error("DO TEST! RiText.createWords()");
        ok(1, "Tested in specific renderers");
    });

    test("RiText.createLetters()", function() { //TODO

        var result = RiText.createLetters();
        console.error("DO TEST! RiText.createLetters()");
        ok(1, "Tested in specific renderers");
    });

    test("RiText.createLines()", function() { //TODO

        console.error("DO TEST! RiText.createLines()");
        ok(1, "Tested in specific renderers");
    });

    test("RiText.drawAll()", function() { //TODO

        var result = RiText.drawAll();
        console.error("DO TEST! RiText.drawAll()");
        ok(1, "Tested in specific renderers");
    });


}