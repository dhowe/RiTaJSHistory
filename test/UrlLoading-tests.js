
var runtests = function () {

    QUnit.module("UrlLoading", {	
        setup: function () {},
        teardown: function () {}
    });

  	asyncTest("RiTa.loadStringMulti(url)", function() { // hmm, not sure why this needs to be first for node

          var urls = ["http://localhost/testfiles/sentence1.json","http://localhost/testfiles/sentence2.json"];
          RiTa.loadString(urls, function(s) {
              ok(s && s.length>500);
              start();		
          });
      }); 		
  	
  	asyncTest("RiTa.loadStringMulti(file)", function() { // TODO: why occasionally fails?!
  		
  		RiTa.loadString(["../data/sentence1.json","../data/sentence2.json"], function(s) {
              ok(s && s.length>500);
              start();		
          });
  	});

     asyncTest("RiTa.loadString1(file)", function() {

         RiTa.loadString("../data/sentence1.json", function(s) {
           ok(s && s.length > 100);
           ok(JSON.parse(s));
           start();		
       });
     });

     asyncTest("RiTa.loadString2(file)", function() {

         RiTa.loadString("../data/sentence2.json", function(s) {
           ok(s && s.length > 100);
           ok(JSON.parse(s));
           start();		
       });
     });

     asyncTest("RiTa.loadString1(url)", function() {

         RiTa.loadString("http://localhost/testfiles/sentence1.json", function(s) {

           ok(s && s.length > 100);
           ok(JSON.parse(s));
           start();		
       });
     });

     asyncTest("RiTa.loadString2(url)", function() {

         RiTa.loadString("http://localhost/testfiles/sentence2.json", function(s) {
           ok(s && s.length > 100);
           ok(JSON.parse(s));
           start();		
       });
    }); 	
    
    // RiMarkov 
	asyncTest("RiMarkov.loadFromUrlMulti", function() {
		
    	if (RiTa.env() == RiTa.NODE) {
    		ok("Not for Node");
    		start();
    		return;
    	}		
    	
  		var rm = new RiMarkov(3);
    	rm.loadFrom(["http://localhost/testfiles/kafka.txt", "http://localhost/testfiles/wittgenstein.txt"]);
    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (rm.ready()) { 
    			
    			ok(rm.size());
    			start();
    			clearInterval(id);
    		}
    		else {
    			
    			console.log("waiting...");
    			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
    });
  	
  	asyncTest("RiMarkov.loadFromFileMulti", function() {
  		
  		var rm = new RiMarkov(3);
    	rm.loadFrom(["../data/kafka.txt", "../data/wittgenstein.txt"]);
    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (rm.ready()) { 
    			
    			ok(rm.size());
    			start();
    			clearInterval(id);
    		}
    		else {
    			
    			console.log("waiting...");
    			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
  	});
    	
	asyncTest("RiMarkov.loadFromFile", function() {
    	
  		var rm = new RiMarkov(3);
    	rm.loadFrom("../data/kafka.txt");
    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (rm.ready()) { 
    			
    			ok(rm.size());
    			start();
    			clearInterval(id);
    		}
    		else {
    			
    			console.log("waiting...");
    			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
    });
    
	asyncTest("RiMarkov.loadFromUrl", function() {
    	
    	if (RiTa.env() == RiTa.NODE) {
    		ok("Not for Node");
    		start();
    		return;
    	}
    		
		var rm = new RiMarkov(3);
    	rm.loadFrom("http://localhost/testfiles/kafka.txt");
    	
    	var ts = +new Date();
    	var id = setInterval(function() {
    		
    		if (rm.ready()) { 
    			
    			ok(rm.size());
    			start();
    			clearInterval(id);
    		}
    		else {
    			
    			console.log("waiting...");
    			var now = +new Date();
    			if (now-ts > 5000) {
    				equal("no result",0);
    				start();
    				clearInterval(id);   				
    			}
			} 
    		
    	}, 50);
    });
 
 	// RiGrammar 
    
 	var sentenceGrammar = { "<start>" : "<noun_phrase> <verb_phrase>.", "<noun_phrase>" : "<determiner> <noun>", "<verb_phrase>" : "<verb> | <verb> <noun_phrase> [.1]", "<determiner>" : "a [.1] | the", "<noun>" : "woman | man", "<verb>" : "shoots" }, 
		sentenceGrammar2 = {
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

    asyncTest("RiGrammar.loadFrom(Url)", function() {
    	
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
    
}// end runtests


if (typeof exports != 'undefined') runtests();
