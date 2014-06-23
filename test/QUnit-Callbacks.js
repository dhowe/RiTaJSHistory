// Adds some logging to the command-line (Node) test script

// QUnit.testStart(function(n) {	
	// console.log("[INFO] Test: "+n.name);
// });

QUnit.moduleStart(function(n) {	
	console.log("[INFO] Testing "+n.name);
});

QUnit.moduleDone(function(n) {	
	console.log("[INFO] Completed "+n.name);
});    
