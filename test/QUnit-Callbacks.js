
QUnit.propertiesFromAPI = function(className) {
	
	var fields, elements = [];
	
	// for now, this only works in Node
	if (typeof exports != 'undefined') {
		
	 	fields = require('../../docs/json/'+className).fields;
	 	
	   	for (var i=0,j=fields.length; i<j; i++) {
			 
			 var isVar = fields[i].variable || false;
			 var isStatic = (new RegExp("^"+className+"\.").test(fields[i].name));
			 var name = isStatic ? fields[i].name.substring(className.length+1) : fields[i].name;
			 //console.log(i+") "+fields[i].name +" var="+isVar+" static="+isStatic);
			 //var field = { name: fields[i].name, isVar: isVar, isStatic: isStatic }
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
