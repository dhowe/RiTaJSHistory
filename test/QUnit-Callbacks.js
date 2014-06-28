/*
 * loads the JSON doc-file and checks that each described field actually exists in the object
 */
QUnit.checkAPI = function(className, Class, obj) {

	if (typeof QUnit.propertiesFromAPI != 'function') {
		ok(typeof exports == 'undefined'); // not in node, ignore for now
		console.log('Returning!');
		return;
	}
	
	var eles = QUnit.propertiesFromAPI(className); 	
    for ( var i = 0; i < eles.length; i++) {
    	
    	if (eles[i].isVar) {
    		
			ok(obj.hasOwnProperty(eles[i].name), 'checking property:'+eles[i].name);
    	}
    	else if (eles[i].isStatic) {
    		
    		equal(typeof Class[eles[i].name], 'function', 'checking static-function: '+Class[eles[i].name]+'()');
    	}
    	else {
    		
    		equal(typeof obj[eles[i].name], 'function', 'checking function: '+eles[i].name+'()');
    	}
    }        
}

/*
 * loads the JSON doc-file and populates and array of 'field' object, where a field
 * contains a name and 2 booleans: isVar, and isStatic.
 */
QUnit.propertiesFromAPI = function(className) {
	
	var fields, elements = [];
	
	// for now, this only works in Node
	if (typeof exports != 'undefined') {
		
	 	fields = require('../../docs/json/'+className).fields;
	 	
	   	for (var i=0,j=fields.length; i<j; i++) {
			 
			 var isVar = fields[i].variable || false,
			 	isStatic = (new RegExp("^"+className+"\.").test(fields[i].name)),
				name = isStatic ? fields[i].name.substring(className.length+1) : fields[i].name;
				
			 elements.push({ name: name, isVar: isVar, isStatic: isStatic });
		}
	}
	
	return elements;
}

// Adds some logging to the command-line (Node) test script
QUnit.moduleStart(function(n) {	
	console.log("[INFO] Testing "+n.name);
});

// Adds some logging to the command-line (Node) test script
QUnit.moduleDone(function(n) {	
	console.log("[INFO] Completed "+n.name);
});    
