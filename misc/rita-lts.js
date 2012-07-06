(function(window, undefined) {
  
    var SP = " ", E = "";
    
    var N = 'number', S = 'string', O = 'object', A = 'array', B = 'boolean', R = 'regexp', F = 'function';
    
    /**
     * Simple type-checking framework for arguments and return values
     * Adapted from: 
     *   http://blog.jcoglan.com/2008/01/22/bringing-static-type-checking-to-javascript
     * @private
     */ 
    Type = {
        
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
        
        sigMatch : function() {
            
            var a = arguments;
            switch (a.length) {
    
                case 0:
                case 1:
                    err("Too few args: " + a.length);
                    break;
    
                case 2:
                    return (a[0] && a[1] && Type.checkSig(a[0], a[1]));
    
                default:
    
                    var theActual = a[a.length - 1];
    
                    for ( var i = 0; i < a.length - 1; i++) {
                        if (Type.checkSig(a[i], theActual))
                            return true;
                    }
                    return false;
            }
        },
        
        checkSig : function(expected, actual) {

            // log( "_checkSig: expected="+expected+" actual:"+actual);
            
            if (arguments.length == 2 && expected === 'array' && actual instanceof Array)
                return true; 
            
            if (actual.length != expected.length) 
                return false;
            
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
                            (b === 'regexp'     && Type.get(a) === 'regexp'));
    
                        break;
                }
    
                if (!valid) return false;
            }
    
            return true;
        },
        
        throwError : function(msg) {
            
            console.trace(this);
            throw TypeError(msg);
        },

        
        /**
         * Simple type-checking for argument types 
         * @private
         */  
        expects : function() {
            
            var method = this, expected = []; //arguments;
            
            for ( var i = 0; i < arguments.length; i++) {
                expected[i] = arguments[i];
            }
    
            if (expected.length === 0) expected = [ [] ];
    
            // check for old-style args (not in array), e.g., expects(B,S);
            if (expected.length > 0) {
                for ( var i = 0; i < expected.length; i++) {
                    if (typeof expected[i] === S && expected[i] !== 'array') {
                        Type.throwError("Failed expects(): expected array, found string "
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
    
                if (!Type.sigMatch.apply(this, args)) {
                    Type.throwError('Invalid arg types: expecting ' + 
                        asList(expected) + ' but found: '+asList(given));
                }
    
                return method.apply(this, arguments);
            };
        },

    
        /**
         * Simple type-checking for return types 
         * @private
         */   
        returns : function() {
            
            if (arguments.length != 1) error
                ('returns() expects 1 arg, found '+arguments.length);
            
            var method = this, expected = arguments[0];
            
            return function() {
                
                var result = method.apply(this, arguments);
                
                if (!Type.checkSig([expected],[result])) {
                    
                    Type.throwError('Invalid return type: ' + result + 
                        ' (' + (Type.get(result))+ '), expected: ' + expected+"\n");
                }
                return result;
            };
        }
        
    } // end Type
    
    Function.prototype.expects = Type.expects;
    Function.prototype.returns = Type.returns;

    function makeClass() {
    
        return function(args) {
            
            if (this instanceof arguments.callee) {
                
                if (typeof this.constructs == "function") {
                    
                    this.constructs.apply(this, args && args.callee ? args : arguments);
                }
            } 
            else {
                return new arguments.callee(arguments);
            }
        };
    }
    
    /////////////////////////////////////////////////////////////////////////
    // RiLetterToSound
    /////////////////////////////////////////////////////////////////////////
    
    var RLS = makeClass();
    
    /**
     * Entry in file represents the total number of states in the file. This
     * should be at the top of the file. The format should be "TOTAL n" where n is
     * an integer value.
     */
    RLS.TOTAL = "TOTAL";
    
    /**
     * Entry in file represents the beginning of a new letter index. This should
     * appear before the list of a new set of states for a particular letter. The
     * format should be "INDEX n c" where n is the index into the state machine
     * array and c is the character.
     */
    RLS.INDEX = "INDEX";
    
    /**
     * Entry in file represents a state. The format should be "STATE i c t f"
     * where 'i' represents an index to look at in the decision string, c is the
     * character that should match, t is the index of the state to go to if there
     * is a match, and f is the of the state to go to if there isn't a match.
     */
    RLS.STATE = "STATE";
    
    /**
     * Entry in file represents a final state. The format should be "PHONE p"
     * where p represents a phone string that comes from the phone table.
     */
    RLS.PHONE = "PHONE";
    
    /**
     * If true, the state string is tokenized when it is first read. The side
     * effects of this are quicker lookups, but more memory usage and a longer
     * startup time.
     */
    RLS.tokenizeOnLoad = true;
    
    /**
     * If true, the state string is tokenized the first time it is referenced. The
     * side effects of this are quicker lookups, but more memory usage.
     */
    RLS.tokenizeOnLookup = false;
    
    /**
     * Magic number for binary LTS files.
     */
    RLS.MAGIC = 0xdeadbeef;
    
    /**
     * Current binary file version.
     */
    RLS.VERSION = 1;
    
    /**
     * The 'window size' of the LTS rules.
     */
    RLS.WINDOW_SIZE = 4;
    
    /**
     * Whether LTS notifications are output to the console
     */
    RLS.VERBOSE = true;
    
    /**
     * The list of phones that can be returned by the LTS rules.
     */
    RLS.phonemeTable = null;
    
    
    RLS.prototype = {
        
        constructs : function() {
            
            /**
             * The indices of the starting points for letters in the state machine.
             */
            //protected HashMap letterIndex;
            this.letterIndex = {};
            
            /**
             * An array of characters to hold a string for checking against a rule. This
             * will be reused over and over again, so the goal was just to have a single
             * area instead of new'ing up a new one for every word. The name choice is to
             * match that in Flite's <code>cst_lts.c</code>.
             */
            //private char[] fval_buff = new char[WINDOW_SIZE * 2];
           this.fval_buff = [];
    
            /**
             * The LTS state machine. Entries can be String or State. An ArrayList could
             * be used here -- I chose not to because I thought it might be quicker to
             * avoid dealing with the dynamic resizing.
             */
            this.stateMachine = null;
    
            /**
             * The number of states in the state machine.
             */
            this.numStates = 0;
            
            // verify that the lts rules are included
            
            if (!LTS_RULES.length) throw Error("No LTS Rules found!");
            
            this.tmpCounter = 0;
            
            for ( var i = 0; i < LTS_RULES.length; i++) {
                this.parseAndAdd(LTS_RULES[i]);
            }
        },
        
        _createState : function(type, tokenizer) {
         
            if (type === RLS.STATE)
            {
              this.tmpCounter++;
              
              var index = parseInt(tokenizer.nextToken());
              var c = tokenizer.nextToken();
              var qtrue = parseInt(tokenizer.nextToken());
              var qfalse = parseInt(tokenizer.nextToken());
              
              return new DecisionState(index, c.charAt(0), qtrue, qfalse);
            }
            else if (type === RLS.PHONE)
            {
              return new FinalState(tokenizer.nextToken());
            }
            
            throw Error("Unexpected type: "+type);
        },
        
        /**
         * Creates a word from the given input line and add it to the state machine.
         * It expects the TOTAL line to come before any of the states.
         * 
         * @param line the line of text from the input file
         */
         parseAndAdd : function(line) {
             
          var tokenizer = new StringTokenizer(line, SP);
          var type = tokenizer.nextToken();

          if (type == RLS.STATE || type == RLS.PHONE)
          {
            if (RLS.tokenizeOnLoad)
            {
              this.stateMachine[this.numStates] = this._createState(type, tokenizer);
            } 
            else
            {
              this.stateMachine[this.numStates] = line;
            }
            this.numStates++;
          } 
          else if (type==RLS.INDEX)
          {
            var index = parseInt(tokenizer.nextToken());
            if (index != this.numStates)
            {
              throw Error("Bad INDEX in file.");
            } 
            else
            {
              var c = tokenizer.nextToken();
              this.letterIndex[c] = index;
              
            }
            //console.log(type+" : "+c+" : "+index + " "+this.letterIndex[c]);
          } 
          else if (type==RLS.TOTAL)
          {
            this.stateMachine = [];
            this.stateMachineSize = parseInt(tokenizer.nextToken());
          }
        },
        
        /**
         * Calculates the phone list for a given word. If a phone list cannot be
         * determined, <code>[]</code> is returned. 
         * 
         * @param word the word to find
         * 
         * @return array of phones for word or <code>empty array</code>
         */
        getPhones : function(word) {
            
          if (!RiTa.SILENT)
            console && console.log("[INFO] Using LTS for '"+word+"'");
          
          var phoneList = [], full_buff = [];
          var currentState, startIndex, stateIndex, c;
    
          // Create "000#word#000"
          //char[] full_buff = getFullBuff(word);
          //var full_buff = this.getFullBuff(word);
          var tmp = "000#"+word.trim()+"#000";
          var full_buff = tmp.split("");
          
          // For each character in the word, create a WINDOW_SIZE
          // context on each size of the character, and then ask the
          // state machine what's next. Its magic
          for (var pos = 0; pos < word.length; pos++)
          {
            for (var i = 0; i < RLS.WINDOW_SIZE; i++)
            {
              this.fval_buff[i] = full_buff[pos + i];
              this.fval_buff[i + RLS.WINDOW_SIZE] = full_buff[i + pos + 1 + RLS.WINDOW_SIZE];
            }
            c = word.charAt(pos);
            
            //startIndex = (Integer) letterIndex.get(Character.toString(c));
            startIndex = this.letterIndex[c];
            
            if (startIndex==null) throw Error("No startIndex for: "+c);

            stateIndex = parseInt(startIndex);//.intValue();
            
            currentState = this.getState(stateIndex);
            
            while (! (currentState instanceof FinalState) )
            {
              stateIndex = currentState.getNextState(this.fval_buff);
              currentState = this.getState(stateIndex);
            }
            
            currentState.append(phoneList);
          }
          
          return phoneList;
        },
        

//        /**
//         * Makes a character array that looks like "000#word#000".
//         * 
//         * @param word the original word
//         * 
//         * @return the padded word
//         */
//        getFullBuff : function( word) {
//            
//          var full_buff = [], WINDOW_SIZE = RLS.WINDOW_SIZE;
//
//          // Make full_buff look like "000#word#000"
//          
//          for (var i = 0; i < (WINDOW_SIZE - 1); i++)
//            full_buff[i] = '0';
//          
//          full_buff[WINDOW_SIZE - 1] = '#';
//          
//          word.getChars(0, word.length(), full_buff, WINDOW_SIZE);
//          
//          for (var i = 0; i < (WINDOW_SIZE - 1); i++)
//          {
//            full_buff[full_buff.length - i - 1] = '0';
//          }
//          full_buff[full_buff.length - WINDOW_SIZE] = '#';
//          
//          return full_buff;
//        },

        getState : function(i) {

            if (Type.is(i,N)) {
                
                var state = null;
                
                // WORKING HERE: this check should fail :: see java
                if (Type.is(this.stateMachine[i],S)) {
                    
                  state = this.getState(this.stateMachine[i]);
                  if (RLS.tokenizeOnLookup)
                      this.stateMachine[i] = state;
                } 
                else
                  state = this.stateMachine[i];
         
                return state;
            }
            else {
                
                var tokenizer = new StringTokenizer(i, " ");
                return this.getState(tokenizer.nextToken(), tokenizer);
            }
        }   
    };
    
    /////////////////////////////////////////////////////////////////////////
    // DecisionState
    /////////////////////////////////////////////////////////////////////////
    
    var DecisionState = makeClass();
    
    DecisionState.TYPE = 1;
    
    DecisionState.prototype = {
    
        /**
         * Class constructor.
         * 
         * @param index
         *          the index into a string for comparison to c
         * @param c
         *          the character to match in a string at index
         * @param qtrue
         *          the state to go to in the state machine on a match
         * @param qfalse
         *          the state to go to in the state machine on no match
         */
        //    char c, var index, var qtrue, var qfalse;
        constructs : function(index, c, qtrue, qfalse) {
            
            this.c = c;
            this.index = index;
            this.qtrue = qtrue;
            this.qfalse = qfalse;
        },
        
        type : function() {
            
            return "DecisionState";
        },
    
        /**
         * Gets the next state to go to based upon the given character sequence.
         * 
         * @param chars the characters for comparison
         * 
         * @returns an index into the state machine.
         */
        //public var getNextState(char[] chars)
        getNextState : function(chars) {
            
          return (chars[this.index] == this.c) ? this.qtrue : this.qfalse;
        },
    
        /**
         * Outputs this <code>State</code> as though it came from the text input
         * file. 
         */
        toString : function() {
          return this.STATE + " " + this.index + " " + this.c + " " + this.qtrue + " " + this.qfalse;
        }, 
    
        /**
         * Writes this <code>State</code> to the given output stream.
         * 
         * @param dos
         *          the data output stream
         * 
         * @throws IOException
         *           if an error occurs
    
        writeBinary : function(dos)
        {
    //      dos.writeInt(TYPE);
    //      dos.writeInt(index);
    //      dos.writeChar(c);
    //      dos.writeInt(qtrue);
    //      dos.writeInt(qfalse);
        }     */
    
        /**
         * Loads a <code>DecisionState</code> object from the given input stream.
         * 
         * @param dis
         *          the data input stream
         * @return a newly constructed decision state
         * 
         * @throws IOException
         *           if an error occurs
         
        public static State loadBinary(DataInputStream dis) throws IOException
        {
          var index = dis.readInt();
          char c = dis.readChar();
          var qtrue = dis.readInt();
          var qfalse = dis.readInt();
          return new DecisionState(index, c, qtrue, qfalse);
        }*/
    
        /**
         * Compares this state to another state for debugging purposes.
         * 
         * @param other
         *          the other state to compare against
         * 
         * @return true if the states are equivalent
         */
        compare : function(other) {
            
          if (other instanceof DecisionState)
          {
            var otherState = other;
            return index == otherState.index && c == otherState.c
                && qtrue == otherState.qtrue && qfalse == otherState.qfalse;
          }
          return false;
        }
        
    }// end DecisionState
    
    // ///////////////////////////////////////////////////////////////////////
    // FinalState
    // ///////////////////////////////////////////////////////////////////////
    
    var FinalState = makeClass();
    
    FinalState.TYPE = 2;
    
    FinalState.prototype = {
        
        /**
         * Class constructor. The string "epsilon" is used to indicate an empty list.
         * @param {} phones the phones for this state
         */
        constructs : function(phones) {
            
            this.phoneList = [];
            
            if (phones===("epsilon"))
            {
                this.phoneList = null;
            } 
            else if (Type.is(phones,A)) {
                
                this.phoneList = phones;
            }
            else
            {
              var i = phones.indexOf('-');
              if (i != -1)
              {
                  this.phoneList[0] = phones.substring(0, i); 
                  this.phoneList[1] = phones.substring(i + 1);
              } 
              else
              {
                  this.phoneList[0] = phones;
              }
            }
        },
        
        type : function() {
            
            return "FinalState";
        },
    
        /**
         * Appends the phone list for this state to the given <code>ArrayList</code>.
         * @param {array} array the array to append to
         */
        append : function(array) {
            
            if (!this.phoneList) return;
    
            for (var i = 0; i < this.phoneList.length; i++)
                array.push(this.phoneList[i]);
        },
    
        /**
         * Outputs this <code>State</code> as though it came from the text input
         * file. The string "epsilon" is used to indicate an empty list.
         * 
         * @return a <code>String</code> describing this <code>State</code>
         */
        toString : function() {
            
          if (!this.phoneList)
          {
            return RLS.PHONE + " epsilon";
          } 
          else if (this.phoneList.length == 1)
          {
            return RLS.PHONE + " " + this.phoneList[0];
          } 
          else
          {
            return RLS.PHONE + " " + this.phoneList[0] + "-" + this.phoneList[1];
          }
        },
    
        /**
         * Compares this state to another state for debugging purposes.
         * 
         * @param other
         *          the other state to compare against
         * 
         * @return <code>true</code> if the states are equivalent
         */
        compare : function(other)
        {
          if (other instanceof FinalState)
          {
            var otherState = other;
            if (!phoneList)
            {
              return (otherState.phoneList == null);
            } 
            else
            {
              for (var i = 0; i < phoneList.length; i++)
              {
                if (!phoneList[i].equals(otherState.phoneList[i]))
                {
                  return false;
                }
              }
              return true;
            }
          }
          return false;
        },
    
        /**
         * Writes this state to the given output stream.
         * 
         * @param dos
         *          the data output stream
         * 
         * @throws IOException
         *           if an error occurs
       
        public void writeBinary : function(DataOutputStream dos) throws IOException
        {
          dos.writeInt(TYPE);
          if (phoneList == null)
          {
            dos.writeInt(0);
          } else
          {
            dos.writeInt(phoneList.length);
            for (var i = 0; i < phoneList.length; i++)
            {
              dos.writeInt(phonemeTable.indexOf(phoneList[i]));
            }
          }
        }  */
    
        /**
         * Loads a FinalState object from the given input stream
         * 
         * @param dis
         *          the data input stream
         * 
         * @return a newly constructed final state
         * 
         * @throws IOException
         *           if an error occurs
     
        public static State loadBinary : function(DataInputStream dis) throws IOException
        {
          String[] phoneList;
          var phoneListLength = dis.readInt();
    
          if (phoneListLength == 0)
          {
            phoneList = null;
          } else
          {
            phoneList = new String[phoneListLength];
          }
          for (var i = 0; i < phoneListLength; i++)
          {
            var index = dis.readInt();
            phoneList[i] = (String) phonemeTable.get(index);
          }
          return new FinalState(phoneList);
        }    */
      }
    
    /////////////////////////////////////////////////////////////////////////
    //StringTokenizer
    /////////////////////////////////////////////////////////////////////////
    
    var StringTokenizer = makeClass();  
    
    StringTokenizer.prototype = {
    
        constructs : function(str, delim) {
            this.idx = 0;
            this.text = str;
            this.delim = delim || " ";
            this.tokens = str.split(delim);
        },
        
        nextToken : function() {
            return (this.idx < this.tokens.length) ? this.tokens[this.idx++] : null;
        }
    }
    
    window.LTSEngine = RLS;

})(window);