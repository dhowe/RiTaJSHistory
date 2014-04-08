
var runtests = function() {
    
    var SILENT = true;
    
    QUnit.module("RiGrammar", {
	    setup: function () {},
	    teardown: function () {}
	}); 

    var functions = [ "addRule", "expand", "expandFrom", "expandWith", "getGrammar", "hasRule", "print", "removeRule", "reset", "load", "loadFrom", "ready" ];

    var sentenceGrammar = { "<start>" : "<noun_phrase> <verb_phrase>.", "<noun_phrase>" : "<determiner> <noun>", "<verb_phrase>" : "<verb> | <verb> <noun_phrase> [.1]", "<determiner>" : "a [.1] | the", "<noun>" : "woman | man", "<verb>" : "shoots" }

	var sentenceGrammar2 = {
	    "<start>": "<noun_phrase> <verb_phrase>.",
	    "<noun_phrase>": "<determiner> <noun>",
	    "<determiner>": [
	        "a [.1]",
	        "the"
	    ],
	    "<verb_phrase>": [
	        "<verb> <noun_phrase> [.1]",
	        "<verb>"
	    ],
	    "<noun>": [
	        "woman",
	        "man"
	    ],
	    "<verb>": "shoots"
	};

    test("RiGrammar.functions", function() {

        var rg = new RiGrammar();
        for ( var i = 0; i < functions.length; i++) 
            equal(typeof rg[functions[i]], 'function', functions[i]);
    });

    test("RiGrammar.init", function() {
  
        var rg = RiGrammar();
        ok(rg._rules); // empty
        ok(typeof rg._rules['<start>'] === 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] === 'undefined');

        var rg1 = RiGrammar(sentenceGrammar);
        ok(rg1._rules);
        ok(rg1._rules['<start>']);
        ok(rg1._rules['<noun_phrase>']);

        var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
        ok(rg2._rules);
        ok(rg2._rules['<start>']);
        ok(rg2._rules['<noun_phrase>']);
        
        var rg3= RiGrammar(sentenceGrammar2);
        ok(rg3._rules);
        ok(rg3._rules['<start>']);
        ok(rg3._rules['<noun_phrase>']);

        deepEqual(rg1, rg2);
        deepEqual(rg2, rg3);
        deepEqual(rg1, rg3);

		var BAD = ["{a : 1}", "hello"];
		for (var i = 0; i < BAD.length; i++) {
			throws(function() {

				try {
					RiGrammar(BAD[i]);
					fail("no exception");
				} 
				catch (e) {
					throw e;
				}
			});
		}
    });


    test("RiGrammar.addRule", function() {

        var rg = new RiGrammar();
        rg.addRule("<start>", "<pet>");
        ok(rg._rules["<start>"]);
        ok(rg.hasRule("<start>"));
        rg.addRule("<start>", "<dog>", .3);
        ok(rg._rules["<start>"]);
        ok(rg.hasRule("<start>"));
    });
 	 
    test("RiGrammar.expand()", function() {

        var s, rg = new RiGrammar();

        rg.addRule("<start>", "pet");
        equal(s=rg.expand(), "pet");
        
		//console.log(s);

        rg.reset();
        rg.addRule("<start>", "<pet>").addRule("<pet>", "dog");
        equal(s=rg.expand(), "dog");
        
        rg.reset();
	    rg.addRule("<start>", "the <pet> ran.");
	    rg.addRule("<pet>", "dog");
	    s = rg.expand();
	    equal(s, "the dog ran.");

        rg.reset();
        rg.addRule("<start>", "<rule1>");
        rg.addRule("<rule1>", "cat", .4);
        rg.addRule("<rule1>", "dog", .6);
        rg.addRule("<rule1>", "boy", .2);
        
		ok(rg.hasRule("<rule1>"));

        var found1 = false, found2 = false, found3 = false;
        for ( var i = 0; i < 20; i++) {
            var res = rg.expand();
            ok(res === "cat" || res === 'dog' || res === 'boy');
            if (res === "cat")
                found1 = true;
            else if (res === "dog")
                found2 = true;
            else if (res === "boy") 
            	found3 = true;
        }
        
        ok(found1);
        ok(found2);
        ok(found3);
        
        var fail = false;
        for ( var i = 0; i < 20; i++) {
            var res = rg.expand()
            if (!res) fail = true;
        }
        ok(!fail);

        rg.reset();
        rg.addRule("<start>", "pet");
        equal(rg.expand(), "pet");

	    rg.reset();
	    rg.addRule("<start>", "the <pet> ran.", 1);
	    rg.addRule("<pet>", "dog", .7);
	    for (var i = 0; i < 10; i++)
	      equal(rg.expand(), "the dog ran.");
	      
	        rg.reset();
        rg.addRule("<start>", "the <pet>.");
        rg.addRule("<pet>", "dog", .7);
        rg.addRule("<pet>", "cat", .3);

        var d = 0, g = 0;
        for ( var i = 0; i < 100; i++) {
            var r = rg.expand();
            if (r == 'the dog.') d++;
            if (r == 'the cat.') g++;
        }
        
        // delta=20%
        ok(d > 50 && d < 100, d + "%  (dog =~ 70%)");
        ok(d < 90 && d > 0,   d + "% (dog =~ 70%)");
        ok(g > 10 && g < 100, g + "% (cat =~ 30%)");
        ok(g < 50 && g > 0,   g + "% (cat =~ 30%)");
    });

    test("RiGrammar.expandFrom", function() {

        var rg = new RiGrammar();

        rg.reset();
        rg.addRule("<start>", "<pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow");
        rg.addRule("<mammal>", "dog");

        equal(rg.expandFrom("<mammal>"), "dog");

        for ( var i = 0; i < 100; i++) {
            var res = rg.expandFrom("<bird>");
            ok(res === "hawk" || res === 'crow');
        }
        
		throws(function() {
			try {
				rg.expandFrom("wrongName")
			} catch (e) {
				throw e;
			}
		}); 

    });

    test("RiGrammar.expandFrom(Weighted)", function() {

        var rg = new RiGrammar();

        rg.reset();
        rg.addRule("<start>", "<pet>");
        rg.addRule("<pet>", "<bird> [9] | <mammal>");
        rg.addRule("<bird>", "hawk");
        rg.addRule("<mammal>", "dog [2]");

        equal(rg.expandFrom("<mammal>"), "dog");

        var hawks=0,dogs=0;
        for ( var i = 0; i < 100; i++) {
            var res = rg.expandFrom("<pet>");
            ok(res === "hawk" || res === 'dog');
            if (res=="dog") dogs++;
            if (res=="hawk") hawks++;
        }
        ok(hawks > dogs*2);
    });
         
	test("RiGrammar.getGrammar", function() {
		
		var rg = new RiGrammar(sentenceGrammar);
		var rg2 = new RiGrammar(sentenceGrammar2);
		deepEqual(rg,rg2)
		
		var e = "<start>\n  '<noun_phrase> <verb_phrase>.' [1]\n<noun_phrase>\n  '<determiner> <noun>' [1]\n<verb_phrase>\n  '<verb>' [1]\n  '<verb> <noun_phrase>' [.1]\n<determiner>\n  'a' [.1]\n  'the' [1]\n<noun>\n  'woman' [1]\n  'man' [1]\n<verb>\n  'shoots' [1]";
		equal(rg.getGrammar(),e);
	});
        
   test("RiGrammar.hasRule", function() {

        var g = [ new RiGrammar(sentenceGrammar), new RiGrammar(sentenceGrammar2) ];

	    for (var i = 0; i < g.length; i++) {
	    	
			var rg = g[i];
	        ok(rg.hasRule("<start>"));
	        ok(!rg.hasRule("start"));
	
	        rg.reset();
	        ok(!rg.hasRule("start"));
	        rg.addRule("<rule1>", "<pet>");
	        ok(rg.hasRule("<rule1>"));
	        ok(!rg.hasRule("rule1"));
	
	        rg.reset();
	
	        rg.addRule("<rule1>", "cat", .4);
	        rg.addRule("<rule1>", "dog", .6);
	        rg.addRule("<rule1>", "boy", .2);
	        ok(rg.hasRule("<rule1>"));
	        ok(!rg.hasRule("rule1"));

	        ok(!rg.hasRule("badname"));
	
	        rg.reset();
	
	        rg.addRule("rule1", "<pet>");
	        ok(!rg.hasRule("<rule1>"));
	        ok(rg.hasRule("rule1"));
	
	        ok(!rg.hasRule(null));
	        ok(!rg.hasRule(undefined));
	        ok(!rg.hasRule(1));
		}
    });


    test("RiGrammar.reset", function() {

        var rg = new RiGrammar();
        ok(rg._rules);
        rg.load(JSON.stringify(sentenceGrammar));
        rg.reset();
        deepEqual(rg._rules, {});
        deepEqual(rg, RiGrammar());
    });

    test("RiGrammar.load", function() {

        var rg = new RiGrammar();
        ok(rg._rules);
        ok(typeof rg._rules['<start>'] === 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] === 'undefined');

        rg.load(JSON.stringify(sentenceGrammar));
        ok(rg._rules);
        ok(typeof rg._rules['<start>'] !== 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] !== 'undefined');
        
        rg.load(JSON.stringify(sentenceGrammar2));
        ok(rg._rules);
        ok(typeof rg._rules['<start>'] !== 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] !== 'undefined');
    });
    
    asyncTest("RiGrammar.loadFrom(Url)", function() {
    	
    	if (RiTa.env() == RiTa.NODE) {
    		ok("Not for Node");
    		start();
    		return;
    	}
    	
    	var grammar = new RiGrammar();
    	grammar.loadFrom("http://localhost/testfiles/haiku.json");
    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (grammar.ready()) { 
    			ok(grammar);
    			start();
    			clearInterval(id);
    		}
    		else {
    			
     			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
    });
   
	asyncTest("RiGrammar.loadFrom(file)", function() {
    	
    	var rg1 = new RiGrammar();
    	rg1.loadFrom("../data/sentence1.json");
		var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
		var rg3 = RiGrammar(JSON.stringify(sentenceGrammar2));
		    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (rg1.ready()) { 
    			deepEqual(rg1, rg2);
	        	deepEqual(rg2, rg3);
	        	ok(rg1);
    			start();
    			clearInterval(id);
    		}
    		else {
 
     			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
    });       
    asyncTest("RiGrammar.loadFrom2(file)", function() {
    	
    	var rg1 = new RiGrammar();
    	rg1.loadFrom("../data/sentence2.json");
		var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
		var rg3 = RiGrammar(JSON.stringify(sentenceGrammar2));
		    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (rg1.ready()) { 
    			deepEqual(rg1, rg2);
	        	deepEqual(rg2, rg3);
    			start();
    			clearInterval(id);
    		}
    		else {

    			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
    });

    test("RiGrammar.removeRule", function() {

        var rg1 = new RiGrammar(sentenceGrammar);

        ok(rg1._rules['<start>']);
        ok(rg1._rules['<noun_phrase>']);

        rg1.removeRule('<noun_phrase>');
        ok(!rg1._rules['<noun_phrase>']);

        rg1.removeRule('<start>');
        ok(!rg1._rules['<start>']);

        rg1.removeRule('');
        rg1.removeRule('bad-name');
        rg1.removeRule(null);
        rg1.removeRule(undefined);
        
		rg1 = new RiGrammar(sentenceGrammar2);

        ok(rg1._rules['<start>']);
        ok(rg1._rules['<noun_phrase>']);

        rg1.removeRule('<noun_phrase>');
        ok(!rg1._rules['<noun_phrase>']);

        rg1.removeRule('<start>');
        ok(!rg1._rules['<start>']);

        rg1.removeRule('');
        rg1.removeRule('bad-name');
        rg1.removeRule(null);
        rg1.removeRule(undefined);
    });

    test("RiGrammar.print", function() {

        var rg = new RiGrammar();
        rg.addRule("<start>", "<first> | <second>");
        rg.addRule("<first>", "the <pet> <action> were `adj()`");
        rg.addRule("<second>", "the <action> of the `adj()` <pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow");
        rg.addRule("<mammal>", "dog");
        rg.addRule("<action>", "cries | screams | falls");
        ok(typeof rg.print === 'function'); // TODO: how to test?
        //rg.print();
    });

    test("RiGrammar.expandWith", function() {

        var rg = new RiGrammar();
        rg.addRule("<start>", "the <pet> | the <action> of the <pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow | screamer");
        rg.addRule("<mammal>", "dog");
        rg.addRule("<action>", "cries | screams | falls");

        var r = rg.expandWith("screams", "<action>");

        var str = "", missed = false;
        for ( var i = 0; i < 100; i++) {
            var r = rg.expandWith("screams", "<action>");
            if (r.indexOf("screams") < 1) {
                str = r;
                // console.log("error: " + r);
                missed = true;
            }
        }
        equal(missed, false);

        str = "", missed = false;
        for ( var i = 0; i < 100; i++) {
            var r = rg.expandWith("dog", "<pet>");
            if (r.indexOf("dog") < 1) {
                str = r;
                // console.log("error: " + r);
                missed = true;
            }
        }
        equal(missed, false);


        //equal("TODO: MORE TESTS HERE");
    });
    
      
	test("RiGrammar.specialChars", function() {

	    var rg, res, s
	    
	    s = "{ \"<start>\": \"hello &#124; name\" }";
	    rg = new RiGrammar(s);
	    res = rg.expand();
	    //console.log(res); 
	    ok(res==="hello | name");

	    s = "{ \"<start>\": \"hello: name\" }";
	    rg = new RiGrammar(s);
	    res = rg.expand();
	    ok(res==="hello: name");
	
	    s = "{ \"<start>\": \"&#8220;hello!&#8221;\" }";
	    rg = new RiGrammar(s);
	    //rule = rg.getRule("<start>");
	    //ok(rule==="&#8220;hello!&#8221;");
	    //ok("fails b/c of editor?");
	    //res = rg.expand();
	    //console.log(res+'=“hello!”');
	    // ok(res==='“hello!”'); // fails bc of editor
	
	    s = "{ \"<start>\": \"&lt;start&gt;\" }";
	    rg = new RiGrammar(s);
	    res = rg.expand();
	    //console.log(res);
	    ok(res==="<start>");
	    
	    s = "{ \"<start>\": \"I don&#96;t want it.\" }";
	    rg = new RiGrammar(s);
	    res = rg.expand();
		//console.log(res);
	    ok(res==="I don`t want it.");
	    
	    s = "{ \"<start>\": \"&#39;I really don&#39;t&#39;\" }";
	    rg = new RiGrammar(s);
	    res = rg.expand();
	    ok(res==="'I really don't'");

	    s = "{ \"<start>\": \"hello | name\" }";
	    rg = new RiGrammar(s);
	    for (var i = 0; i < 10; i++)
	    {
	      res = rg.expand();
	      ok(res==="hello" || res==="name");
	    }
	
	});
	
	test("RiGrammar.execIgnore", function() {
    
	    var rg = new RiGrammar(); // do nothing
	    rg.execDisabled = false;
	    
	    rg.addRule("<start>", "<first> | <second>");
	    rg.addRule("<first>", "the <pet> <action> were 'adj()'");
	    rg.addRule("<second>", "the <action> of the 'adj()' <pet>");
	    rg.addRule("<pet>", "<bird> | <mammal>");
	    rg.addRule("<bird>", "hawk | crow");
	    rg.addRule("<mammal>", "dog");
	    rg.addRule("<action>", "cries | screams | falls");
	
	    for ( var i = 0; i < 10; i++) {
	        var res = rg.expand();
	        //console.log(i+") "+res);
	        ok(res!=null && res.length>0);
	        ok(res.indexOf("'adj()'")>-1);
	    }
	  
	    rg.reset();
	    
	    rg.addRule("<start>", "<first> | <second>");
	    rg.addRule("<first>", "the <pet> <action> were `adj()'");
	    rg.addRule("<second>", "the <action> of the `adj()' <pet>");
	    rg.addRule("<pet>", "<bird> | <mammal>");
	    rg.addRule("<bird>", "hawk | crow");
	    rg.addRule("<mammal>", "dog");
	    rg.addRule("<action>", "cries | screams | falls");
	
	    for ( var i = 0; i < 10; i++) {
	        var res = rg.expand();
	        //console.log(i+") "+res);
	        ok(res!=null && res.length>0);
	        ok(res.indexOf("`adj()'")>-1);
	    }
	    
	  
	    rg.reset();
	    
	    rg.addRule("<start>", "<first> | <second>");
	    rg.addRule("<first>", "the <pet> <action> were `nofun()`");
	    rg.addRule("<second>", "the <action> of the `nofun()` <pet>");
	    rg.addRule("<pet>", "<bird> | <mammal>");
	    rg.addRule("<bird>", "hawk | crow");
	    rg.addRule("<mammal>", "dog");
	    rg.addRule("<action>", "cries | screams | falls");
	
	    var tmp = RiTa.SILENT;
	    RiTa.SILENT = true;
	    for (var i = 0; i < 5; i++) {
	        var res = rg.expand();
	        //console.log(i+") "+res);
	        ok(res!=null && res.length>0 && res.indexOf("`nofun()`")>-1);
	    }
	
	    for ( var i = 0; i < 5; i++) {
	        var res = rg.expand(this);
	        //console.log(i+") "+res);
	        ok(res!=null && res.length>0 && res.indexOf("`nofun()`")>-1);
	    }
	    
	    RiTa.SILENT = tmp;
	});
        
	test("RiGrammar.execRE", function() {

    	var str,res,re = RiGrammar.EXEC_PATT;
    	
    	str = "`hello()`";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["","`hello()`",""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "`hello(and)`";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["","`hello(and)`",""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "`hello('and')`";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["","`hello('and')`",""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = '`hello("and")`';
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["",'`hello("and")`',""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "and `hello()` there";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["and ","`hello()`"," there"]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "and `hello()` there `you()`";   
    	res = re.exec(str);
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["and ","`hello()`"," there `you()`"]);
    	
		if (!SILENT) console.log("===========================");

    	str = "and `hello()`";   
    	res = re.exec(str);
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["and ","`hello()`", ""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "`hello()` there `you()`";   
    	res = re.exec(str);
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["", "`hello()`"," there `you()`"]);
    	
		if (!SILENT) console.log("===========================");

    	str = "`hello();`";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["","`hello();`",""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "`hello(and);`";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["","`hello(and);`",""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "`hello('and');`";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["","`hello('and');`",""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = '`hello("and");`';
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["",'`hello("and");`',""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "and `hello();` there";
    	res = re.exec(str);
    	
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["and ","`hello();`"," there"]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "and `hello();` there `you();`";   
    	res = re.exec(str);
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["and ","`hello();`"," there `you();`"]);
    	
		if (!SILENT) console.log("===========================");

    	str = "and `hello();`";   
    	res = re.exec(str);
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["and ","`hello();`", ""]);
    	
    	if (!SILENT) console.log("===========================");
    	
    	str = "`hello();` there `you();`";   
    	res = re.exec(str);
    	for ( var i = 0; i < res.length; i++) 
			if (!SILENT) console.log("'"+res[i]+"'");
		res.splice(0,1);
    	deepEqual(res, ["", "`hello();`"," there `you();`"]);
    	
    });
    
    test("RiGrammar.exec1", function() {
  
		var rg = new RiGrammar();
		rg.execDisabled = false;
		ok(rg); 

		if (typeof module == 'undefined') { // for node-issue #9

	        rg.addRule("<start>", "<first> | <second>");
	        rg.addRule("<first>", "the <pet> <action> were `temp()`");
	        rg.addRule("<second>", "the <action> of the `temp()` <pet>");
	        rg.addRule("<pet>", "<bird> | <mammal>");
	        rg.addRule("<bird>", "hawk | crow");
	        rg.addRule("<mammal>", "dog");
	        rg.addRule("<action>", "cries | screams | falls");
	
	        for ( var i = 0; i < 10; i++) {
	        	
	        	// TODO: fails in NODE  ??
	        	// The "this" value passed to eval must be the global object from which eval originated ?
	        	
	            var res = rg.expand();
	            //console.log(res);
	            ok(res && !res.match("`") && res.match(/(hot|cold)/));
	        }
	    }
    });
        
	var newruleg = { '<start>' : 'The <noun> chased the `newrule("<noun>")`.', '<noun>' : 'dog | cat | mouse', '<verb>' : 'rhino'  };
     
    // TODO: fails in NODE/phantomJS ?
	test("RiGrammar.exec2", function() {
	
		var rg = new RiGrammar(newruleg);
		rg.execDisabled = false;
		ok(rg); 

		if (typeof module == 'undefined') { // for node-issue #9

	        for ( var i = 0; i < 10; i++) {
	            var res = rg.expand();
	        	ok(res && res.match(/ chased the rhino\./g));
	        }
	    }
	});
	
	test("RiGrammar.execArgs", function() { 

		var rg = new RiGrammar(newruleg);
		rg.execDisabled = false;
		ok(rg); 

		if (typeof module == 'undefined') { // for node-issue #9
			
			rg.addRule("<start>", "`getFloat()`");
			for (var i = 0; i < 10; i++) {
			
			  var res = rg.expandFrom("<start>", this);
			  ok(res && res.length && parseFloat(res));
			}
			
			rg.reset();
			rg.addRule("<start>", "`adj(2)`");
			for (var i = 0; i < 10; i++) {
	
				var res = rg.expandFrom("<start>", this);
				ok(res && res.length && res==="number");
			}
	
			rg.reset();
			rg.addRule("<start>", "`adj(true)`");
			for (var i = 0; i < 10; i++) {
	
				var res = rg.expandFrom("<start>", this);
				//System.out.println(i + ")" + res);
				ok(res==="boolean");
			}
		}

	});
}

// callback methods...

function temp() { return Math.random() < .5 ? 'hot' : 'cold'; }

function _type(obj) { return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase(); }

function getFloat() { return Math.random(); }

function adj(o) { return (_type(o)==='boolean') ? "boolean" : "number"; }

function newrule(word) { return "<verb>"; }

function dump(obj) {

    var properties = "";
    for ( var propertyName in obj) {

        properties += propertyName + ": ";

        // Check if its NOT a function
        if (!(obj[propertyName] instanceof Function)) {
            properties += obj.propertyName;
        }
        else {
            properties += "function()";
        }
        properties += ", ";
    }
    return properties;
}

if (typeof exports != 'undefined') runtests(); //exports.unwrap = runtests;
