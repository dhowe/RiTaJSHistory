exports.answer=42;

(function(window, undefined) {
    
    var _VERSION_ = '0.20';
    
    /**  @private Simple type-checking functions */ 
    Type = {
        
        N : 'number', S : 'string', O : 'object', A :'array', B : 'boolean', R : 'regexp', F : 'function',
        
        /**
         * from: http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
         */
        get : function(obj) {
            
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        },
        
        /**
         * Returns true if the object if of type 'type, otherwise false
         */
        is : function(obj,type) {
            
            return Type.get(obj) === type;
        },
        
        /**
         * Throws TypeError if not the correct type, else returns true
         */
        ok : function(obj,type) {
            
            if (Type.get(obj)!=type) {
                
                throw TypeError('Expected '+(type ? type.toUpperCase() : type+E)
                    +", received "+(obj ? Type.get(obj).toUpperCase() : obj+E));
            }
            
            return true;
        }
        
    } // end Type

    
})(typeof window !== 'undefined' ? window : null);

