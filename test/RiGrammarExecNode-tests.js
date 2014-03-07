// TODO: Fix me! 
var runtests = function() {
   
    QUnit.module("RiGrammar", {
	    setup: function () {},
	    teardown: function () {},
	    temp : function() { return Math.random() < .5 ? 'hot' : 'cold'; }

	}); 

    test("RiGrammar.exec1", function() {
  
        var rg = new RiGrammar();
        rg.execDisabled = false;
		
        rg.addRule("<start>", "<first> | <second>");
        rg.addRule("<first>", "the <pet> <action> were `temp()`");
        rg.addRule("<second>", "the <action> of the `temp()` <pet>");
        rg.addRule("<pet>", "<bird> | <mammal>");
        rg.addRule("<bird>", "hawk | crow");
        rg.addRule("<mammal>", "dog");
        rg.addRule("<action>", "cries | screams | falls");

        for ( var i = 0; i < 1; i++) {
        	
        	// TODO: fails in nodeJS  ??
        	// The "this" value passed to eval must be the global object from which eval originated
            var res = rg.expand(this);
            //console.log(res);
            ok(res && res.length && !res.match("`"));
        }
    });
}
	

if (typeof exports != 'undefined') runtests(); //exports.unwrap = runtests;
