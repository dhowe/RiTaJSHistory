
var runtests = function() {
    
    QUnit.module("RiGrammar", {
	    setup: function () {},
	    teardown: function () {}
	}); 

    var functions = [ "addRule", "expand", "expandFrom", "expandWith", "getGrammar", "hasRule", "print", "removeRule", "reset", "load", "loadFromFile" ];

    var sentenceGrammar = { '<start>' : '<noun_phrase> <verb_phrase>.', '<noun_phrase>' : '<determiner> <noun>', '<verb_phrase>' : '<verb> | <verb> <noun_phrase> [.1]', '<determiner>' : 'a [.1] | the', '<noun>' : 'woman | man', '<verb>' : 'shoots' }

	var sentenceGrammar2 = {
	    '<start>': '<noun_phrase> <verb_phrase>.',
	    '<noun_phrase>': '<determiner> <noun>',
	    '<determiner>': [
	        'a [.1]',
	        'the'
	    ],
	    '<verb_phrase>': [
	        '<verb> <noun_phrase> [.1]',
	        '<verb>'
	    ],
	    '<noun>': [
	        'woman',
	        'man'
	    ],
	    '<verb>': 'shoots'
	};
	
	var uniqueNouns = { '<start>' : 'The `store("<noun>")` chased the `unique("<noun>");`', '<noun>' : 'dog | cat | mouse' };
	var uniqueNouns2 = { '<start>' : 'The `store("<noun>")` chased the `newrule("<noun>");`', '<noun>' : 'dog | cat | mouse', '<verb>' : 'rhino'  };

    test("RiGrammar.functions", function() {

        var rg = new RiGrammar();
        for ( var i = 0; i < functions.length; i++) {
            equal(typeof rg[functions[i]], 'function', functions[i]);
        }
    });

    test("RiGrammar.init", function() {

        var rg = RiGrammar();
        ok(rg._rules); // empty
        ok(typeof rg._rules['<start>'] === 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] === 'undefined');

        var rg1 = new RiGrammar(sentenceGrammar);
        ok(rg1._rules);
        ok(rg1._rules['<start>']);
        ok(rg1._rules['<noun_phrase>']);

        var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
        ok(rg2._rules);
        ok(rg2._rules['<start>']);
        ok(rg2._rules['<noun_phrase>']);
        
        var rg3= new RiGrammar(sentenceGrammar2);
        ok(rg3._rules);
        ok(rg3._rules['<start>']);
        ok(rg3._rules['<noun_phrase>']);

        deepEqual(rg1, rg2);
        deepEqual(rg2, rg3);
        deepEqual(rg1, rg3);

        var BAD = [ null, undefined, "hello", 1, 0 ];
        for ( var i = 0; i < BAD.length; i++) {
            throws(function() {

                try {
                    RiGrammar(BAD[i])
                }
                catch (e) {
                    throw e;
                }
            });
        }
    });

    test("RiGrammar.addRule", function() {

        var rg = new RiGrammar();
        rg.reset();
        rg.addRule("<start>", "<pet>");
        ok(rg._rules["<start>"]);
        ok(rg.hasRule("<start>"));
        rg.addRule("<start>", "<dog>", .3);
        ok(rg._rules["<start>"]);
        ok(rg.hasRule("<start>"));
    });

    test("RiGrammar.expand()", function() {

        var rg = new RiGrammar();
        rg.reset();

        rg.addRule("<start>", "pet");
        equal(rg.expand(), "pet");

        rg.reset();
        rg.addRule("<start>", "<pet>").addRule("<pet>", "dog");
        equal(rg.expand(), "dog");

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
        rg.addRule("<start>", "<pet>");
        rg.addRule("<pet>", "dog", .7);
        rg.addRule("<pet>", "cat", .3);

        var d = 0, g = 0;
        for ( var i = 0; i < 100; i++) {
            var r = rg.expand()
            if (r == 'dog') d++;
            if (r == 'cat') g++;
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
        equal(rg.expandFrom("mammal"), "dog");

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
        equal(rg.expandFrom("mammal"), "dog");

        var hawks=0,dogs=0;
        for ( var i = 0; i < 100; i++) {
            var res = rg.expandFrom("<pet>");
            ok(res === "hawk" || res === 'dog');
            if (res=="dog") dogs++;
            if (res=="hawk") hawks++;
        }
        ok(hawks > dogs*2);
    });
     
    test("RiGrammar.expandFrom(Trim)", function() {
        var rg = new RiGrammar();
        rg.addRule("<start>", " The <pet> runs ");
        rg.addRule("<pet>", " <bird> ");
        rg.addRule("<bird>", " hawk ");
        var res = rg.expandFrom("<start>");
        equal(res, "The hawk runs"); 

    });
    
	test("RiGrammar.getGrammar", function() {
		
		var rg = new RiGrammar(sentenceGrammar);
		var rg2 = new RiGrammar(sentenceGrammar2);
		deepEqual(rg,rg2)
		
		var e = "<start>\n  '<noun_phrase> <verb_phrase>.' [1]\n<noun_phrase>\n  '<determiner> <noun>' [1]\n<verb_phrase>\n  '<verb>' [1]\n  '<verb> <noun_phrase>' [.1]\n<determiner>\n  'a' [.1]\n  'the' [1]\n<noun>\n  'woman' [1]\n  'man' [1]\n<verb>\n  'shoots' [1]";
		equal(rg.getGrammar(),e);
	});
        
    /*test("RiGrammar.getRule", function() {

        var rg = new RiGrammar(sentenceGrammar);
	    var r = rg.getRule("<noun_phrase>");
	    //console.log("rule: "+r);
	    equal(r,"<determiner> <noun>");
	    
		rg.reset();
	    rg.addRule("<rule1>", "<pet>", 1);
	    equal(rg.getRule("<rule1>"),"<pet>");
	
	 	rg.reset();
	    equal("", rg.getRule("<start>"));
	    equal("", rg.getRule("start"));
	
		rg.reset();
	    rg.addRule("<rule1>", "cat", .4);
	    rg.addRule("<rule1>", "dog", .6);
	    rg.addRule("<rule1>", "boy", .2);
	    var answer = "cat [0.4] | dog [0.6] | boy [0.2]";
	    var result = rg.getRule("<rule1>");
	    equal(result, answer);
	  
	    rg.reset();
	    rg.addRule("rule1", "<pet>", 1);
	    equal(rg.getRule("rule1"),"<pet>");
	
	    rg.reset();
	    
	    equal('', rg.getRule("<start>"));
	    equal('', rg.getRule("start"));
	
	    var g = [];
	    g[0] = RiGrammar().load(sentenceGrammar); 
	    g[1] = RiGrammar().load(sentenceGrammar2); 
	    
	        // TODO: 
	        // (new RiGrammar()).loadFromFile("sentence1.json"), // use jquery
	        // (new RiGrammar()).loadFromFile("sentence2.json")
	    
	    for (var i = 0; i < g.length; i++) {
	      var rule = g[i].getRule("<noun_phrase>");
	      console.log(i+"R='"+rule+"'");
	      equal(rule,"<determiner> <noun>");
	    }
    });*/

   test("RiGrammar.hasRule", function() {

        var g = [ new RiGrammar(sentenceGrammar), 
        		  new RiGrammar(sentenceGrammar2) ];

	    for (var i = 0; i < g.length; i++) {
			var rg = g[i];
	        ok(rg.hasRule("<start>"));
	        ok(!rg.hasRule("start"));
	
	        rg.reset();
	        ok(!rg.hasRule("start"));
	        rg.addRule("<rule1>", "<pet>");
	        ok(rg.hasRule("<rule1>"));
	        ok(!rg.hasRule("rule1"));
	        ok(rg.hasRule(rg._normalizeRuleName("rule1")));
	
	        rg.reset();
	
	        rg.addRule("<rule1>", "cat", .4);
	        rg.addRule("<rule1>", "dog", .6);
	        rg.addRule("<rule1>", "boy", .2);
	        ok(rg.hasRule("<rule1>"));
	        ok(!rg.hasRule("rule1"));
			ok(rg.hasRule(rg._normalizeRuleName("rule1")));

	        ok(!rg.hasRule("badname"));
	
	        rg.reset();
	
	        rg.addRule("rule1", "<pet>");
	        ok(rg.hasRule("<rule1>"));
			ok(rg.hasRule(rg._normalizeRuleName("rule1")));
	        ok(!rg.hasRule("rule1"));
	
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
    
	// use jQuery $.ajax()
  	asyncTest("RiGrammar.loadFromFile1", function() {
    	
		var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
		var rg3 = RiGrammar(JSON.stringify(sentenceGrammar2));
	        
    	var rg1 = new RiGrammar();
    	rg1.loadFromFile("sentence1.json", function() {

	        ok(rg1._rules);
	        //rg1.print();
	        ok(rg1._rules['<start>']);
	        ok(rg1._rules['<noun_phrase>']);
	
	        deepEqual(rg1, rg2);
	        deepEqual(rg2, rg3);
	
	        var BAD = [ null, undefined, "hello", 1, 0 ];
	        for ( var i = 0; i < BAD.length; i++) {
	            throws(function() {
	
	                try {
	                    RiGrammar(BAD[i])
	                }
	                catch (e) {
	                    throw e;
	                }
	            });
	        }
	        
			start();
		});
	});
	
	// use jQuery $.ajax()
	asyncTest("RiGrammar.loadFromFile2", function() {
    	
		var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
		var rg3 = RiGrammar(JSON.stringify(sentenceGrammar2));
	        
    	var rg1 = RiGrammar().loadFromFile("sentence2.json", function() {
    		
	        ok(rg1._rules);
	        //rg1.print();
	        ok(rg1._rules['<start>']);
	        ok(rg1._rules['<noun_phrase>']);
	
	        deepEqual(rg1, rg2);
	        deepEqual(rg2, rg3);
	
	        var BAD = [ null, undefined, "hello", 1, 0 ];
	        for ( var i = 0; i < BAD.length; i++) {
	            throws(function() {
	
	                try {
	                    RiGrammar(BAD[i])
	                }
	                catch (e) {
	                    throw e;
	                }
	            });
	        }
	        
			start();
		});
	});
	
	// use RiTa native loadString()
	asyncTest("RiGrammar.loadFromFile3", function() {
    	
		var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
		var rg3 = RiGrammar(JSON.stringify(sentenceGrammar2));
	        
    	var rg1 = new RiGrammar();
    	rg1.loadFromFile("sentence1.json", function() {
    		
	        ok(rg1._rules);
	        //rg1.print();
	        ok(rg1._rules['<start>']);
	        ok(rg1._rules['<noun_phrase>']);
	
	        deepEqual(rg1, rg2);
	        deepEqual(rg2, rg3);
	
	        var BAD = [ null, undefined, "hello", 1, 0 ];
	        for ( var i = 0; i < BAD.length; i++) {
	            throws(function() {
	
	                try {
	                    RiGrammar(BAD[i])
	                }
	                catch (e) {
	                    throw e;
	                }
	            });
	        }
	        
			start();
		}, true);
	});
	
	// use RiTa native loadString() 
	asyncTest("RiGrammar.loadFromFile4", function() {
    	
		var rg2 = RiGrammar(JSON.stringify(sentenceGrammar));
		var rg3 = RiGrammar(JSON.stringify(sentenceGrammar2));
	        
    	var rg1 = new RiGrammar();
    	rg1.loadFromFile("sentence2.json", function() {
    		
	        ok(rg1._rules);
	        //rg1.print();
	        ok(rg1._rules['<start>']);
	        ok(rg1._rules['<noun_phrase>']);
	
	        deepEqual(rg1, rg2);
	        deepEqual(rg2, rg3);
	
	        var BAD = [ null, undefined, "hello", 1, 0 ];
	        for ( var i = 0; i < BAD.length; i++) {
	            throws(function() {
	
	                try {
	                    RiGrammar(BAD[i])
	                }
	                catch (e) {
	                    throw e;
	                }
	            });
	        }
	        
			start();
		}, true);
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
        rg.reset();
        rg.addRule("<start>", "<first> | <second>");
        rg.addRule("<first>", "the <pet> <action> were `adj()`");
        rg.addRule("second", "the <action> of the `adj()` <pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow");
        rg.addRule("<mammal>", "dog");
        rg.addRule("<action>", "cries | screams | falls");
        ok(typeof rg.print === 'function'); // how to test?
        //rg.print();
    });

    test("RiGrammar.expandWith", function() {

        var rg = new RiGrammar();

        rg.reset();

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
    
      
	test("RiGrammar.testSpecialChars", function() {

	    var res, s = "{ \"<start>\": \"hello: name\" }";
	    var rg = new RiGrammar(s);
	    //var rule = rg.getRule("<start>");
	    //ok(rule==="hello: name");
	    res = rg.expand();
	    ok(res==="hello: name");
	    	
	    s = "{ \"<start>\": \"hello &#124; name\" }";
	    rg = new RiGrammar(s);
	    //rule = rg.getRule("<start>");
	    //ok(rule==="hello &#124; name");
	    res = rg.expand();
	    ok(res==="hello | name");
	
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
	    //rule = rg.getRule("<start>");
	    //ok(rule==="&lt;start&gt;");
	    res = rg.expand();
	    //console.log(res);
	    ok(res==="<start>");
	    
	    s = "{ \"<start>\": \"I don&#96;t want it.\" }";
	    rg = new RiGrammar(s);
	    //rule = rg.getRule("<start>");
	    //ok(rule==="I don&#96;t want it.");
	    res = rg.expand();
		//console.log(res);
	    ok(res==="I don`t want it.");
	    
	    s = "{ \"<start>\": \"&#39;I really don&#39;t&#39;\" }";
	    rg = new RiGrammar(s);
	    //rule = rg.getRule("<start>");
	    //ok(rule==="&#39;I really don&#39;t&#39;");
	    res = rg.expand();
	    ok(res==="'I really don't'");

	    s = "{ \"<start>\": \"hello | name\" }";
	    rg = new RiGrammar(s);
	    //rule = rg.getRule("<start>");
	    //ok(rule==="hello | name");
	    for (var i = 0; i < 10; i++)
	    {
	      res = rg.expand();
	      ok(res==="hello" || res==="name");
	    }
	
	});
	
	test("RiGrammar.testExecIgnores", function() {
    
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
	    for (var i = 0; i < 10; i++) {
	        var res = rg.expand();
	        //console.log(i+") "+res);
	        ok(res!=null && res.length>0 && res.indexOf("`nofun()`")>-1);
	    }
	
	    rg.reset();
	
	    rg.addRule("<start>", "<first> | <second>");
	    rg.addRule("<first>", "the <pet> <action> were `nofun()`");
	    rg.addRule("<second>", "the <action> of the `nofun()` <pet>");
	    rg.addRule("<pet>", "<bird> | <mammal>");
	    rg.addRule("<bird>", "hawk | crow");
	    rg.addRule("<mammal>", "dog");
	    rg.addRule("<action>", "cries | screams | falls");
	
	    for ( var i = 0; i < 10; i++) {
	        var res = rg.expand();
	        //console.log(i+") "+res);
	        ok(res!=null && res.length>0 && res.indexOf("`nofun()`")>-1);
	    }
	    
	    RiTa.SILENT = tmp;
	});
	 
    test("RiGrammar.exec1", function() {
  
        var rg = new RiGrammar(); // do nothing

        rg.addRule("<start>", "<first> | <second>");
        rg.addRule("<first>", "the <pet> <action> were 'adj()'");
        rg.addRule("second", "the <action> of the 'adj()' <pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow");
        rg.addRule("<mammal>", "dog");
        rg.addRule("<action>", "cries | screams | falls");

        for ( var i = 0; i < 10; i++) {
            var res = rg.expand();
            ok(res && res.length && res.match("adj()"));
        }
    });
        
    test("RiGrammar.exec2", function() {
  
        var rg = new RiGrammar();
    
        // tmp for exec
        var fun = "function adj() { return Math.random() < .5 ? 'hot' : 'cold'; }";
		        
		rg.reset();
        rg.addRule("<start>", "<first> | <second>");
        rg.addRule("<first>", "the <pet> <action> were `adj()`");
        rg.addRule("second", "the <action> of the `adj()` <pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow");
        rg.addRule("<mammal>", "dog");
        rg.addRule("<action>", "cries | screams | falls");

        for ( var i = 0; i < 10; i++) {
        	
        	// TODO: fails in phantomJS  ??
        	// The "this" value passed to eval must be the global object from which eval originated
        	
            var res = rg.expand(fun);
            ok(res && res.length && !res.match("`"));
        }
    });
    
    // TODO: fails in phantomJS
    test("RiGrammar.exec3", function() {

		var rg = new RiGrammar(uniqueNouns);
		ok(rg); // >= 1 assertion, required for node
		
        if (typeof window != 'undefined' && window) 
        {     
        	// save grammar in window for store()/unique() functions below
            window.grammar = rg;
             
            var res = rg.expand();
            //console.log(res);
            ok(res);
            
            //window.grammar = rg;
            for ( var i = 0; i < 30; i++) {
                var res = rg.expand();
                //console.log("result="+res)
                ok(res);
                var dc = res.match(/dog/g);
                var cc = res.match(/cat/g);
                var mc = res.match(/mouse/g);
                ok(!dc || dc.length < 3); //The  cat  chased the cat <--- 2 matches for this case
                ok(!cc || cc.length < 3);
                ok(!mc || mc.length < 3);
            }
        }
    });
	     
    // TODO: fails in phantomJS
	test("RiGrammar.exec4", function() {
	
		var rg = new RiGrammar(uniqueNouns2);
		ok(rg); // >= 1 assertion, required for node
		
	    if (typeof window != 'undefined' && window) 
	    {     
	    	// save grammar in window for store()/unique() functions below
	        window.grammar = rg;
	         
	        var res = rg.expand();
	        //console.log(res);
	        ok(res);
	        
	        //window.grammar = rg;
            for ( var i = 0; i < 1; i++) {
                var res = rg.expand();
				//console.log("result="+res)
            	ok(res);                
            	ok(res.match(/rhino/g));
	        }
	    }
	});
	
	test("RiGrammar.testExecArgs", function() { 

		var rg = new RiGrammar();
		rg.execDisabled = false;
		rg.addRule("<start>", "`getFloat()`");
		
		for (var i = 0; i < 10; i++) {
		
		  var res = rg.expandFrom("<start>", this);
		  ok(res && res.length);
		  ok(parseFloat(res));
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

	});
}

// callback methods...

var saved = {};

function getFloat() { return Math.random(); }

function adj(o) { return (_type(o)==='boolean') ? "boolean" : "number"; }

function store(word) { // tmp
	word = word.trim();
    saved[word] = 1;
    return word;
}

function unique(word) {
	
	word = word.trim();
    while (saved[word]) {
        word = grammar.expandFrom('<noun>');
    }
    saved = {};

    return word;
}

function newrule(word) {
	
    return "<verb>";
}

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
