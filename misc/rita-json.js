
//http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Paris%20Hilton

// makeClass - By John Resig (MIT Licensed)

function makeClass() {

    return function(args) {
        
        if (this instanceof arguments.callee) {
            
            if (typeof this.__init__ == "function") {
                
                this.__init__.apply(this, args && args.callee ? args : arguments);
            }
        } 
        else {
            return new arguments.callee(arguments);
        }
    };
}

var RiQuery = makeClass();

RiQuery.prototype = {
    
    __init__ : function() {
        
    },
    googleCount : function() {
      //http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Paris%20Hilton

    }
},
 