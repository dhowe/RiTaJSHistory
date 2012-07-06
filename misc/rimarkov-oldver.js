/*  
    NEXT: 
    
        -- remove dependency for 1 function (getMetrics()) on jquery...
                
        -- add memoizing of functions: textWidth, textAscent, textDescent, getBoundingBox, etc
            -- fonts and bounds

        -- re-add requestAnimationFrame?
  
     $Id: rimarkov-oldver.js,v 1.1 2012/06/18 11:43:53 dev Exp $
 */
    
(function(window, undefined) {
    
    // ///////////////////////////////////////////////////////////////////////
    // RiText Canvas 2D Renderer
    // ///////////////////////////////////////////////////////////////////////
    
    var RiMarkov = makeClass();
    
    RiMarkov.prototype = {

        __init__ : function(n) {

            this.n = n;
            this.useSmoothing = false;
        },
        
        loadTokens = function(tokens, multiplier) {
            
          var toAdd;
          wordCount += tokens.length;
          for (var k = 0; k < tokens.length; k++)
          {
            toAdd = [];
            for (var j = 0; j < toAdd.length; j++)
            {
              if ((k+j) < tokens.length)   
                toAdd[j] = (tokens[k+j] != null) ? tokens[k+j] : null;
              else 
                toAdd[j] = null;
            }      
            
            // hack to deal with multiplier...
            for (int j = 0; j < multiplier; j++)
              addSequence(toAdd);
          }
        },
        
        addSequence(String[] toAdd) {
            
          //System.out.println(Util.asList(toAdd));
          var node = root;          
          for (var i = 0; i < toAdd.length; i++)
            if (node.token) {
                node = node.addChild(toAdd[i], this.useSmoothing ? 2 : 1);
            }
        },
        
    }
        
    // /////////////////////////////////////////////////////////////////////// 

    var DBUG = false, E = "", SP = " "; // DUP
    
    // /////////////////////////////////////////////////////////////////////// 

    function makeClass() { // DUP
        
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

    function replaceAll(theText, replace, withThis) { // DUP?
        if (!theText) throw Error("no text!")
        return theText.replace(new RegExp(replace, 'g'), withThis);
    }

    function startsWith(str, prefix) { // DUP
        return str.indexOf(prefix) === 0;
    }
    
    function endsWith(str, ending) { // DUP
        return (str.match(ending + "$") == ending);
    }
    
    function isNull(obj) { // DUP
        
        return (typeof obj === 'undefined' || obj === null);
    }

    function getType(obj) { // DUP

        // http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/    
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };
    
    window.RiMarkov = RiMarkov;

})(window);
