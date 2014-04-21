var runtests = function() {
    
    QUnit.module("RiString", {
	    setup: function () {},
	    teardown: function () {}
	}); 
	
    var functions = [

        "analyze",
        "charAt",
        "concat",
        "copy",
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

        "replaceFirst",
        "replaceLast",
        "replaceAll",
        "insertChar",
        "removeChar",
        "replaceChar",
        "insertWord",
        "replaceWord",
        "removeWord",

        "slice",
        "split",
        "startsWith",
        "substring",
        "substr",
        "text",
        "toLowerCase",
        "toUpperCase",
        "trim",
        "wordAt",
        "wordCount",
        "words",
    ];

    test("RiString.functions", function() {

        var rs = new RiString("The dog was white");
        for ( var i = 0; i < functions.length; i++) {
            equal(typeof rs[functions[i]], 'function', functions[i]);
        }
    });

    test(
        "RiString._stringify",
        function() {

            var data = [ [ [ 2 ], [], [ 'ao' ], [ 'r' ] ], [ [ 0 ], [ 'g' ], [ 'ah' ], [] ], [ [ 0 ], [ 'n' ], [ 'ah' ], [] ], [ [ 1 ], [ 'z' ], [ 'ey' ], [] ], [ [ 0 ], [ 'sh' ], [ 'ah' ], [ 'n', 'z' ] ] ];
            var out = "ao2-r g-ah0 n-ah0 z-ey1 sh-ah0-n-z";
            equal(RiString._stringify(data), out);
        });

    test("RiString._syllabify(string)", function() {

        var test = "ao2-r-g-ah0-n-ah0-z-ey1-sh-ah0-n-z";
        var expected = "ao2-r g-ah0 n-ah0 z-ey1 sh-ah0-n-z";
        var result = RiString._syllabify(test);
        deepEqual(result, expected);
    });


    test("RiString._syllabify(array)", function() {

        var test = "ao2-r-g-ah0-n-ah0-z-ey1-sh-ah0-n-z".split('-');
        var expected = "ao2-r g-ah0 n-ah0 z-ey1 sh-ah0-n-z";
        var result = RiString._syllabify(test);
        deepEqual(result, expected);
    });

    test(
        "RiString._syllabify(batch1)",
        function() {

            var data = [ [ 'd-eh1-n-l-ih0-n-jh-er0', 'd-eh1-n l-ih0-n jh-er0' ], [ 'd-uw1-ah0-l', 'd-uw1 ah0-l' ], [ 'd-ih2-s-ah0-l-aw1-d', 'd-ih2 s-ah0 l-aw1-d' ], [ 'd-aa1-d-z', 'd-aa1-d-z' ], [ 'd-r-ao1-l-z', 'd-r-ao1-l-z' ], [ 'd-ay0-ae1-n-ah0', 'd-ay0 ae1 n-ah0' ], [ 'ey1-t-f-ow2-l-d', 'ey1-t f-ow2-l-d' ], [ 'eh1-m-t-iy0-d', 'eh1-m t-iy0-d' ], [ 'ih0-r-ey1-s', 'ih0 r-ey1-s' ], [ 'eh1-v-r-ah0-n', 'eh1-v r-ah0-n' ], [ 'f-ae1-l-k', 'f-ae1-l-k' ], [ 'f-eh1-n-w-ey2', 'f-eh1-n w-ey2' ], [ 'f-ih1-sh-k-ih2-l', 'f-ih1-sh k-ih2-l' ], [ 'f-ao1-r-b-ih0-d-ah0-n', 'f-ao1-r b-ih0 d-ah0-n' ], [ 'f-r-eh1-n-t-s', 'f-r-eh1-n-t-s' ], [ 'g-ae1-l-b-r-ey2-th', 'g-ae1-l b-r-ey2-th' ], [ 'zh-ih0-l-eh1-t', 'zh-ih0 l-eh1-t' ], [ 'jh-ih1-n-iy0', 'jh-ih1 n-iy0' ], [ 'g-aa0-n-z-aa1-l-ah0-z', 'g-aa0-n z-aa1 l-ah0-z' ], [ 'g-r-iy1-n-f-iy2-l-d', 'g-r-iy1-n f-iy2-l-d' ], [ 'g-ih0-t-aa1-r-z', 'g-ih0 t-aa1-r-z' ], [ 'hh-ae1-m-er0-ih0-ng', 'hh-ae1 m-er0 ih0-ng' ], [ 'hh-ae1-t-ih0-n-d-ao0-r-f', 'hh-ae1 t-ih0-n d-ao0-r-f' ], [ 'hh-eh1-m-ih0-ng-w-ey2', 'hh-eh1 m-ih0-ng w-ey2' ], [ 'hh-ih1-ng-k-m-ah0-n', 'hh-ih1-ng-k m-ah0-n' ], [ 'hh-ow1-n-eh0-k', 'hh-ow1 n-eh0-k' ], [ 'hh-ah1-l-d', 'hh-ah1-l-d' ], [ 'ih0-l-uw1-zh-ah0-n', 'ih0 l-uw1 zh-ah0-n' ], [ 'ih0-n-f-ae2-ch-uw0-ey1-sh-ah0-n', 'ih0-n f-ae2 ch-uw0 ey1 sh-ah0-n' ], [ 'ih0-n-t-er1-n-ah0-l-ay2-z', 'ih0-n t-er1 n-ah0 l-ay2-z' ], [ 'ih0-z-ae1-n-s-k-iy0-z', 'ih0 z-ae1-n s-k-iy0-z' ], [ 'jh-ow0-hh-ae1-n-ah0-s', 'jh-ow0 hh-ae1 n-ah0-s' ], [ 'k-ae1-r-ah0-m', 'k-ae1 r-ah0-m' ], [ 'k-aa1-k-iy0', 'k-aa1 k-iy0' ], [ 'n-ey1-v', 'n-ey1-v' ] ];
            for ( var i = 0, l = data.length; i < l; i++) {
                var res = RiString._syllabify(data[i][0]);
                equal(res, data[i][1]);
            }
        });


    test("RiString()", function() {

		// var str = "HELLO WORLD";
		// var n = str.slice(-1);
		// console.log("n="+n);
		// var n = str.charAt(str.length-1);
		// console.log("n="+n);

        ok(RiString('hello'));
        ok(new RiString('hello'));
        ok(RiString(''));
        ok(new RiString(''));
        ok(new RiString(64));
        ok(RiString(64));

        var BAD = [ null, undefined ];

        for ( var i = 0; i < BAD.length; i++) {

            throws(function() {

                try {
                    new RiString(BAD[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
            });
            throws(function() {

                try {
                    RiString(BAD[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
            });
        }
    });

    test("RiString.analyze()", function() {

      	var features = RiString("Mom & Dad, waiting for the car, ate a steak.").analyze().features();
        ok(features);
        equal(features.phonemes,  "m-aa-m ae-n-d d-ae-d , w-ey-t-ih-ng f-ao-r dh-ax k-aa-r , ey-t ey s-t-ey-k .");
        equal(features.syllables, "m-aa-m ae-n-d d-ae-d , w-ey-t/ih-ng f-ao-r dh-ax k-aa-r , ey-t ey s-t-ey-k .");
        equal(features.stresses,  "1 1 1 , 1/0 1 0 1 , 1 1 1 .");
        
		var numWords =  features.tokens.split(" ").length;
    	equal(numWords, features.stresses.split(" ").length);
    	equal(numWords, features.phonemes.split(" ").length);
    	equal(numWords, features.syllables.split(" ").length);
    	equal(numWords, features.pos.split(" ").length);
    	
    	var features = RiString("The dog ran faster than the other dog.  But the other dog was prettier.").analyze().features();
		ok(features);
        equal(features.phonemes,  "dh-ax d-ao-g r-ae-n f-ae-s-t-er dh-ae-n dh-ax ah-dh-er d-ao-g . b-ah-t dh-ax ah-dh-er d-ao-g w-aa-z p-r-ih-t-iy-er .");
        equal(features.syllables, "dh-ax d-ao-g r-ae-n f-ae-s/t-er dh-ae-n dh-ax ah-dh/er d-ao-g . b-ah-t dh-ax ah-dh/er d-ao-g w-aa-z p-r-ih-t/iy/er .");
        equal(features.stresses,  "0 1 1 1/0 1 0 1/0 1 . 1 0 1/0 1 1 1/0/0 .");
        
        var features = RiString("The laggin dragon").analyze().features();
        ok(features);
        equal(features.phonemes, "dh-ax l-ae-g-ih-n d-r-ae-g-ax-n");
        equal(features.syllables, "dh-ax l-ae/g-ih-n d-r-ae-g/ax-n");
        equal(features.stresses, "0 1/1 1/0");

        var features = RiString("123").analyze().features();
        ok(features);
        equal(features.phonemes, "w-ah-n-t-uw-th-r-iy");
        equal(features.syllables, "w-ah-n/t-uw/th-r-iy");
        equal(features.stresses, "0/0/0");

        var features = RiString(".").analyze().features();
        ok(features);
        equal(features.phonemes, ".");
        equal(features.syllables, ".");
        equal(features.stresses, ".");

        var features = RiString("123.").analyze().features();
        ok(features);
        equal(features.phonemes, "w-ah-n-t-uw-th-r-iy .");
        equal(features.syllables, "w-ah-n/t-uw/th-r-iy .");
        equal(features.stresses, "0/0/0 .");

        var features = RiString("1 2 7").analyze().features();
        ok(features);
        equal(features.phonemes, "w-ah-n t-uw s-eh-v-ax-n");
        equal(features.syllables, "w-ah-n t-uw s-eh/v-ax-n");
        equal(features.stresses, "0 0 1/0");

        var features = RiString("*").analyze().features();
        ok(features); 
        equal(features.phonemes, "*");
        equal(features.syllables, "*");
        equal(features.stresses, "*");
    });

    test("RiString.charAt()", function() {

        var rs = new RiString("The dog was white");

        var result = rs.charAt(0);
        equal(result, "T");

        var result = rs.charAt(5);
        notEqual(result, "O");

        var result = rs.charAt(5);
        notEqual(result, '*');

        var result = rs.charAt(200); //out of range character
        equal(result, "");
    });

    test("RiString.concat()", function() {

        var rs = new RiString("The dog was white");
        var rs2 = new RiString("The dog was not white");
        var result = rs.concat(rs2);
        equal(result, "The dog was whiteThe dog was not white");

        var rs = new RiString(" The dog was white ");
        var rs2 = new RiString("The dog was not white ");
        var result = rs.concat(rs2);
        equal(result, " The dog was white The dog was not white ");

        var rs = new RiString("#$#@#$@#");
        var rs2 = new RiString("The dog was not white ");
        var result = rs.concat(rs2);
        equal(result, "#$#@#$@#The dog was not white ");

    });

    test("RiString.copy()", function() {

      var rs = new RiString("copy cat");
      var rs2 = rs.copy();
      deepEqual(rs2, rs);

      rs = new RiString("copy dogs.");
      rs2 = rs.copy();
      deepEqual(rs, rs2);

      rs = new RiString("cOPy dOgs.");
      rs2 = rs.copy();
      deepEqual(rs, rs2);

      rs = new RiString("!@#$%^&*()_+");
      rs2 = rs.copy();
      deepEqual(rs, rs2);

      rs = new RiString("");
      rs2 = rs.copy();
      deepEqual(rs, rs2);

      rs = new RiString("!@#$sadas*()_+");
      rs2 = rs.copy();
      deepEqual(rs, rs2);
    });

    test("RiString.endsWith()", function() {

        // check that these are ok --------------

        var rs = new RiString("girls");
        var result = rs.endsWith("s");
        ok(result);

        var rs = new RiString("closed");
        var result = rs.endsWith("ed");
        ok(result);

        var rs = new RiString("The dog was white");
        var result = rs.endsWith("white");
        ok(result);

        var rs = new RiString("");
        var result = rs.endsWith("");
        ok(result);

    });

    test("RiString.equals()", function() { // compare Object

        // check that these are ok ---------------

        var rs = new RiString("closed");
        var rs2 = new RiString("closed");
        var result = rs.equals(rs2);
        ok(result);

        var rs = new RiString("closed");
        var rs2 = new RiString("Closed");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiString("clOsed");
        var rs2 = new RiString("closed");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiString("There is a cat.");
        var rs2 = new RiString("There is a cat.");
        var result = rs.equals(rs2);
        ok(result);

        var rs = new RiString("There is a cat.");
        var rs2 = new RiString("There is a cat. ");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiString("There is a cat.");
        var rs2 = new RiString("There is a cat");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiString("There is a cat.");
        var rs2 = new RiString("");
        var result = rs.equals(rs2);
        ok(!result);

        var rs = new RiString("");
        var rs2 = new RiString("");
        var result = rs.equals(rs2);
        ok(result);
        
        // ---------------

        var rs = new RiString("closed");
        var result = rs.equals("closed");
        ok(result);

        var rs = new RiString("closed");
        var result = rs.equals("Closed");
        ok(!result);

        var rs = new RiString("clOsed");
        var result = rs.equals("closed");
        ok(!result);

        var rs = new RiString("There is a cat.");
        var result = rs.equals("There is a cat.");
        ok(result);

        var rs = new RiString("There is a cat.");
        var result = rs.equals("There is a cat. ");
        ok(!result);

        var rs = new RiString("There is a cat.");
        var result = rs.equals("There is a cat");
        ok(!result);

        var rs = new RiString("There is a cat.");
        var result = rs.equals("");
        ok(!result);
    });

    test("RiString.equalsIgnoreCase()", function() {

        // check that these are ok ---------------

        var rs = new RiString("closed");
        var result = rs.equalsIgnoreCase("Closed");
        ok(result);

        var rs = new RiString("There is a cat.");
        var result = rs.equalsIgnoreCase("TheRe Is a cAt.");
        ok(result);

        var rs = new RiString("THere iS a Cat.");
        var result = rs.equalsIgnoreCase("TheRe Is a cAt.");
        ok(result);

        var rs = new RiString("THere iS a Cat.");
        var rs2 = new RiString("THere iS a Cat.");
        var result = rs.equalsIgnoreCase(rs2);
        ok(result);

        var rs = new RiString("THere iS a Cat.");
        var rs2 = new RiString("THere iS not a Cat.");
        var result = rs.equalsIgnoreCase(rs2);
        ok(!result);

        var rs = new RiString("");
        var result = rs.equalsIgnoreCase("");
        ok(result);
    });

    test("RiString.indexOf()", function() {

        // check that these are ok ---------------
        var rs = new RiString("Returns the array of words.");
        var result = rs.indexOf("e");
        equal(result, 1);

        var rs = new RiString("Returns the array of words .");
        var result = rs.indexOf("a");
        equal(result, 12);

        var rs = new RiString("s ."); //space
        var result = rs.indexOf(" ");
        equal(result, 1);

        var rs = new RiString("s  ."); //double space
        var result = rs.indexOf("  ");
        equal(result, 1);

        var rs = new RiString("s    ."); //tab space
        var result = rs.indexOf("   ");
        equal(result, 1);

        var rs = new RiString(" abc"); //space
        var result = rs.indexOf(" ");
        equal(result, 0);

        var rs = new RiString("  abc"); //double space
        var result = rs.indexOf("  ");
        equal(result, 0);

        var rs = new RiString(" abc"); //tab space
        var result = rs.indexOf("   ");
        equal(result, -1);

        var rs = new RiString("Returns the array of words .");
        var result = rs.indexOf("array");
        equal(result, 12);

        var rs = new RiString("Returns the array of words.");
        var result = rs.indexOf(",");
        equal(result, -1);

        var rs = new RiString("Returns the array of words. Returns the array of words.");
        var result = rs.indexOf("a", 13);
        equal(result, 15);

        var rs = new RiString("Returns the array of words. Returns the array of words?");
        var result = rs.indexOf("array", 13);
        equal(result, 40);

        var rs = new RiString("Returns the array of words. Returns the array of words.");
        var result = rs.indexOf("");
        equal(result, 0);

    });

    test("RiString.insertWord()",  function() { 
        	
        var rs = new RiString("Inserts at wordIdx and shifts each subsequent word accordingly.");
        var result = rs.insertWord(4, "then");
        equal(result.text(), "Inserts at wordIdx and then shifts each subsequent word accordingly.");

        var rs = new RiString("inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(0, "He");
        equal(rs.text(), "He inserts at wordIdx and shifts each subsequent word accordingly.");

        var rs = new RiString("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(1,"newWord");
        var rs2 = new RiString(
            "Inserts newWord at wordIdx and shifts each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiString("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(1,"newWord and newWords");
        var rs2 = new RiString(
            "Inserts newWord and newWords at wordIdx and shifts each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiString("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(5,"");
        
        var rs2 = "Inserts at wordIdx and shifts each subsequent word accordingly.";
        equal(rs.text(), rs2);

        var rs = new RiString("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(5,"**");
        equal(rs.text(), "Inserts at wordIdx and shifts ** each subsequent word accordingly.");

        var rs = new RiString("Inserts at wordIdx shifting each subsequent word accordingly.");
        rs.insertWord(3,",");
        var rs2 = new RiString(
            "Inserts at wordIdx , shifting each subsequent word accordingly.");
        equal(rs.text(), rs2.text());

        var rs = new RiString("Inserts at wordIdx and shifts each subsequent word accordingly.");
        rs.insertWord(-2,"newWord"); 
        equal(rs.text(), "Inserts at wordIdx and shifts each subsequent word newWord accordingly.");
		//console.log(rs.text()); return;
    });

    test("RiString.lastIndexOf()", function() {

        // check that these are ok --- ------------
        var rs = new RiString("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("r");
        equal(result, 48);

        var rs = new RiString("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("Start");
        equal(result, 26);

        var rs = new RiString("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("start");
        equal(result, -1);

        var rs = new RiString("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("a", 12);
        equal(result, 6);

        var rs = new RiString("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("at", 12);
        equal(result, 6);

        var rs = new RiString("Start at first character. Start at last character.");
        var result = rs.lastIndexOf("");
        equal(result, rs.length()); // should be 50 or -1? 50(DCH)

    });

    test("RiString.length()", function() {

        var rs = new RiString("S");
        var result = rs.length();
        equal(result, 1);

        var rs = new RiString("s "); //space
        var result = rs.length();
        equal(result, 2);

        var rs = new RiString("s" + '\t'); //tab space
        var result = rs.length();
        equal(result, 2);

        var rs = new RiString(" s "); //2 space
        var result = rs.length();
        equal(result, 3);

        var rs = new RiString('\t' + "s" + '\t'); // 2 tab space
        var result = rs.length();
        equal(result, 3);

        var rs = new RiString("s b");
        var result = rs.length();
        equal(result, 3);

        var rs = new RiString("s b.");
        var result = rs.length();
        equal(result, 4);

        var rs = new RiString("s b ."); //space
        var result = rs.length();
        equal(result, 5);

        var rs = new RiString("><><><#$!$@$@!$");
        var result = rs.length();
        equal(result, 15);

        var rs = new RiString("");
        var result = rs.length();
        equal(result, 0);
    });

    test("RiString.match()", function() {

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        var result = rs.match(/ain/g);
        deepEqual(result, [ "ain", "ain", "ain" ]);

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        var result = rs.match(/ain/gi);
        deepEqual(result, [ "ain", "AIN", "ain", "ain" ]);

        var rs = new RiString("Watch out for the rock!");
        var result = rs.match(/r?or?/g);
        deepEqual(result, [ "o", "or", "ro" ]);

        var rs = new RiString("abc!");
        var result = rs.match(/r?or?/g);
        deepEqual(result, []);

    });

    test("RiString.pos()", function() {

        // check that these are ok ---------------

        var txt = "The dog"; // tmp: move to RiTa.tests
        var words = RiTa.tokenize(txt);
        deepEqual(words, [ "The", "dog" ]);

        var words = RiTa.tokenize("closed"); // tmp: move to RiTa.tests
        deepEqual(words, [ "closed" ]);

        var rs = new RiString("asdfaasd");
        var result = rs.pos();
        deepEqual(result, [ "nn" ]);

        var rs = new RiString("clothes");
        var result = rs.pos();
        deepEqual(result, [ "nns" ]);

        var rs = new RiString("There is a cat.");
        var result = rs.pos();
        deepEqual([ "ex", "vbz", "dt", "nn", "." ], result);

        var rs = new RiString("The boy, dressed in red, ate an apple.");
        var result = rs.pos();
        deepEqual([ "dt", "nn", ",", "vbn", "in", "jj", ",", "vbd", "dt", "nn", "." ], result);

    });

    test("RiString.posAt()", function() {

        // check that these are ok ---------------

        var rs = new RiString("The emperor had no clothes on.");
        var result = rs.posAt(4);
        equal("nns", result);

        var rs = new RiString("There is a cat.");
        var result = rs.posAt(3);
        equal("nn", result);
    });

    test("RiString.removeChar()", function() {

        var rs = new RiString("The dog was white");
        rs.removeChar(1);
        equal(rs.text(), "Te dog was white");
        
     

        var rs = new RiString("The dog was white");
        rs.removeChar(rs.length() - 1);
        equal(rs.text(), "The dog was whit");

        var rs = new RiString("The dog was white");
        rs.removeChar(rs.length());
        equal(rs.text(), "The dog was white");

        var rs = new RiString("The dog was white");
        rs.removeChar(0);
        equal(rs.text(), "he dog was white");

        var rs = new RiString("The dog was white");
        rs.removeChar(-1);
        equal(rs.text(), "The dog was whit");
      
        var rs = new RiString("The dog was white");
        rs.removeChar(1000);
        equal(rs.text(), "The dog was white");

        var rs = new RiString("The dog was white.");
        rs.removeChar(rs.length() - 1);
        equal(rs.text(), "The dog was white");
    });

   test("RiString.insertChar()", function() {

        var rs = new RiString("Who are you?");
        rs.insertChar(2, "");
        equal(rs.text(), "Who are you?");

        var rs = new RiString("Who are you?");
        rs.insertChar(2, "e");
        equal(rs.text(), "Wheo are you?");

        var rs = new RiString("Who are you?");
        rs.insertChar(2, "ere");
        equal(rs.text(), "Whereo are you?");

        var rs = new RiString("Who are you?");
        rs.insertChar(11, "!!");
        equal(rs.text(), "Who are you!!?");

        var rs = new RiString("Who are you?");
        rs.insertChar(0, "me");
        equal(rs.text(), "meWho are you?");

        var rs = new RiString("Who?");
        rs.insertChar(rs.length()-1,"!");
        equal(rs.text(), "Who!?");
        
        var rs = new RiString("Who?");
        rs.insertChar(rs.length(),"!");
        equal(rs.text(), "Who?!");
        
        var rs = new RiString("Who are you");
        rs.insertChar(-1, "?");
        equal(rs.text(), "Who are yo?u");
    });


    test("RiString.replaceChar()", function() {

        var rs = new RiString("Who are you?");
        rs.replaceChar(2, "");
        equal(rs.text(), "Wh are you?");

        var rs = new RiString("Who are you?");
        rs.replaceChar(2, "e");
        equal(rs.text(), "Whe are you?");

        var rs = new RiString("Who are you?");
        rs.replaceChar(2, "ere");
        equal(rs.text(), "Where are you?");

        var rs = new RiString("Who are you?");
        rs.replaceChar(11, "!!");
        equal(rs.text(), "Who are you!!");

        var rs = new RiString("Who are you?");
        rs.replaceChar(0, "me");
        equal(rs.text(), "meho are you?");

        var rs = new RiString("Who are you?");
        rs.replaceChar(-1, "me");
        equal(rs.text(), "Who are youme");

        var rs = new RiString("Who are you?");
        rs.replaceChar(10000, "me");
        equal(rs.text(), "Who are you?");

    });

    test("RiString.replaceFirst()", function() {

        var rs = new RiString("Who are you?");
        rs.replaceFirst("e", "E");
        equal(rs.text(), "Who arE you?");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("o", "O");
        equal(rs.text(), "WhO are you?");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("Who", "Where");
        equal(rs.text(), "Where are you?");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("notExist", "Exist");
        equal(rs.text(), "Who are you?");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("Who are", "Dare");
        equal(rs.text(), "Dare you?");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("Who aRe", "Dare");
        equal(rs.text(), "Who are you?");

        var rs = new RiString("Who are you? Who are you?");
        rs.replaceFirst("Who are", "Dare");
        equal(rs.text(), "Dare you? Who are you?");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("", "");
        equal(rs.text(), "Who are you?");

        //regex

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        rs.replaceFirst(/ain/, "ane");
        equal(rs.text(), "The rane in SPAIN stays mainly in the plain");

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        rs.replaceFirst(/ain/i, "oll");
        equal(rs.text(), "The roll in SPAIN stays mainly in the plain");

        var rs = new RiString("Watch out for the rock!");
        rs.replaceFirst(/r?or?/, "a");
        equal(rs.text(), "Watch aut for the rock!");

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        rs.replaceFirst(/in/, "");
        equal(rs.text(), "The ra in SPAIN stays mainly in the plain");

        var rs = new RiString("Who are you?");
        rs.replaceFirst("?", "?!");
        equal(rs.text(), "Who are you?!");
    });

    test("RiString.replaceLast()", function() {

        var rs = new RiString("Who are you?");

        rs.replaceLast("e", "E");
        equal(rs.text(), "Who arE you?");

        var rs = new RiString("Who are you?");
        rs.replaceLast("o", "O");
        equal(rs.text(), "Who are yOu?");

        var rs = new RiString("Who are you?");
        rs.replaceLast("Who", "Where");
        equal(rs.text(), "Where are you?");

        var rs = new RiString("Who are you?");
        rs.replaceLast("notExist", "Exist");
        equal(rs.text(), "Who are you?");

        var rs = new RiString("Who are you?");
        rs.replaceLast("Who are", "Dare");
        equal(rs.text(), "Dare you?");

        var rs = new RiString("Who are you?");
        rs.replaceLast("Who aRe", "Dare");
        equal(rs.text(), "Who are you?");

        var rs = new RiString("Who are you? Who are you?");
        rs.replaceLast("Who are", "Dare");
        equal(rs.text(), "Who are you? Dare you?");

        var rs = new RiString("Who are you?");
        rs.replaceLast("", "");
        equal(rs.text(), "Who are you?");

        //regex

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        rs.replaceLast(/ain/, "ane");
        equal(rs.text(), "The rain in SPAIN stays mainly in the plane");

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        rs.replaceLast(/ain/i, "ane");
        equal(rs.text(), "The rain in SPAIN stays mainly in the plane");

        var rs = new RiString("Watch out for the rock!");
        rs.replaceLast(/ ?r/, "wood");
        equal(rs.text(), "Watch out for the woodock!");

        var rs = new RiString("The rain in SPAIN stays mainly in the plain");
        rs.replaceLast(/in/, "");
        equal(rs.text(), "The rain in SPAIN stays mainly in the pla");

        var rs = new RiString("Who wuz you?");
        rs.replaceLast("u?", "?!");
        equal(rs.text(), "Who wuz yo?!");

        var rs = new RiString("Who are you{1,}");
        rs.replaceLast("{1,}", "!");
        equal(rs.text(), "Who are you!");

        var rs = new RiString("Who are you*");
        rs.replaceLast("*", "!");
        equal(rs.text(), "Who are you!");

        var rs = new RiString("Who are you+");
        rs.replaceLast("+", "!");
        equal(rs.text(), "Who are you!");

        var rs = new RiString("Who are you?");
        rs.replaceLast("?", "?!");
        equal(rs.text(), "Who are you?!");
    });

    test("RiString.replaceAll()", function() {

        var rs = new RiString("Who are you? Who is he? Who is it?");
        equal(rs.replaceAll("e", "E").text(), "Who arE you? Who is hE? Who is it?");

        var rs = new RiString("Who are you? Who is he? Who is it?");
        equal(rs.replaceAll("Who", "O").text(), "O are you? O is he? O is it?");

        var rs = new RiString("Whom is he? Where is he? What is it?");
        equal(rs.replaceAll("Wh*", "O").text(), "Oom is he? Oere is he? Oat is it?");

        var rs = new RiString("%^&%&?");
        equal(rs.replaceAll("%^&%&?", "!!!").text(), "%^&%&?");

        var rs = new RiString("Who are you?");
        equal(rs.replaceAll("notExist", "Exist").text(), "Who are you?");

        var rs = new RiString("Who are you?");
        equal(rs.replaceAll("", "").text(), "Who are you?");

        var rs = new RiString("");
        equal(rs.replaceAll("", "").text(), "");

    });

    test("RiString.removeWord()", function() {
    	
    	
  		var rs = new RiString("Who are you?");
        rs.removeWord(2);
        equal(rs.text(), "Who are?"); 

//console.log(rs.text()); return;


        var rs = new RiString("Who are you?");
        rs.removeWord(3); 
        equal(rs.text(), "Who are you"); 

        var rs = new RiString("Who are you?");
        rs.removeWord(20);
        equal(rs.text(), "Who are you?");
        
        var rs = new RiString("Who are you?");
        equal(rs.removeWord(0).text(), "are you?");
        
        var rs = new RiString("Who are you?");
        rs.removeWord(-1);
        equal(rs.text(), "Who are you"); // TODO: should go from back
    });
 
     
    test("RiString.replaceWord()", function() {

        var rs = new RiString("Who are you?");
        rs.replaceWord(2, ""); // nice! this too...
        equal(rs.text(), "Who are?"); // strange case, not sure
        // could also be: equal(rs.text(), "Who are ?");


        var rs = new RiString("Who are you?");
        equal("Who are What?", rs.replaceWord(2, "What").text());
        

        var rs = new RiString("Who are you?");
        equal(rs.replaceWord(0, "What").text(), "What are you?");

        var rs = new RiString("Who are you?");
        rs.replaceWord(3, "!!"); 
        equal(rs.text(), "Who are you!!"); // nice! this is a strange one...

        var rs = new RiString("Who are you?");
        rs.replaceWord(-1, ".");
        equal(rs.text(), "Who are you.");

        var rs = new RiString("Who are you?");
        rs.replaceWord(20, "asfasf");
        equal(rs.text(), "Who are you?");
    });

    test("RiString.slice()", function() { //very similar to substring

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(1, 3), "he");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(-3, -2), "f");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(15, 500),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiString("!@#$%^&**()");
        equal(rs.slice(2, 5), "#$%");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(15, 500),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiString("The Australian");
        equal(rs.slice(-5, -3), "al");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(500, 501), "");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(10, 10), "");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(3, 1), "");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(-2, 3), "");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.slice(-2, -3), "");

    });

    test("RiString.split()", function() {
      
        var rs = new RiString("Who are you?");
        var result = rs.split("?");
        var answer = [ RiString("Who are you") ];
        deepEqual(result, answer);
        
        var rs = new RiString("Who are you?");
        var result = rs.split("\\?");
        var answer = [ RiString("Who are you?") ];
        deepEqual(result, answer);
        
        var rs = new RiString("Who are you?");
        var result = rs.split();
        var answer = [ RiString("Who are you?") ];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split(" ");
        var answer = [ RiString("Who"), RiString("are"), RiString("you?") ];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("are");        
        var answer = [ RiString("Who "), RiString(" you?") ];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("W");
//console.log(result);
        var answer = [ RiString("ho are you?") ];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("abc");
        var answer = [ RiString("Who are you?") ];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("");
        var answer = [];
        var chars = [ "W", "h", "o", " ", "a", "r", "e", " ", "y", "o", "u", "?" ];
        for ( var i = 0; i < chars.length; i++) {
            answer[i] = RiString(chars[i]);
        }
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("", 3);
        var answer = [ RiString("W"), RiString("h"), RiString("o") ];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("", 0);
        var answer = [];
        deepEqual(result, answer);

        var rs = new RiString("Who are you?");
        var result = rs.split("", 100);
        var answer = [];
        var chars = [ "W", "h", "o", " ", "a", "r", "e", " ", "y", "o", "u", "?" ];
        for ( var i = 0; i < chars.length; i++) {
            answer[i] = RiString(chars[i]);
        }
        deepEqual(result, answer);

    });

    test("RiString.startsWith()", function() {

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(rs.startsWith("T"));

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(rs.startsWith("The"));

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(!rs.startsWith("Aus"));

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(!rs.startsWith("*"));

        var rs = new RiString(
            "*The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(rs.startsWith("*"));

        var rs = new RiString(
            " The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(rs.startsWith(" ")); //single space

        var rs = new RiString(
            "  The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(rs.startsWith("  ")); //double space

        var rs = new RiString(
            " The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        ok(!rs.startsWith("  ")); // tab space
    });

    test("RiString.substring()", function() {

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(1, 3), "he");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(3, 1), "he");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(-2, 3), "The");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(15, 500),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(500, 501), "");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substring(10, 10), "");

        var rs = new RiString("!@#$%^&**()");
        equal(rs.substring(2, 5), "#$%");

        var rs = new RiString("Start at first character.");
        equal(rs.substring(1, 5), "tart");

        var rs = new RiString("Start at first character.");
        equal(rs.substring(0, 1), "S");

        var rs = new RiString("Start at first character.");
        equal(rs.substring(0, 1), "S");

        var rs = new RiString("Start at first character.");
        equal(rs.substring(3), "rt at first character.");

    });

    test("RiString.substr()", function() { // Duplicated with substring() and slice()?

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(1, 3), "he ");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(-2, 3), "t.");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(15, 500),
            "Pavilion at the Venice Biennale is getting a much-needed facelift.");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(500, 501), "");

        var rs = new RiString(
            "The Australian Pavilion at the Venice Biennale is getting a much-needed facelift.");
        equal(rs.substr(10, 10), "lian Pavil");

        var rs = new RiString("!@#$%^&**()");
        equal(rs.substr(2, 5), "#$%^&");

    });

    test("RiString.text()", function() {

        // check that these are ok ---------------
        var rs = new RiString("this door is closed");
        var result = rs.text();
        equal(result, "this door is closed");

        var rs = new RiString("this door, is closed.*&)*^");
        var result = rs.text();
        equal(result, "this door, is closed.*&)*^");

        var rs = new RiString("   this door    , is closed.");
        var result = rs.text();
        equal(result, "   this door    , is closed.");

        var rs = new RiString("this Door is closed");
        var result = rs.text();
        notEqual(result, "this door is closed");

        var rs = new RiString("");
        var result = rs.text();
        equal(result, "");

        // no error checks needed ------------

    });

    /*test(
        "RiString.toCharArray()",
        function() {

            var rs = new RiString("The Australian Pavilion.");
            var result = rs.toCharArray();
            var answer = [ "T", "h", "e", " ", "A", "u", "s", "t", "r", "a", "l", "i", "a", "n", " ", "P", "a", "v", "i", "l", "i", "o", "n", "." ];
            deepEqual(result, answer);

            // no error checks needed ------------
    }); */

    test("RiString.toLowerCase()", function() {

        var rs = new RiString("The Australian Pavilion.");
        rs.toLowerCase();
        equal("the australian pavilion.", rs.text());

        var rs = new RiString("the Australian pavilion.");
        rs.toLowerCase();
        equal("the australian pavilion.", rs.text());

        var rs = new RiString(")(*(&^%%$!#$$%%^))");
        rs.toLowerCase();
        equal(")(*(&^%%$!#$$%%^))", rs.text());

        // no error checks needed

    });

    test("RiString.toUpperCase()", function() {

        var rs = new RiString("The Australian Pavilion.");
        equal("THE AUSTRALIAN PAVILION.", rs.toUpperCase().text());

        var rs = new RiString(")(*(&^%%$!#$$%%^))");
        rs.toUpperCase();
        equal(")(*(&^%%$!#$$%%^))", rs.text());

        // no error checks needed
    });

    test("RiString.trim()", function() {

        // check that these are ok ---------------
        var rs = new RiString("Start at first character. ");
        equal(rs.trim().text(), "Start at first character.");

        var rs = new RiString(" Start at first character.");
        equal(rs.trim().text(), "Start at first character.");

        var rs = new RiString("     Start at first character.   "); // tabs
        equal(rs.trim().text(), "Start at first character.");

        var rs = new RiString("     Start at first character.    "); // spaces/tabs
        equal(rs.trim().text(), "Start at first character.");
    });

    test("RiString.wordAt()", function() {

        var rs = new RiString("Returns the word at wordIdx using the default WordTokenizer.");
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

        var rs = new RiString("");
        var result = rs.wordAt(0);
        equal(result, "");

    });

    test("RiString.wordCount()", function() {

        // check that these are ok --- ------------
        var rs = new RiString("Returns the word at wordIdx using the default WordTokenizer.");
        var result = rs.wordCount();
        equal(result, 10); // correct, according to WordTokenizer, need to try with RegexTokenizer

        var rs = new RiString("Returns the word.Returns the word. Returns the word .");
        var result = rs.wordCount();
        equal(result, 12);

        var rs = new RiString("   Returns the word at wordIdx , using the default WordTokenizer."); //space
        var result = rs.wordCount();
        equal(result, 11);

        var rs = new RiString(" Returns the word at wordIdx , using the default WordTokenizer.  "); //tab space
        var result = rs.wordCount();
        equal(result, 11);

        var rs = new RiString("");
        var result = rs.wordCount();
        equal(result, 0);

    });

    test("RiString.words()", function() {

        // check that these are ok ---------------
        var rs = new RiString("Returns the array of words.");
        var result = rs.words();
        var answer = [ "Returns", "the", "array", "of", "words", "." ];
        deepEqual(result, answer);

        var rs = new RiString("The boy, dressed in red, ate an array.");
        var result = rs.words();
        var answer = [ "The", "boy", ",", "dressed", "in", "red", ",", "ate", "an", "array", "." ];
        deepEqual(result, answer);

        var rs = new RiString("Returns the array of words .");
        var result = rs.words();
        var answer = [ "Returns", "the", "array", "of", "words", "." ];
        deepEqual(result, answer);

        var rs = new RiString("The boy, dressed in red , ate an array?");
        var result = rs.words();
        var answer = [ "The", "boy", ",", "dressed", "in", "red", ",", "ate", "an", "array", "?" ];
        deepEqual(result, answer);

        var rs = new RiString("");
        var result = rs.words();
        var answer = [ "" ];
        deepEqual(result, answer);

        // no error checks needed
    });

    test("RiString.get()", function() {

        var rs = RiString("The laggin dragon").analyze();
        var ph = rs.get(RiTa.PHONEMES);
        var sy = rs.get(RiTa.SYLLABLES);
        var st = rs.get(RiTa.STRESSES);
        equal(ph, "dh-ax l-ae-g-ih-n d-r-ae-g-ax-n");
        equal(sy, "dh-ax l-ae/g-ih-n d-r-ae-g/ax-n");
        equal(st, "0 1/1 1/0");
    });
    
	test("RiString.set()", function() {
		
      var rs = new RiString("Mom & Dad");
      rs.set("Id", "1000"); // TODO: test that this does not create default features
      
      equal(rs.get("Id"), "1000");
      ok(rs.get(RiTa.PHONEMES) != null);
      //console.log(rs.get(RiTa.PHONEMES));
      
      var features = rs.features();
      //console.log(features);

      ok(features[RiTa.PHONEMES] != null);
      
      rs.text("Dad & Mom"); // reset all original features, but not those set() by user
      
      equal(features[RiTa.PHONEMES], null); // OK: has been reset
      equal(rs.get("Id"), "1000");  // OK:  has not been reset
	});  

}

if (typeof exports != 'undefined')  runtests();
