
var runtests = function() {
    
    QUnit.module("RiGrammar", {
	    setup: function () {},
	    teardown: function () {}
	}); 

    // TODO: add separate test file (same tests), for remote loaded grammars

    var functions = [ "addRule", "clone", "expand", "expandFrom", "expandWith", "getRule", "getRules", "hasRule", "print", "removeRule", "reset", "setGrammar" ];

    var grammarObj = { '<start>' : '<noun_phrase> <verb_phrase>', '<noun_phrase>' : '<determiner> <noun>', '<verb_phrase>' : '<verb> | <verb> <noun_phrase> [.1]', '<determiner>' : 'a [.1] | the', '<noun>' : 'woman | man', '<verb>' : 'shoots' }

    var uniqueNouns = {

    '<start>' : 'The `store("<noun>")` chased the `unique("<noun>");`', '<noun>' : 'dog | cat | mouse' }

    var rg; // the grammar
    
    test("RiGrammar-exec1", function() {
  
        var rg = new RiGrammar();

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
    
    test("RiGrammar-exec2", function() {
  
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
        	
        	// TODO: fails in phantomJS
        	
            var res = rg.expand(fun);
            ok(res && res.length && !res.match("`"));
        }
    });
    
    
    // TODO: fails in phantomJS
    test("RiGrammar-exec3", function() {

        if (typeof window != 'undefined') {  // why are we skipping this for node?
        	
            window.grammar = rg = new RiGrammar(uniqueNouns);
            for ( var i = 0; i < 30; i++) {
                var res = rg.expand();
                ok(res);
                var dc = res.match(/dog/g);
                var cc = res.match(/cat/g);
                var mc = res.match(/mouse/g);
                ok(!dc || dc.length < 2);
                ok(!cc || cc.length < 2);
                ok(!mc || mc.length < 2);
            }
        }
        else {
        	ok(1); // for node only
        }

    });

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

        var rg1 = new RiGrammar(grammarObj);
        ok(rg1._rules);
        ok(rg1._rules['<start>']);

        ok(rg1._rules['<noun_phrase>']);

        var rg2 = RiGrammar(JSON.stringify(grammarObj));
        ok(rg2._rules);
        ok(rg2._rules['<start>']);
        ok(rg2._rules['<noun_phrase>']);

        deepEqual(rg1, rg2);

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
        ok(rg.getRule("<start>"));
        ok(rg.getRule("start"));

        rg.addRule("<start>", "<dog>", .3);
        ok(rg._rules["<start>"]);
        ok(rg.getRule("<start>"));
        ok(rg.getRule("start"))
    });

    test("RiGrammar.clone", function() {

        var rg1 = new RiGrammar();
        rg1.reset();
        rg1.addRule("<start>", "<first> | <second>");
        rg1.addRule("<first>", "the <pet> <action> were 'adj()'");
        rg1.addRule("second", "the <action> of the 'adj()' <pet>");
        rg1.addRule("<pet>", "<bird> | <mammal>");
        rg1.addRule("<bird>", "hawk | crow");
        rg1.addRule("<mammal>", "dog");
        rg1.addRule("<action>", "cries | screams | falls");

        var rg2 = rg1.clone();
        deepEqual(rg1._rules.length, rg2._rules.length);

        //    return;

        deepEqual(rg1._rules, rg2._rules);
        deepEqual(rg1, rg2);

        rg2.removeRule("pet");
        ok(rg1.hasRule("pet"));
        ok(!rg2.hasRule("pet"));

        rg2.addRule("<pet>", "<bird>");


        var i, good = 0;
        for (i = 0; i < 100; i++) {
            var r = rg1.expand();
            //console.log(r);
            good = (r.indexOf('dog') > -1);
            if (good) break;
        }
        ok(good, i);

        good = 0;
        for (i = 0; i < 100; i++) {
            r = rg2.expand();
            good = (r.indexOf('dog') > -1);
            if (good) {
                break;
            }
        }
        ok(!good);
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
        ok(rg.getRule("<rule1>"));
        ok(rg.getRule("rule1"));

        var found1 = false, found2 = false, found3 = false;
        for ( var i = 0; i < 100; i++) {
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
        for ( var i = 0; i < 100; i++) {
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

        for ( var i = 0; i < 100; i++) {
            var res = rg.expandFrom("<bird>");
            ok(res === "hawk" || res === 'crow');
        }
    });

    test("RiGrammar.getRule", function() {

        var rg = new RiGrammar();

        rg.reset();
        rg.addRule("<rule1>", "<pet>");
        ok(rg.getRule("<rule1>"));
        ok(rg.getRule("rule1"));

        rg.reset();
        rg.addRule("<rule1>", "cat", .4);
        rg.addRule("<rule1>", "dog", .6);
        rg.addRule("<rule1>", "boy", .2);
        ok(rg.getRule("<rule1>"));
        ok(rg.getRule("rule1"));

        rg.reset();
        rg.addRule("rule1", "<pet>");
        ok(rg.getRule("<rule1>"));
        ok(rg.getRule("rule1"));

        rg.reset();
        
		RiTa.SILENT = 1;
        throws(function() {

            try {
                rg.getRule("<start>");
            }
            catch (e) {

                throw e;
            }
        });
        throws(function() {

            try {
                rg.getRule("start");
            }
            catch (e) {
                throw e;
            }
        });
		RiTa.SILENT = 0;
    });

    test("RiGrammar.getRules", function() {

        var rg = new RiGrammar(grammarObj);

        var rules = rg.getRules();
        ok(rules);
        ok(rules['<start>']);
        ok(!rules['start']);
        ok(!rules['']);
        ok(!rules['det']);
        ok(!rules[null]);
        ok(!rules[undefined]);

        //rg.print();
    });

    test("RiGrammar.hasRule", function() {

        var rg = new RiGrammar(grammarObj);

        ok(rg.hasRule("<start>"));
        ok(rg.hasRule("start"));

        rg.reset();
        ok(!rg.hasRule("start"));
        rg.addRule("<rule1>", "<pet>");
        ok(rg.hasRule("<rule1>"));
        ok(rg.hasRule("rule1"));


        rg.reset();

        rg.addRule("<rule1>", "cat", .4);
        rg.addRule("<rule1>", "dog", .6);
        rg.addRule("<rule1>", "boy", .2);
        ok(rg.hasRule("<rule1>"));
        ok(rg.hasRule("rule1"));
        ok(!rg.hasRule("rule"));

        rg.reset();

        rg.addRule("rule1", "<pet>");
        ok(rg.hasRule("<rule1>"));
        ok(rg.hasRule("rule1"));

        ok(!rg.hasRule(null));
        ok(!rg.hasRule(undefined));
        ok(!rg.hasRule(1));
    });


    test("RiGrammar.reset", function() {

        var rg = new RiGrammar();
        ok(rg._rules);
        rg.setGrammar(JSON.stringify(grammarObj));
        rg.reset();
        deepEqual(rg._rules, {});
        deepEqual(rg, RiGrammar());
    });


    test("RiGrammar.setGrammar", function() {

        var rg = new RiGrammar();
        ok(rg._rules);
        ok(typeof rg._rules['<start>'] === 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] === 'undefined');

        rg.setGrammar(JSON.stringify(grammarObj));
        ok(rg._rules);
        ok(typeof rg._rules['<start>'] !== 'undefined');
        ok(typeof rg._rules['<noun_phrase>'] !== 'undefined');

        //deepEqual(rg,rg1);
    });


    test("RiGrammar.removeRule", function() {

        var rg1 = new RiGrammar(grammarObj);

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
                console.log("error: " + r);
                missed = true;
            }
        }
        equal(missed, false);

        str = "", missed = false;
        for ( var i = 0; i < 100; i++) {
            var r = rg.expandWith("dog", "<pet>");
            if (r.indexOf("dog") < 1) {
                str = r;
                console.log("error: " + r);
                missed = true;
            }
        }
        equal(missed, false);


        //equal("TODO: MORE TESTS HERE");
    });
}

// unique methods...

var saved = {};

function store(word) { // tmp

    saved[word] = 1;
    return word;
}

function unique(word) {

    while (saved[word]) {

        word = grammar.expandFrom('<noun>');
    }
    saved = {};

    return word;
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


if (typeof exports != 'undefined') exports.unwrap = runtests;