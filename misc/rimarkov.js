    
/*     
     $Id: rimarkov.js,v 1.1 2012/06/19 15:06:06 dev Exp $
 */
(function(window, undefined) {
    
    var SP = " ", N = 'number', S = 'string', O = 'object', A ='array', B = 'boolean', R = 'regexp', E = ""; // DUP
    Function.prototype.returns = function() {
        
        if (arguments.length != 1) throw Error
            ('returns() expects 1 arg, found '+arguments.length);
        
        var method = this, expected = arguments[0];
        
        return function() {
            
            var result = method.apply(this, arguments);
            
            if (!checkSig([expected],[result])) {
                
                throwError('Invalid return type: ' + result + 
                    ' (' + (getType(result))+ '), expected: ' + expected+"\n");
            }
            return result;
        };
    };
    function asList(array) {
        
        var s="[";
        for ( var i = 0; i < array.length; i++) {
            var el = array[i];
            if (array[i] instanceof Array)
                el = asList(array[i]);
            s += el;
            if (i < array.length-1) s += ", ";
        }
        return s+"]";
    }
    Function.prototype.expects = function() {
        
        var method = this, expected = []; //arguments;
        
        for ( var i = 0; i < arguments.length; i++) {
            expected[i] = arguments[i];
        }

        if (expected.length === 0) expected = [ [] ];

        // check for old-style args (not in array), e.g., expects(B,S);
        if (expected.length > 0) {
            for ( var i = 0; i < expected.length; i++) {
                if (typeof expected[i] === 'string' && expected[i] !== 'array') {
                    throwError("Failed expects(): expected array, found string "
                        + "(perhaps an old-style arguments list?): \n" + method);
                }
            }
        }

        return function() {

            var args = [], given = [];
            for ( var i = 0; i < expected.length; i++)
                args.push(expected[i]);
            for ( var i = 0; i < arguments.length; i++) 
                given.push(arguments[i]);

            args.push(given); // [[expected1],[expected2],...,[arguments]]

            if (!sigsMatch.apply(this, args)) {
                throwError('Invalid arg types: expecting ' + 
                    asList(expected) + ' but found: '+asList(given));
            }

            return method.apply(this, arguments);
        };
    };
    
    var throwError = function(msg) {
        console.trace(this);
        //if (typeof printStackTrace !== 'undefined') printStackTrace(e);
        throw TypeError(msg);
    };

    var sigsMatch = function() {

        switch (arguments.length) {

            case 0:
            case 1:
                throw Error("Too few args: " + arguments.length);
                break;

            case 2:
                return checkSig(arguments[0], arguments[1]);

            default:

                var theActual = arguments[arguments.length - 1];

                for ( var i = 0; i < arguments.length - 1; i++) {
                    var ok = checkSig(arguments[i], theActual);
                    if (ok) return true;
                }
                return false;
        }
    };

    var checkSig = function(expected, actual) {
        
        // log( "checkSig: expected="+expected+" actual:"+actual);
        
        if (arguments.length == 2 && expected === 'array' && actual instanceof Array)
            return true; 
        
        if (actual.length != expected.length) return false;
        
        var n = expected.length, valid, a, b;
        
        for ( var i = 0; i < n; i++) {
            a = actual[i];
            b = expected[i];
            valid = true;

            switch (true) {
                    
                case b instanceof Function:
                    valid = a ? (a.isA ? a.isA(b) : (a instanceof b)) : false;
                    break;

                case typeof b == 'string' || b instanceof String:
                    
                    // allow numbers for booleans (?)
                    valid = ((typeof a == b) || 
                        (b === 'array'      && a instanceof Array) ||
                        (b === 'boolean'    && typeof a === 'number') ||
                        (b === 'regexp'     && typeof a === 'function'));

                    break;
            }

            if (!valid) return false;
        }

        return true;
    };
    
    // ////////////////////////////////////////////////////////////
    // RiMarkov
    // ////////////////////////////////////////////////////////////
    
    var RiMarkov = makeClass();
            
    RiMarkov.prototype = {

        /**
         * Construct a Markov chain (or n-gram) model 
         * and set its n-Factor
         * @param {number} n-factor for the model
          @param {boolean} whether the model should be case sensitive (optional, default=false)
         */
        //and ignoreCase flag
        __init__ : function(n, caseSentive) {
            
            if (arguments.length != 1 || getType(n)!='number')
                throw Error("Bad args");
            
            this._n = n;
            this.useSmoothing = false;
            this.ignoreCase = !caseSentive || true;
            this.root = new TextNode(null, 'ROOT');
            
        }.expects([N]),
        
        /**
         * Returns the raw (unigram) probability for 
         * a token in the model, or 0 if it does not exist
         * 
         * @returns {number} from 0-1
         */
        getProbability: function(data) {
            
            if (this.root == null) throw Error("Model not initialized: null root!");
            
            var tn = (typeof data=='string') ? this.root.lookup(data) : this._findNode(data);

            var res = (tn) ? tn.probability() : 0;

//console.log('getProbability('+data.toString()+') -> '+res);
            
            return res;
            
        }.expects([S],[A]).returns(N),


        /** 
         * Returns the probability of obtaining
         * a sequence of k character tokens where k <= nFactor,
         * e.g., if nFactor = 3, then valid lengths
         * for the String <code>tokens</code> are 1, 2 & 3.
         * 
         * @param {array} of tokens 
         * 
         * @returns {number} from 0-1
        
        getPathProbability : function(tokens) {
            
            var tn = ;
            return (tn) ? tn.probability() : 0;
            
        }.expects([A]).returns(N),
         */
        
        // TODO: should this take a single token as well?
        /** 
         * Returns the full set of possible next tokens, as an associative array, 
         * (mapping string -> number (probability)) given an array of tokens 
         * representing the path down the tree (with length less than n).
         * <p>  
         * If the input array length is not less than n, or the path cannot be 
         * found, or the end-node has no children, null is returned.
         * <p>
         * @param {array} of strings representing the tokens to search
         * 
         * @see #getProbability(String) 
         * 
         * @returns {object} mapping tokens to probabilities
         */
        getProbabilities : function(path) {
            
            if (getType(path) == 'string') path = [path];
            
            if (path.length < 1 || path.length >= this._n)      
              return {};
            
            var probs = {}, tn = this._findNode(path);
            
            if (!tn) return {};

            var nexts = tn.childNodes();
            for ( var i = 0; i < nexts.length; i++) {
                var node = nexts[i];
                if (node)  {
                    probs[node.token] = node.probability();
                }
            }
            return probs;
            
          //console.log('nexts: ' +nexts);
                      
            // CHANGED IN RiTa 6/16/12

            for ( var i = 0; i < nexts.length; i++) {
              var node = nexts[i];   
              if (node) {
                  
                var tok = node.token;   
                var copy = path.slice();
                copy.push(tok);
                var prob = this.getProbability(copy);
                probs[tok] = prob;
              }      
            }
            return probs; 
            
        }.expects([A],[S]).returns(O),
        
        /**
         * Continues generating tokens until a token matches 'regex', assuming
         * the length of the output array is between min and maxLength (inclusive).
         * 
         * @param {string} or {object} regex The regex string or object to match against
         * @param {number} minLength the minimum number of tokens to generate
         * @param {number} maxLength the maximum number of tokens to generate
         * 
         * @returns {array} strings
         */ 
        generateUntil : function(regex, minLength, maxLength){
           
            minLength = minLength || 1, maxLength = maxLength || 99;
            
            var mn, tokens, tries=0, maxTries=500;
            
            OUT: while (++tries < maxTries) {
            
                // generate the min number of tokens
                tokens = this.generateTokens(minLength);

                // keep adding one and checking until we pass the max
                while (tokens.length < maxLength) {
                    
                    mn = this._nextNode(tokens);
                    
                    if (!mn || !mn.token)   
                      continue OUT;// fail, restart
                    
                    tokens.push(mn.token);
                    
                    // check against our regex
                    if (mn.token.search(regex) >-1 )
                        return tokens;
                }
            }
            
            // uh-oh, we failed
            if (tries >= maxTries) 
                throw Error("\n[WARN] RiMarkov failed to complete after "+tries+" attempts\n");

            return tokens;
           
        }.expects([S],[S,N,N]).returns(A), 
            
        /**
         * Generates a string of <pre>length</pre> tokens from the model
         * @param {number} the target number of tokens to generate
         * @returns {array} strings
         */
        generateTokens : function(targetNumber){
            
            var tries = 0, maxTries = 500, tokens = [];
            
            OUT: while (++tries < maxTries) {
                
              var mn = this.root.selectChild(null, true);
              if (!mn || !mn.token) continue OUT;
              tokens.push(mn);
              
              while (tokens.length < targetNumber) {
                  
                mn = this._nextNode(tokens);
                if (!mn || !mn.token)  { // hit the end
                    
                  tokens = []; // start over
                  continue OUT;
                }   
                
                tokens.push(mn);        
              }
              
              break;
            }
            
            // uh-oh, looks like we failed...
            if (tokens.length < targetNumber) {
                 throw Error("\n[WARN] RiMarkov failed to complete after "+tries
                   +" tries, with only "+tokens.length+" successful generations...\n");
            }
   
            var res = [];
            for ( var i = 0; i < tokens.length; i++) {
                res[i] = tokens[i].token;
            }
            
            return res;// this._tokensToString(tokens, true);

        }.expects([N]).returns(A),
        


        /**
         * Sets/gets whether the model ignores case in its comparisons
         * @param {boolean} value sets the value of the flag (optional)
         * @returns {number}
         */
        ignoreCase : function(value){
            
            if (arguments.length) {
                
                // TODO: and do what??
                this.ignoreCase = value;
                return this;
            }
            return this.ignoreCase;
            
        }.expects([B],[]),
        
        /**
         *  TODO: does this make sense as one method?
         * 
         * If only one array parameter is provided, this function returns all possible
         * next words (or tokens), ordered by probability, for the given
         * array. <p>Note: seed arrays of any size (>0) may 
         * be input, but only the last n-1 elements will be considered.   
         *
         * @example var result = getCompletions([ "the","red"]);
         *
         * If two arrays are provided, it returns an unordered list of possible words <i>w</i> 
         * that complete an n-gram consisting of: pre[0]...pre[k], <i>w</i>, post[k+1]...post[n].
         * As an example, the following call:
         * 
         * @example var result = getCompletions([ "the" ], [ "red", "ball" ]);
         * 
         * will return all the single words that occur between 'the' and 'red ball'
         * in the current model (assuming n > 3), e.g., [ 'round', 'big', 'bouncy']).
         * <p> 
         * Note: For this operation to be valid, (pre.length + post.length)
         * must be strictly less than the model's nFactor, otherwise an 
         * exception will be thrown. 
         * 
         * @param {array} pre
         * @param {array} post (optional)
         * 
         * @returns {array}  an unordered list of possible next tokens
         * 
         * @private  TODO: this is temporary, remove
         */
        getCompletions : function(pre, post) {
            
           /* if (!post) {
                if (pre == null || pre.length >= nFactor)
                    throw new RiTaException("Invalid pre array: "+RiTa.asList(pre));
                  
                  int postLen = post == null ? 0 : post.length;    
                  if (pre.length + postLen > nFactor) {
                    throw new RiTaException("Sum of pre.length" +
                        " && post.length must be < N, was "+(pre.length+postLen));        
                  }
                  
                  TextNode tn = findNode(pre);
                  if (tn == null) return null;
                  
                  List result = new ArrayList();
                  Collection nexts = tn.getChildNodes();
                  for (Iterator it = nexts.iterator(); it.hasNext();)
                  {
                    TextNode node = (TextNode) it.next();
                    String[] test = appendToken(pre, node.getToken());
                    if (test == null) continue;
                    for (int i = 0; i < postLen; i++)
                      test = appendToken(test, post[i]); 
                    if (findNode(test) != null)
                      result.add(node.getToken());      
                  }        
                  return strArr(result);
            }
            else {
                var seed = pre;
                if (seed == null || seed.length == 0) {
                    System.out.println("[WARN] Null (or zero-length) seed passed to getCompletions()");
                    return null;
                }
                int firstLookupIdx = Math.max(0, seed.length-(nFactor-1));         
                TextNode node = rootLookup(seed[firstLookupIdx++]);    
                for (int i = firstLookupIdx; i < seed.length; i++) {
                    if (node == null) return null;
                    node = node.lookup(seed[i]);
                }
                if (node == null) return null;
    
                Collection c = node.getChildMap().values();
                if (c == null || c.size()<1) return null;
                TextNode[] nodes = new TextNode[c.size()];
                nodes = (TextNode[])c.toArray(nodes);
                Arrays.sort(nodes);
                String[] result = new String[nodes.length];
                for (int i = 0; i < result.length; i++)
                    result[i] = nodes[i].getToken();
                return result;
            }*/
        }.expects([A],[A,A]).returns(A),

        /**
         * Returns the current n-value for the model
         * @returns {number}
         */
        getN : function() {
            
            return this._n;
            
        }.expects([]).returns(N),

        
        /**
         * Returns the number of tokens currently in the model
         * @returns {number}
         */
        numTokens : function() {
            
            return this.root.count;
            
        }.expects([]).returns(N),
        
        /**
         * Prints a formatted version of the model to the console 
         */
        print : function() {
            
            console.log(this.root.asTree(false));
            
        }.expects([]),
        
        /**
         * Loads an array of tokens (or words) into the model; each 
         * element in the array must be a single token for proper 
         * construction of the model. 
         * 
         * @param {number} multiplier Weighting for tokens in the array (optional, default=1) <br>
         * @returns {object} this RiMarkov
         */
        loadTokens : function(tokens, multiplier) {
          
          multiplier = multiplier || 1;

          this.root.count += tokens.length; // here?
          
          for (var toAdd, k = 0; k < tokens.length; k++)
          {
            toAdd = [];
            
            for (var j = 0; j < this._n; j++)
            {
              if ((k+j) < tokens.length)   
                toAdd[j] = (!isNull(tokens[k+j])) ? tokens[k+j] : null;
              else 
                toAdd[j] = null;
            }      
            
            // hack to deal with multiplier...
            for (var j = 0; j < multiplier; j++) {
              var node = this.root;          
              for (var i = 0; i < toAdd.length; i++) {
                if (node.token)        
                  node = node.addChild(toAdd[i]);
              }
            }
          }
          
          return this;
          
        }.expects([A],[A,N]).returns(O),
        
        //////////////////////////////// PRIVATES: RiMarkov  /////////////////////////////////////
        
        /** @private */
        _findNode : function(path) 
        {
          // console.log("RiMarkov.findNode("+path.toString()+")");
          if (!path || getType(path) != 'array' || !path.length)
              return null;

          var nFactor = this._n;
          var numNodes = Math.min(path.length, nFactor-1);
          var firstLookupIdx = Math.max(0, path.length-(nFactor-1));         
          var node = this.root.lookup(path[firstLookupIdx++]);    
          
          if (!node) return null;
          
          var idx = 0;  // found at least one good node
          var nodes = [];    
          nodes[idx++] = node; 
          for (var i = firstLookupIdx; i < path.length; i++) {       
            node = node.lookup(path[i]);
            if (!node) return null;
            nodes[idx++] = node;
          }
          
          return nodes ? nodes[nodes.length-1] : null;
        },
        
        _nextNode : function(previousTokens)
        { 
          // Follow the seed path down the tree
          var firstLookupIdx = Math.max(0, previousTokens.length-(this._n-1)), 
              node = this.root.lookup(previousTokens[firstLookupIdx++]);
          
          for (var i = firstLookupIdx; i < previousTokens.length; i++) {
              (node) && (node = node.lookup(previousTokens[i]));
          }
          
          // Now select the next node
          return node.selectChild(null, true);
        },
        
        _tokensToString : function(tokens, addSpaces) {
          var result = E; 
          for ( var i = 0; i < tokens.length; i++) {
            if (tokens[i].token) {
                result += tokens[i].token;
                if (i < tokens.length-1 && addSpaces)
                    result += SP;      
            }
          }
          return result;
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
    
    // ////////////////////////////////////////////////////////////
    // TextNode
    // ////////////////////////////////////////////////////////////
    
    var TextNode = makeClass();
    
    TextNode.prototype = {

        __init__ : function(parent, token) {
            
            this.count = 0;
            this.parent = parent;
            this.token = token;
            this.children = {};
        },
        
        selectChild : function(regex, probabalisticSelect) {
            var ps = probabalisticSelect || true;
            return this.children ? this._select(this.childNodes(regex), ps) : null;
        },
        
        _select : function (arr, probabalisticSelect)
        { 
            if (!arr) throw TypeError("bad arg to '_select()'");
            
            probabalisticSelect = probabalisticSelect || false;
            
            return (probabalisticSelect ? this._probabalisticSelect(arr) 
                : arr[Math.floor((Math.random()*arr.length))]);    
        },
        
        _probabalisticSelect : function(arr)
        {    
            if (!arr) throw TypeError("bad arg to '_probabalisticSelect()'");
            
            //L("RiTa.probabalisticSelect("+c+", size="+c.size()+")");
            if (!arr.length) return null;
            if (arr.length == 1) return arr[0];

            // select from multiple options based on frequency
            var pTotal = 0, selector = Math.random();
            for ( var i = 0; i < arr.length; i++) {
                
                pTotal += arr[i].probability();
                if (selector < pTotal)
                    return arr[i];
            }
            throw Error("Invalid State in RiTa.probabalisticSelect()");   
        },

        addChild : function(newToken, initialCount) {

          initialCount = initialCount || 1;
          
          var node = this.children[newToken];

          //  add first instance of this token 
          if (!node) {
            node = new TextNode(this, newToken);
            node.count = initialCount;
            this.children[newToken] = node;   
          }
          else {         
            node.count++;
          }
          
          return node;
        },
        
        asTree : function(sort) {
            
          var s = this.token+" ";
          if (!this.isRoot()) 
            s+= "("+this.count+")->"; 
          s += "{";
          if (!this.isLeaf())
            return this.childrenToString(this, s, 1, sort);
          return s + "}";
        },
        
        isRoot : function() {
            return isNull(this.parent);
        },
        
        isLeaf : function() {
            return this.childCount() == 0;
        },
        
        probability : function() {
            //onsole.log('probability: '+ this.count+'/'+this.siblingCount());
            return this.count/this.siblingCount();
        },
        
        uniqueCount : function() {
        
            return Object.keys(this.children).length;    // compatible?
        },
        
        childCount : function() {
            
            //return this.childNodes().length;
            
            if (!this.children) return 0;
            
            var sum = 0;
            for (var k in this.children) {
                if (k && this.children[k])
                    sum += this.children[k].count;
            }
            
            return sum;
        },        
        
        childNodes : function(regex) {
            
            if (!this.children) return [];
            
            if (getType(regex) == 'string') regex = new RegExp(regex);
            
            var res = [];
            for (var k in this.children)  {
                var node = this.children[k];
                if (!regex || (node && node.token && node.token.search(regex)>-1)) {
                    res.push(node);
                }
            }
            
            return res;
        },        
        
        siblingCount : function() {
            
          if (this.isRoot()) throw Error("Illegal siblingCount on ROOT!");
          
          if (!this.parent) throw Error("Null parent for: "+this.token);
          
          return this.parent.childCount();
        },
        
        /*
         * takes node or string, returns node
         */
        lookup : function(obj)
        {   
          if (!obj) return null;
          
          obj = (typeof obj != 'string' && obj.token) ? obj.token : obj;
          
          //console.log(this.token+".lookup("+obj+")");
          
          return obj ? this.children[obj] : null; 
        },
        
        childrenToString : function(textNode, str, depth, sort)  {

          var mn = textNode, l = [], node = null, indent = "\n";
          
          sort = sort || false;
          
          for (var k in textNode.children) {
              l.push(textNode.children[k]);
          }
          
          if (!l.length) return str;
          
          if (sort) l.sort();
                    
          for (var j = 0; j < depth; j++) 
            indent += "  ";
          
          for (var i = 0; i < l.length; i++) {
              
            node = l[i];
            
            if (!node) break;
            
            var tok = node.token;      
            if (tok) {         
              (tok == "\n") && (tok = "\\n");
              (tok == "\r") && (tok = "\\r");
              (tok == "\t") && (tok = "\\t");
              (tok == "\r\n") && (tok = "\\r\\n");
            }
            
            str += indent +"'"+tok+"'";
            
            if (!node.count) 
              throw Error("ILLEGAL FREQ: "+node.count+" -> "+mn.token+","+node.token);
            
            if (!node.isRoot())
              str += " ["+node.count + ",p=" +//formatter.format
                (node.probability().toFixed(3)) + "]->{"; 
            
            if (node.children)
              str = this.childrenToString(node, str, depth+1, sort);  
            else 
                str += "}";
          }
          
          indent = "\n";
          for (var j = 0; j < depth-1; j++) 
            indent += "  ";
          
          return str + indent + "}";
        },
        
        toString : function() {
            return '[ '+this.token+" ("+this.count+'/'+this.probability().toFixed(3)+'%)]';
        }, 
    }
    
    window.RiMarkov = RiMarkov;

})(window);
