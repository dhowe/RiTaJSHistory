/*
 * TODO:
 * -- documents API
 * -- add rest of objects
 * -- finish API tests (kenny)
 * -- add tests for private methods (kenny)
 * 
 * QUESTIONS:
 * -- Load RiLexicon in separate (dict) file?
 * -- Integrating with Processing
 * -- Integrating with Canvas ?
 * -- Subclassing RiTa objects ? (possible?)
 * 
 */

(function(window, undefined) {

	var document = window.document;
		
	//////////////////////////////////////////////////////////////
	//  RiString
	//////////////////////////////////////////////////////////////

	var RiString = makeClass();
	
	/**
	 * A static (class-scoped) test constant
	 */
	RiString.A_CONSTANT = 12;
	
	// RiString.prototype = { // TODO: new pattern

	/**
	 * The RiString constructor
	 * @param string the text it will contain 
	 */
	RiString.prototype.init = function(text){
		this.x = 1;
		this.text = text;
	};
	
	/**
	 * Returns the character at the given 'index'
	 * @param int index of the character
	 * @return string a single character
	 */
	RiString.prototype.charAt = function(index) {
		return this.text.charAt(index);
	};
	
	/**
	 * Concatenates the text from another RiString at the end of this one
	 * @return this RiString
	 */
	RiString.prototype.concat = function(riString){
		this.text = this.text.concat(riString.getText());
		return this;
	};
	
	/**
	 * @return boolean
	 */
	RiString.prototype.endsWith = function(substr){
		return endsWith(this.text, substr);
	};
	
	/**
	 * @return boolean
	 */
	RiString.prototype.equals = function(riString){
		riString.text === this.text;
	};
	
	/**
	 * @return boolean
	 */
	RiString.prototype.equalsIgnoreCase = function(str){
		return str.toLowercase() === this.text.toLowercase();
	};
	
	/**
	 * Sets the text contained by this object
	 * @param string the text
	 * @return this RiString
	 */
	RiString.prototype.setText = function(text) {
        this.text = text;
        return this;
    },
	
	/**
	 * Returns an array of part-of-speech tags, one per word, using RiTa.tokenize() and RiTa.posTag().
	 * @return array of pos strings, one per word
	 */
	RiString.prototype.getPos = function() {
        var words = RiTa.tokenize(trim(this.text)); // was getPlaintext()
        var tags = PosTagger.tag(words); // should this be RiTa.posTag() ??
        for (var i = 0, l = tags.length; i < l; i++) {
            if (!okStr(tags[i]))
            	error("RiString: can't parse pos for:" + words[i]);
        }
        return tags;	
     };
	
	/**
	 * Returns the part-of-speech tags for the word, using RiTa.tokenize() and RiTa.posTag().
	 * @param int the word index
	 * @return string the pos
	 */
	RiString.prototype.getPosAt = function(index){
	  	var tags = getPos();
	  	if (isNull(tags) || tags.length==0 || index >= tags.length)
	      return [];
	    return pos[index];
	};
	
	/**
	 *  Returns the string contained by this RiString
	 *  @return string the text
	 */
	RiString.prototype.getText = function(){
		return this.text;
	};
	
	/**
	 * Returns the word at 'index', according to RiTa.tokenize()
	 * @param int the word index
	 *  @return string the word
	 */
	RiString.prototype.getWordAt = function(index){
	    var words = RiTa.tokenize(trim(this.text));
	  	if (isNull(words) || words.length==0 || index >= words.length)
	      return EA;
	    return words[index];	
	};
	
	/**
	 * Returns the # of words in the object, according to RiTa.tokenize().
	 * @return int
	 */
	RiString.prototype.getWordCount = function(){
		return this.getWords().length;
	};
	
	/**
	 *  Returns the array of words in the object, via a call to RiTa.tokenize().
	 *  @return array of strings, one per word
	 */
	RiString.prototype.getWords = function(){
		return RiTa.tokenize(this.text);
//		var rs = [], parts =  RiTa.tokenize(this.text);
//		for ( var i = 0; i < parts.length; i++) 
//			if (!isNull(parts[i])) rs.push(new RiString(parts[i]));
//		return rs;
	};

	/**
	 * 
	 * @param string (Required) The string to search for
	 * @param int (Optional) The start position in the string to start the search. If omitted, the search starts from position 0
	 * @return int the first index of the matching pattern or -1 if none are found
	 */
	RiString.prototype.indexOf = function(searchstring, start){
		return this.text.indexOf(searchstring, start);
	};
	
	/**
	 * Inserts 'newWord' at 'wordIdx'
     * and shifts each subsequent word accordingly. 
	 * @return this RiString
	 */
	RiString.prototype.insertWordAt = function(newWord,wordIdx){
		
	    var words = getWords();
	    if (wordIdx < 0 || wordIdx >= words.length)
	      return false;
	    
	    words[wordIdx] = newWord;
	    
	    setText(join(words, SP));
	    
	    return true;
	};
	
	/**
	 * @param string (Required) The string to search for
	 * @param int (Optional) The start position in the string to start the search. If omitted, the search starts from position 0
	 * @return int the first index of the matching pattern or -1 if none are found
	 * @return int the last index of the matching pattern
	 */
	RiString.prototype.lastIndexOf = function(searchstring, start){
		return this.text.lastIndexOf(searchstring, start);
	};
	
	/**
	 * @return int
	 */
	RiString.prototype.length = function(){
		return this.text.length();
	};
	
	/**
	 * Searches for a match between a substring (or regular expression) and the contained string, 
	 * and replaces the matched substring with a new substring
	 * @return this RiString
	 */
	RiString.prototype.replace = function(substr){
		this.text = this.text.replace(substr);
		return this;
	};
	
	/**
	 * Searches for a match between a substring (or regular expression) and the contained string, 
	 * and returns the matches
	 * @return array of string matches or empty array if none are found
	 */
	RiString.prototype.match = function(substr){
		return this.text.match(substr);
	};
	
	/**
	 * Extracts a part of a string and returns a new string
	 * @param int (Required) The index where to begin the extraction. First character is at index 0
	 * @param int (Optional) Where to end the extraction. If omitted, slice() selects all characters from the begin position to the end of the string
	 * @return this RiString
	 */
	RiString.prototype.slice = function(begin, end){
		this.text = this.text.slice(begin, end);
		return this;
	};
	
	/**
	 * @return this RiString
	 */
	RiString.prototype.replaceAll = function(pattern, replacement){
		this.text = replaceAll(this.text, pattern, replacement);
		return this;
	};
	
	/**
	 * Replaces the character at 'idx' with 'replaceWith'.
	 * If the specified 'idx' is less than xero, or beyond 
	 * the length of the current text, there will be no effect.
	 * 
	 * @param int the character index
	 * @param string the replacement
	 * 
	 * @return this RiString
	 */
	RiString.prototype.replaceCharAt = function(idx, replaceWith)
	{
	      if (idx < 0 || idx >= this.length()) 
	        return false;
	      
	      var s = getText();     
	      var beg = s.substring(0, idx);
	      var end = s.substring(idx+1);
	      var s2 = null;
	      if (!isNull(replaceWith)) 
	        s2 = beg + replaceWith + end;
	      else
	        s2 = beg + end;
	      
	      setText(s2);
	      
	      return this;
	};
	
	/**
	 * Replaces the first instance of 'regex' with 'replaceWith' 
	 * @param regex the pattern
	 * @param strng the replacement
	 * @return this RiString
	 */
	RiString.prototype.replaceFirst = function(regex, replaceWith){
	    setText(this.text.replaceFirst(regex, replaceWith));
	    return this;
	};
	
	/**
	 * Replaces the word at 'wordIdx' with 'newWord'.
	 * @param int the index
	 * @param string the word replacement
	 * @return this RiString
	 */
	RiString.prototype.replaceWordAt = function(wordIdx, newWord){
	    var words = getWords();
	    if (wordIdx >= 0 && wordIdx < words.length)
	    {
	    	words[wordIdx] = newWord;
	    	setText(join(words,SP));
	    }
	    return this;
	};
	
	/**
	 * The split() method is used to split a RiString into an array of sub-RiStrings strings, and returns the new array.
	 * 
	 * @param string (Optional) Specifies the character to use for splitting the string. If omitted, the entire string will be returned
	 * @param int (Optional) An integer that specifies the number of splits
	 * 
	 * @return array of RiStrings
	 */
	RiString.prototype.split = function(separator, limit){
		var parts =  this.text.split(from,to);
		var rs = [];
		for ( var i = 0; i < parts.length; i++) {
			if (!isNull(parts[i])) rs.push(parts[i]);
		}
		return rs;
	};
	
	/**
	 * @return boolean
	 */
	RiString.prototype.startsWith = function(substr){
		return startsWith(this.text, substr);
	};
	
	/**
	 * Extracts the characters from this objects contained string, beginning at "start" and continuing 
	 *  through the specified number of characters, and sets the current text to be that string.
     *
	 * @param int (required) The index where to start the extraction. First character is at index 0
	 * @param int (optional) The index where to stop the extraction. If omitted, it extracts the rest of the string
	 * 
	 * @return this RiString
	 */
	RiString.prototype.substr = function(start,length){
		this.text = this.text.substr(start,length);
		return this;
	};
	
	/**
	 * Extracts the characters from a string, between two specified indices, and sets the current text to be that string
	 * @param int (required) The index where to start the extraction. First character is at index 0
	 * @param int (optional) The index where to stop the extraction. If omitted, it extracts the rest of the string
	 * @return this RiString
	 */
	RiString.prototype.substring = function(from,to){
		this.text = this.text.substring(from,to);
		return this;
	};
	
	/**
	 * 
	 * @return an array of RiStrings with each letter as its own RiString element
	 */
	RiString.prototype.toCharArray = function(){
		var parts =  this.text.split(".");
		var rs = [];
		for ( var i = 0; i < parts.length; i++) {
			if (!isNull(parts[i])) rs.push(parts[i]);
		}
		return rs;
	};
	
	/**
	 * @return this RiString
	 */
	RiString.prototype.toLowerCase = function(){
		this.text = this.text.toLowercase();
		return this;
	};
	
	/**
	 * @return string
	 */
	RiString.prototype.toString = function(){
		return this.text;
	};
	
	/**          
	 * Returns true if and only if this string contains the specified sequence of char values.
	 * @param string text to be checked
	 * @return boolean 
	 */
	RiString.prototype.contains = function(string){
		return this.indexOf(string) > -1;
	};
	
	/**
	 * @return this RiString
	 */
	RiString.prototype.toUpperCase = function(){
		this.text = this.text.toUppercase();
		return this;
	};
	
	/**
	 * @return this RiString 
	 */
	RiString.prototype.trim = function(){
		this.text = trim(this.text);
		return this;		
	};
	
	/**
	 * Returns true if and only if the contained string matches 'pattern'
	 * @param RegExp object or string regular expression
	 * @return boolean true if matched 
	 */
	RiString.regexMatch = function(pattern){
		if (isNull(pattern)) return false;
		if (typeof pattern === 'string')
			pattern = new RegExp(pattern);
		return this.text.test(pattern);		
	};
	
	/**
	 * Replaces matches of 'pattern' in the contained text with 'replacement', then returns the RiString
	 * @param RegExp object or string regular expression
	 * @param string the replacement
	 * @return this RiString
	 */
	RiString.regexReplace = function(pattern, replacement){
		if (isNull(pattern)) return false;
		if (typeof pattern === 'string')
			pattern = new RegExp(pattern);
		this.text = this.text.replace(pattern, replacement);
		return this;
	};
	
	
	// RegexRule object (note: doesn't use makeclass() for now)...
	
	var RegexRule = function(regex, offset, suffix) {
		this.init(regex, offset, suffix);
	};
	
    RegexRule.prototype = {
		init : function(regex, offset, suffix) {
		        this.regex = new RegExp(regex);
		        this.offset = offset;
		        this.suffix = suffix;
		},
        applies : function(word) {
            return this.regex.test(trim(word));
        },
        fire : function(word) {
            return this.truncate(trim(word)) + this.suffix;
        },
        analyze : function(word) {
            return ((suffix != "") && endsWith(word, suffix)) ? true : false;
        },
        truncate : function(word) {
            return (this.offset == 0) ? word : word.substr(0, word.length - this.offset);
        }
    };
	
	//////////////////////////////////////////////////////////////
	//  RiTa object
	//////////////////////////////////////////////////////////////
    
	var RiTa = (function() {

		var SP = " ", E = "";
		
		// ///////////////
		// private functions
		// ///////////////
		
		function isNull(obj) {
			return (typeof obj === 'undefined' || obj === null);
		}

		function error(msg) {
			throw Error("[RiTa] " + msg);
		}

		function log(msg) {
			console.log("[RiTa] " + msg);
		}

		function strOk(str) {
			return (typeof str === 'string' && str.length > 0);
		}
	    
		function trim(str) {
	        return str.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
	    }
	    
		function inArray(array, val) {
	        var i = array.length;
	        while (i--) {
	            if (array[i] == val) {
	                return true;
	            }
	        }
	        return false;
	    }
	    
		function replaceAll(theText, replace, withThis) {

			if (typeof theText !== 'string') // for debugging
			throw new Error(theText + " is not a string!");
			return theText.replace(new RegExp(replace, 'g'), withThis);
		}

		function endsWith(str, ending) { // test this!!!
			return (str.match(ending + "$") == ending);
		}

		function equalsIgnoreCase(str1, str2) {

			return (str1.toLowerCase() == str2.toLowerCase());
		}
		

		//////////////////////////////////////////////////////////////
		// private constants
		//////////////////////////////////////////////////////////////
	    

	    var DEFAULT_PLURAL_RULE =  new RegexRule("^((\\w+)(-\\w+)*)(\\s((\\w+)(-\\w+)*))*$", 0, "s");

	    var PLURAL_RULES = [
            new RegexRule("^(piano|photo|solo|ego|tobacco|cargo|golf|grief)$", 0, "s"),
            new RegexRule("^(wildlife)$", 0, "s"),
            new RegexRule("[bcdfghjklmnpqrstvwxyz]o$", 0, "es"),
            new RegexRule("[bcdfghjklmnpqrstvwxyz]y$", 1, "ies"),
            new RegexRule("([zsx]|ch|sh)$", 0, "es"),
            new RegexRule("[lraeiou]fe$", 2, "ves"),
            new RegexRule("[lraeiou]f$", 1, "ves"),
            new RegexRule("(eu|eau)$", 0, "x"),
            new RegexRule("(man|woman)$", 2, "en"),
            new RegexRule("money$", 2, "ies"),
            new RegexRule("person$", 4, "ople"),
            new RegexRule("motif$", 0, "s"),
            new RegexRule("^meninx|phalanx$", 1, "ges"),
            new RegexRule("(xis|sis)$", 2, "es"),
            new RegexRule("schema$", 0, "ta"),
            new RegexRule("^bus$", 0, "ses"),
            new RegexRule("child$", 0, "ren"),
            new RegexRule("^(curi|formul|vertebr|larv|uln|alumn|signor|alg)a$", 0, "e"),
            new RegexRule("^corpus$", 2, "ora"),
            new RegexRule("^(maharaj|raj|myn|mull)a$", 0, "hs"),
            new RegexRule("^aide-de-camp$", 8, "s-de-camp"),
            new RegexRule("^apex|cortex$", 2, "ices"),
            new RegexRule("^weltanschauung$", 0, "en"),
            new RegexRule("^lied$", 0, "er"),
            new RegexRule("^tooth$", 4, "eeth"),
            new RegexRule("^[lm]ouse$", 4, "ice"),
            new RegexRule("^foot$", 3, "eet"),
            new RegexRule("femur", 2, "ora"),
            new RegexRule("goose", 4, "eese"),
            new RegexRule("(human|german|roman)$", 0, "s"),
            new RegexRule("(crisis)$", 2, "es"),
            new RegexRule("^(monarch|loch|stomach)$", 0, "s"),
            new RegexRule("^(taxi|chief|proof|ref|relief|roof|belief)$", 0, "s"),
            new RegexRule("^(co|no)$", 0, "'s"),
            new RegexRule("^(memorandum|bacterium|curriculum|minimum|" + "maximum|referendum|spectrum|phenomenon|criterion)$", 2, "a"),
            new RegexRule("^(appendix|index|matrix)", 2, "ices"),
            new RegexRule("^(stimulus|alumnus)$", 2, "i"),
            new RegexRule("^(Bantu|Bengalese|Bengali|Beninese|Boche|bonsai|" + "Burmese|Chinese|Congolese|Gabonese|Guyanese|Japanese|Javanese|"
                    + "Lebanese|Maltese|Olympics|Portuguese|Senegalese|Siamese|Singhalese|" + "Sinhalese|Sioux|Sudanese|Swiss|Taiwanese|Togolese|Vietnamese|aircraft|"
                    + "anopheles|apparatus|asparagus|barracks|bellows|bison|bluefish|bob|bourgeois|" + "bream|brill|butterfingers|carp|catfish|chassis|clothes|chub|cod|codfish|"
                    + "coley|contretemps|corps|crawfish|crayfish|crossroads|cuttlefish|dace|dice|" + "dogfish|doings|dory|downstairs|eldest|earnings|economics|electronics|finnan|"
                    + "firstborn|fish|flatfish|flounder|fowl|fry|fries|works|globefish|goldfish|" + "grand|gudgeon|gulden|haddock|hake|halibut|headquarters|herring|hertz|horsepower|"
                    + "goods|hovercraft|hundredweight|ironworks|jackanapes|kilohertz|kurus|kwacha|ling|lungfish|"
                    + "mackerel|means|megahertz|moorfowl|moorgame|mullet|nepalese|offspring|pampas|parr|(pants$)|"
                    + "patois|pekinese|penn'orth|perch|pickerel|pike|pince-nez|plaice|precis|quid|rand|"
                    + "rendezvous|revers|roach|roux|salmon|samurai|series|seychelles|seychellois|shad|"
                    + "sheep|shellfish|smelt|spacecraft|species|starfish|stockfish|sunfish|superficies|"
                    + "sweepstakes|swordfish|tench|tennis|tope|triceps|trout|tuna|tunafish|tunny|turbot|trousers|"
                    + "undersigned|veg|waterfowl|waterworks|waxworks|whiting|wildfowl|woodworm|" + "yen|aries|pisces|forceps|lieder|jeans|physics|mathematics|news|odds|politics|remains|"
                    + "surroundings|thanks|statistics|goods|aids)$", 0, "", 0) 
            
            ];
    
    var ANY_STEM = "^((\\w+)(-\\w+)*)(\\s((\\w+)(-\\w+)*))*$",
    CONS = "[bcdfghjklmnpqrstvwxyz]",
    VERBAL_PREFIX = "((be|with|pre|un|over|re|mis|under|out|up|fore|for|counter|co|sub)(-?))",

    AUXILIARIES = [ "do", "have", "be" ],
    MODALS = [ "shall", "would", "may", "might", "ought", "should" ], // also
    
    // used by pluralizer
    SYMBOLS = [ "!", "?", "$", "%", "*", "+", "-", "=" ],

    ING_FORM_RULES = [ new RegexRule(this.CONS + "ie$", 2, "ying", 1), new RegexRule("[^ie]e$", 1, "ing", 1), new RegexRule("^bog-down$", 5, "ging-down", 0),
            new RegexRule("^chivy$", 1, "vying", 0), new RegexRule("^gen-up$", 3, "ning-up", 0), new RegexRule("^trek$", 1, "cking", 0), new RegexRule("^ko$", 0, "'ing", 0),
            new RegexRule("^(age|be)$", 0, "ing", 0), new RegexRule("(ibe)$", 1, "ing", 0) ],

    PAST_PARTICIPLE_RULES = [
            new RegexRule("e$", 0, "d", 1),
            new RegexRule(this.CONS + "y$", 1, "ied", 1),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(bring)$", 3, "ought", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(take|rise|strew|blow|draw|drive|know|give|" + "arise|gnaw|grave|grow|hew|know|mow|see|sew|throw|prove|saw|quartersaw|"
                    + "partake|sake|shake|shew|show|shrive|sightsee|strew|strive)$", 0, "n", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?[gd]o$", 0, "ne", 1),
            new RegexRule("^(beat|eat|be|fall)$", 0, "en", 0),
            new RegexRule("^(have)$", 2, "d", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?bid$", 0, "den", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?[lps]ay$", 1, "id", 1),
            new RegexRule("^behave$", 0, "d", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?have$", 2, "d", 1),
            new RegexRule("(sink|slink|drink)$", 3, "unk", 0),
            new RegexRule("(([sfc][twlp]?r?|w?r)ing|hang)$", 3, "ung", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(shear|swear|bear|wear|tear)$", 3, "orn", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(bend|spend|send|lend)$", 1, "t", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(weep|sleep|sweep|creep|keep$)$", 2, "pt", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(sell|tell)$", 3, "old", 0),
            new RegexRule("^(outfight|beseech)$", 4, "ought", 0),
            new RegexRule("^bethink$", 3, "ought", 0),
            new RegexRule("^buy$", 2, "ought", 0),
            new RegexRule("^aby$", 1, "ought", 0),
            new RegexRule("^tarmac", 0, "ked", 0),
            new RegexRule("^abide$", 3, "ode", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(speak|(a?)wake|break)$", 3, "oken", 0),
            new RegexRule("^backbite$", 1, "ten", 0),
            new RegexRule("^backslide$", 1, "den", 0),
            new RegexRule("^become$", 3, "ame", 0),
            new RegexRule("^begird$", 3, "irt", 0),
            new RegexRule("^outlie$", 2, "ay", 0),
            new RegexRule("^rebind$", 3, "ound", 0),
            new RegexRule("^relay$", 2, "aid", 0),
            new RegexRule("^shit$", 3, "hat", 0),
            new RegexRule("^bereave$", 4, "eft", 0),
            new RegexRule("^foreswear$", 3, "ore", 0),
            new RegexRule("^overfly$", 1, "own", 0),
            new RegexRule("^beget$", 2, "otten", 0),
            new RegexRule("^begin$", 3, "gun", 0),
            new RegexRule("^bestride$", 1, "den", 0),
            new RegexRule("^bite$", 1, "ten", 0),
            new RegexRule("^bleed$", 4, "led", 0),
            new RegexRule("^bog-down$", 5, "ged-down", 0),
            new RegexRule("^bind$", 3, "ound", 0),
            new RegexRule("^(.*)feed$", 4, "fed", 0),
            new RegexRule("^breed$", 4, "red", 0),
            new RegexRule("^brei", 0, "d", 0),
            new RegexRule("^bring$", 3, "ought", 0),
            new RegexRule("^build$", 1, "t", 0),
            new RegexRule("^come", 0, "", 0),
            new RegexRule("^catch$", 3, "ught", 0),
            new RegexRule("^chivy$", 1, "vied", 0),
            new RegexRule("^choose$", 3, "sen", 0),
            new RegexRule("^cleave$", 4, "oven", 0),
            new RegexRule("^crossbreed$", 4, "red", 0),
            new RegexRule("^deal", 0, "t", 0),
            new RegexRule("^dow$", 1, "ught", 0),
            new RegexRule("^dream", 0, "t", 0),
            new RegexRule("^dig$", 3, "dug", 0),
            new RegexRule("^dwell$", 2, "lt", 0),
            new RegexRule("^enwind$", 3, "ound", 0),
            new RegexRule("^feel$", 3, "elt", 0),
            new RegexRule("^flee$", 2, "ed", 0),
            new RegexRule("^floodlight$", 5, "lit", 0),
            new RegexRule("^fly$", 1, "own", 0),
            new RegexRule("^forbear$", 3, "orne", 0),
            new RegexRule("^forerun$", 3, "ran", 0),
            new RegexRule("^forget$", 2, "otten", 0),
            new RegexRule("^fight$", 4, "ought", 0),
            new RegexRule("^find$", 3, "ound", 0),
            new RegexRule("^freeze$", 4, "ozen", 0),
            new RegexRule("^gainsay$", 2, "aid", 0),
            new RegexRule("^gin$", 3, "gan", 0),
            new RegexRule("^gen-up$", 3, "ned-up", 0),
            new RegexRule("^ghostwrite$", 1, "ten", 0),
            new RegexRule("^get$", 2, "otten", 0),
            new RegexRule("^grind$", 3, "ound", 0),
            new RegexRule("^hacksaw", 0, "n", 0),
            new RegexRule("^hear", 0, "d", 0),
            new RegexRule("^hold$", 3, "eld", 0),
            new RegexRule("^hide$", 1, "den", 0),
            new RegexRule("^honey$", 2, "ied", 0),
            new RegexRule("^inbreed$", 4, "red", 0),
            new RegexRule("^indwell$", 3, "elt", 0),
            new RegexRule("^interbreed$", 4, "red", 0),
            new RegexRule("^interweave$", 4, "oven", 0),
            new RegexRule("^inweave$", 4, "oven", 0),
            new RegexRule("^ken$", 2, "ent", 0),
            new RegexRule("^kneel$", 3, "elt", 0),
            new RegexRule("^lie$", 2, "ain", 0),
            new RegexRule("^leap$", 0, "t", 0),
            new RegexRule("^learn$", 0, "t", 0),
            new RegexRule("^lead$", 4, "led", 0),
            new RegexRule("^leave$", 4, "eft", 0),
            new RegexRule("^light$", 5, "lit", 0),
            new RegexRule("^lose$", 3, "ost", 0),
            new RegexRule("^make$", 3, "ade", 0),
            new RegexRule("^mean", 0, "t", 0),
            new RegexRule("^meet$", 4, "met", 0),
            new RegexRule("^misbecome$", 3, "ame", 0),
            new RegexRule("^misdeal$", 2, "alt", 0),
            new RegexRule("^mishear$", 1, "d", 0),
            new RegexRule("^mislead$", 4, "led", 0),
            new RegexRule("^misunderstand$", 3, "ood", 0),
            new RegexRule("^outbreed$", 4, "red", 0),
            new RegexRule("^outrun$", 3, "ran", 0),
            new RegexRule("^outride$", 1, "den", 0),
            new RegexRule("^outshine$", 3, "one", 0),
            new RegexRule("^outshoot$", 4, "hot", 0),
            new RegexRule("^outstand$", 3, "ood", 0),
            new RegexRule("^outthink$", 3, "ought", 0),
            new RegexRule("^outgo$", 2, "went", 0),
            new RegexRule("^overbear$", 3, "orne", 0),
            new RegexRule("^overbuild$", 3, "ilt", 0),
            new RegexRule("^overcome$", 3, "ame", 0),
            new RegexRule("^overfly$", 2, "lew", 0),
            new RegexRule("^overhear$", 2, "ard", 0),
            new RegexRule("^overlie$", 2, "ain", 0),
            new RegexRule("^overrun$", 3, "ran", 0),
            new RegexRule("^override$", 1, "den", 0),
            new RegexRule("^overshoot$", 4, "hot", 0),
            new RegexRule("^overwind$", 3, "ound", 0),
            new RegexRule("^overwrite$", 1, "ten", 0),
            new RegexRule("^run$", 3, "ran", 0),
            new RegexRule("^rebuild$", 3, "ilt", 0),
            new RegexRule("^red$", 3, "red", 0),
            new RegexRule("^redo$", 1, "one", 0),
            new RegexRule("^remake$", 3, "ade", 0),
            new RegexRule("^rerun$", 3, "ran", 0),
            new RegexRule("^resit$", 3, "sat", 0),
            new RegexRule("^rethink$", 3, "ought", 0),
            new RegexRule("^rewind$", 3, "ound", 0),
            new RegexRule("^rewrite$", 1, "ten", 0),
            new RegexRule("^ride$", 1, "den", 0),
            new RegexRule("^reeve$", 4, "ove", 0),
            new RegexRule("^sit$", 3, "sat", 0),
            new RegexRule("^shoe$", 3, "hod", 0),
            new RegexRule("^shine$", 3, "one", 0),
            new RegexRule("^shoot$", 4, "hot", 0),
            new RegexRule("^ski$", 1, "i'd", 0),
            new RegexRule("^slide$", 1, "den", 0),
            new RegexRule("^smite$", 1, "ten", 0),
            new RegexRule("^seek$", 3, "ought", 0),
            new RegexRule("^spit$", 3, "pat", 0),
            new RegexRule("^speed$", 4, "ped", 0),
            new RegexRule("^spellbind$", 3, "ound", 0),
            new RegexRule("^spoil$", 2, "ilt", 0),
            new RegexRule("^spotlight$", 5, "lit", 0),
            new RegexRule("^spin$", 3, "pun", 0),
            new RegexRule("^steal$", 3, "olen", 0),
            new RegexRule("^stand$", 3, "ood", 0),
            new RegexRule("^stave$", 3, "ove", 0),
            new RegexRule("^stride$", 1, "den", 0),
            new RegexRule("^strike$", 3, "uck", 0),
            new RegexRule("^stick$", 3, "uck", 0),
            new RegexRule("^swell$", 3, "ollen", 0),
            new RegexRule("^swim$", 3, "wum", 0),
            new RegexRule("^teach$", 4, "aught", 0),
            new RegexRule("^think$", 3, "ought", 0),
            new RegexRule("^tread$", 3, "odden", 0),
            new RegexRule("^typewrite$", 1, "ten", 0),
            new RegexRule("^unbind$", 3, "ound", 0),
            new RegexRule("^underbuy$", 2, "ought", 0),
            new RegexRule("^undergird$", 3, "irt", 0),
            new RegexRule("^undergo$", 1, "one", 0),
            new RegexRule("^underlie$", 2, "ain", 0),
            new RegexRule("^undershoot$", 4, "hot", 0),
            new RegexRule("^understand$", 3, "ood", 0),
            new RegexRule("^unfreeze$", 4, "ozen", 0),
            new RegexRule("^unlearn", 0, "t", 0),
            new RegexRule("^unmake$", 3, "ade", 0),
            new RegexRule("^unreeve$", 4, "ove", 0),
            new RegexRule("^unstick$", 3, "uck", 0),
            new RegexRule("^unteach$", 4, "aught", 0),
            new RegexRule("^unthink$", 3, "ought", 0),
            new RegexRule("^untread$", 3, "odden", 0),
            new RegexRule("^unwind$", 3, "ound", 0),
            new RegexRule("^upbuild$", 1, "t", 0),
            new RegexRule("^uphold$", 3, "eld", 0),
            new RegexRule("^upheave$", 4, "ove", 0),
            new RegexRule("^waylay$", 2, "ain", 0),
            new RegexRule("^whipsaw$", 2, "awn", 0),
            new RegexRule("^withhold$", 3, "eld", 0),
            new RegexRule("^withstand$", 3, "ood", 0),
            new RegexRule("^win$", 3, "won", 0),
            new RegexRule("^wind$", 3, "ound", 0),
            new RegexRule("^weave$", 4, "oven", 0),
            new RegexRule("^write$", 1, "ten", 0),
            new RegexRule("^trek$", 1, "cked", 0),
            new RegexRule("^ko$", 1, "o'd", 0),
            new RegexRule("^win$", 2, "on", 0),
            // Null past forms
            new RegexRule("^" + this.VERBAL_PREFIX + "?(cast|thrust|typeset|cut|bid|upset|wet|bet|cut|" + "hit|hurt|inset|let|cost|burst|beat|beset|set|upset|hit|offset|put|quit|"
                    + "wed|typeset|wed|spread|split|slit|read|run|shut|shed)$", 0, "", 0) ],

    PAST_TENSE_RULES = [
            new RegexRule("^(reduce)$", 0, "d", 0),
            new RegexRule("e$", 0, "d", 1),
            new RegexRule("^" + this.VERBAL_PREFIX + "?[pls]ay$", 1, "id", 1),
            new RegexRule(this.CONS + "y$", 1, "ied", 1),
            new RegexRule("^(fling|cling|hang)$", 3, "ung", 0),
            new RegexRule("(([sfc][twlp]?r?|w?r)ing)$", 3, "ang", 1),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(bend|spend|send|lend|spend)$", 1, "t", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?lie$", 2, "ay", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(weep|sleep|sweep|creep|keep)$", 2, "pt", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?(sell|tell)$", 3, "old", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?do$", 1, "id", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?dig$", 2, "ug", 0),
            new RegexRule("^behave$", 0, "d", 0),
            new RegexRule("^(have)$", 2, "d", 0),
            new RegexRule("(sink|drink)$", 3, "ank", 0),
            new RegexRule("^swing$", 3, "ung", 0),
            new RegexRule("^be$", 2, "was", 0),
            new RegexRule("^outfight$", 4, "ought", 0),
            new RegexRule("^tarmac", 0, "ked", 0),
            new RegexRule("^abide$", 3, "ode", 0),
            new RegexRule("^aby$", 1, "ought", 0),
            new RegexRule("^become$", 3, "ame", 0),
            new RegexRule("^begird$", 3, "irt", 0),
            new RegexRule("^outlie$", 2, "ay", 0),
            new RegexRule("^rebind$", 3, "ound", 0),
            new RegexRule("^shit$", 3, "hat", 0),
            new RegexRule("^bereave$", 4, "eft", 0),
            new RegexRule("^foreswear$", 3, "ore", 0),
            new RegexRule("^bename$", 3, "empt", 0),
            new RegexRule("^beseech$", 4, "ought", 0),
            new RegexRule("^bethink$", 3, "ought", 0),
            new RegexRule("^bleed$", 4, "led", 0),
            new RegexRule("^bog-down$", 5, "ged-down", 0),
            new RegexRule("^buy$", 2, "ought", 0),
            new RegexRule("^bind$", 3, "ound", 0),
            new RegexRule("^(.*)feed$", 4, "fed", 0),
            new RegexRule("^breed$", 4, "red", 0),
            new RegexRule("^brei$", 2, "eid", 0),
            new RegexRule("^bring$", 3, "ought", 0),
            new RegexRule("^build$", 3, "ilt", 0),
            new RegexRule("^come$", 3, "ame", 0),
            new RegexRule("^catch$", 3, "ught", 0),
            new RegexRule("^clothe$", 5, "lad", 0),
            new RegexRule("^crossbreed$", 4, "red", 0),
            new RegexRule("^deal$", 2, "alt", 0),
            new RegexRule("^dow$", 1, "ught", 0),
            new RegexRule("^dream$", 2, "amt", 0),
            new RegexRule("^dwell$", 3, "elt", 0),
            new RegexRule("^enwind$", 3, "ound", 0),
            new RegexRule("^feel$", 3, "elt", 0),
            new RegexRule("^flee$", 3, "led", 0),
            new RegexRule("^floodlight$", 5, "lit", 0),
            new RegexRule("^arise$", 3, "ose", 0),
            new RegexRule("^eat$", 3, "ate", 0),
            new RegexRule("^awake$", 3, "oke", 0),
            new RegexRule("^backbite$", 4, "bit", 0),
            new RegexRule("^backslide$", 4, "lid", 0),
            new RegexRule("^befall$", 3, "ell", 0),
            new RegexRule("^begin$", 3, "gan", 0),
            new RegexRule("^beget$", 3, "got", 0),
            new RegexRule("^behold$", 3, "eld", 0),
            new RegexRule("^bespeak$", 3, "oke", 0),
            new RegexRule("^bestride$", 3, "ode", 0),
            new RegexRule("^betake$", 3, "ook", 0),
            new RegexRule("^bite$", 4, "bit", 0),
            new RegexRule("^blow$", 3, "lew", 0),
            new RegexRule("^bear$", 3, "ore", 0),
            new RegexRule("^break$", 3, "oke", 0),
            new RegexRule("^choose$", 4, "ose", 0),
            new RegexRule("^cleave$", 4, "ove", 0),
            new RegexRule("^countersink$", 3, "ank", 0),
            new RegexRule("^drink$", 3, "ank", 0),
            new RegexRule("^draw$", 3, "rew", 0),
            new RegexRule("^drive$", 3, "ove", 0),
            new RegexRule("^fall$", 3, "ell", 0),
            new RegexRule("^fly$", 2, "lew", 0),
            new RegexRule("^flyblow$", 3, "lew", 0),
            new RegexRule("^forbid$", 2, "ade", 0),
            new RegexRule("^forbear$", 3, "ore", 0),
            new RegexRule("^foreknow$", 3, "new", 0),
            new RegexRule("^foresee$", 3, "saw", 0),
            new RegexRule("^forespeak$", 3, "oke", 0),
            new RegexRule("^forego$", 2, "went", 0),
            new RegexRule("^forgive$", 3, "ave", 0),
            new RegexRule("^forget$", 3, "got", 0),
            new RegexRule("^forsake$", 3, "ook", 0),
            new RegexRule("^forspeak$", 3, "oke", 0),
            new RegexRule("^forswear$", 3, "ore", 0),
            new RegexRule("^forgo$", 2, "went", 0),
            new RegexRule("^fight$", 4, "ought", 0),
            new RegexRule("^find$", 3, "ound", 0),
            new RegexRule("^freeze$", 4, "oze", 0),
            new RegexRule("^give$", 3, "ave", 0),
            new RegexRule("^geld$", 3, "elt", 0),
            new RegexRule("^gen-up$", 3, "ned-up", 0),
            new RegexRule("^ghostwrite$", 3, "ote", 0),
            new RegexRule("^get$", 3, "got", 0),
            new RegexRule("^grow$", 3, "rew", 0),
            new RegexRule("^grind$", 3, "ound", 0),
            new RegexRule("^hear$", 2, "ard", 0),
            new RegexRule("^hold$", 3, "eld", 0),
            new RegexRule("^hide$", 4, "hid", 0),
            new RegexRule("^honey$", 2, "ied", 0),
            new RegexRule("^inbreed$", 4, "red", 0),
            new RegexRule("^indwell$", 3, "elt", 0),
            new RegexRule("^interbreed$", 4, "red", 0),
            new RegexRule("^interweave$", 4, "ove", 0),
            new RegexRule("^inweave$", 4, "ove", 0),
            new RegexRule("^ken$", 2, "ent", 0),
            new RegexRule("^kneel$", 3, "elt", 0),
            new RegexRule("^^know$$", 3, "new", 0),
            new RegexRule("^leap$", 2, "apt", 0),
            new RegexRule("^learn$", 2, "rnt", 0),
            new RegexRule("^lead$", 4, "led", 0),
            new RegexRule("^leave$", 4, "eft", 0),
            new RegexRule("^light$", 5, "lit", 0),
            new RegexRule("^lose$", 3, "ost", 0),
            new RegexRule("^make$", 3, "ade", 0),
            new RegexRule("^mean$", 2, "ant", 0),
            new RegexRule("^meet$", 4, "met", 0),
            new RegexRule("^misbecome$", 3, "ame", 0),
            new RegexRule("^misdeal$", 2, "alt", 0),
            new RegexRule("^misgive$", 3, "ave", 0),
            new RegexRule("^mishear$", 2, "ard", 0),
            new RegexRule("^mislead$", 4, "led", 0),
            new RegexRule("^mistake$", 3, "ook", 0),
            new RegexRule("^misunderstand$", 3, "ood", 0),
            new RegexRule("^outbreed$", 4, "red", 0),
            new RegexRule("^outgrow$", 3, "rew", 0),
            new RegexRule("^outride$", 3, "ode", 0),
            new RegexRule("^outshine$", 3, "one", 0),
            new RegexRule("^outshoot$", 4, "hot", 0),
            new RegexRule("^outstand$", 3, "ood", 0),
            new RegexRule("^outthink$", 3, "ought", 0),
            new RegexRule("^outgo$", 2, "went", 0),
            new RegexRule("^outwear$", 3, "ore", 0),
            new RegexRule("^overblow$", 3, "lew", 0),
            new RegexRule("^overbear$", 3, "ore", 0),
            new RegexRule("^overbuild$", 3, "ilt", 0),
            new RegexRule("^overcome$", 3, "ame", 0),
            new RegexRule("^overdraw$", 3, "rew", 0),
            new RegexRule("^overdrive$", 3, "ove", 0),
            new RegexRule("^overfly$", 2, "lew", 0),
            new RegexRule("^overgrow$", 3, "rew", 0),
            new RegexRule("^overhear$", 2, "ard", 0),
            new RegexRule("^overpass$", 3, "ast", 0),
            new RegexRule("^override$", 3, "ode", 0),
            new RegexRule("^oversee$", 3, "saw", 0),
            new RegexRule("^overshoot$", 4, "hot", 0),
            new RegexRule("^overthrow$", 3, "rew", 0),
            new RegexRule("^overtake$", 3, "ook", 0),
            new RegexRule("^overwind$", 3, "ound", 0),
            new RegexRule("^overwrite$", 3, "ote", 0),
            new RegexRule("^partake$", 3, "ook", 0),
            new RegexRule("^" + this.VERBAL_PREFIX + "?run$", 2, "an", 0),
            new RegexRule("^ring$", 3, "ang", 0),
            new RegexRule("^rebuild$", 3, "ilt", 0),
            new RegexRule("^red", 0, "", 0),
            new RegexRule("^reave$", 4, "eft", 0),
            new RegexRule("^remake$", 3, "ade", 0),
            new RegexRule("^resit$", 3, "sat", 0),
            new RegexRule("^rethink$", 3, "ought", 0),
            new RegexRule("^retake$", 3, "ook", 0),
            new RegexRule("^rewind$", 3, "ound", 0),
            new RegexRule("^rewrite$", 3, "ote", 0),
            new RegexRule("^ride$", 3, "ode", 0),
            new RegexRule("^rise$", 3, "ose", 0),
            new RegexRule("^reeve$", 4, "ove", 0),
            new RegexRule("^sing$", 3, "ang", 0),
            new RegexRule("^sink$", 3, "ank", 0),
            new RegexRule("^sit$", 3, "sat", 0),
            new RegexRule("^see$", 3, "saw", 0),
            new RegexRule("^shoe$", 3, "hod", 0),
            new RegexRule("^shine$", 3, "one", 0),
            new RegexRule("^shake$", 3, "ook", 0),
            new RegexRule("^shoot$", 4, "hot", 0),
            new RegexRule("^shrink$", 3, "ank", 0),
            new RegexRule("^shrive$", 3, "ove", 0),
            new RegexRule("^sightsee$", 3, "saw", 0),
            new RegexRule("^ski$", 1, "i'd", 0),
            new RegexRule("^skydive$", 3, "ove", 0),
            new RegexRule("^slay$", 3, "lew", 0),
            new RegexRule("^slide$", 4, "lid", 0),
            new RegexRule("^slink$", 3, "unk", 0),
            new RegexRule("^smite$", 4, "mit", 0),
            new RegexRule("^seek$", 3, "ought", 0),
            new RegexRule("^spit$", 3, "pat", 0),
            new RegexRule("^speed$", 4, "ped", 0),
            new RegexRule("^spellbind$", 3, "ound", 0),
            new RegexRule("^spoil$", 2, "ilt", 0),
            new RegexRule("^speak$", 3, "oke", 0),
            new RegexRule("^spotlight$", 5, "lit", 0),
            new RegexRule("^spring$", 3, "ang", 0),
            new RegexRule("^spin$", 3, "pun", 0),
            new RegexRule("^stink$", 3, "ank", 0),
            new RegexRule("^steal$", 3, "ole", 0),
            new RegexRule("^stand$", 3, "ood", 0),
            new RegexRule("^stave$", 3, "ove", 0),
            new RegexRule("^stride$", 3, "ode", 0),
            new RegexRule("^strive$", 3, "ove", 0),
            new RegexRule("^strike$", 3, "uck", 0),
            new RegexRule("^stick$", 3, "uck", 0),
            new RegexRule("^swim$", 3, "wam", 0),
            new RegexRule("^swear$", 3, "ore", 0),
            new RegexRule("^teach$", 4, "aught", 0),
            new RegexRule("^think$", 3, "ought", 0),
            new RegexRule("^throw$", 3, "rew", 0),
            new RegexRule("^take$", 3, "ook", 0),
            new RegexRule("^tear$", 3, "ore", 0),
            new RegexRule("^transship$", 4, "hip", 0),
            new RegexRule("^tread$", 4, "rod", 0),
            new RegexRule("^typewrite$", 3, "ote", 0),
            new RegexRule("^unbind$", 3, "ound", 0),
            new RegexRule("^unclothe$", 5, "lad", 0),
            new RegexRule("^underbuy$", 2, "ought", 0),
            new RegexRule("^undergird$", 3, "irt", 0),
            new RegexRule("^undershoot$", 4, "hot", 0),
            new RegexRule("^understand$", 3, "ood", 0),
            new RegexRule("^undertake$", 3, "ook", 0),
            new RegexRule("^undergo$", 2, "went", 0),
            new RegexRule("^underwrite$", 3, "ote", 0),
            new RegexRule("^unfreeze$", 4, "oze", 0),
            new RegexRule("^unlearn$", 2, "rnt", 0),
            new RegexRule("^unmake$", 3, "ade", 0),
            new RegexRule("^unreeve$", 4, "ove", 0),
            new RegexRule("^unspeak$", 3, "oke", 0),
            new RegexRule("^unstick$", 3, "uck", 0),
            new RegexRule("^unswear$", 3, "ore", 0),
            new RegexRule("^unteach$", 4, "aught", 0),
            new RegexRule("^unthink$", 3, "ought", 0),
            new RegexRule("^untread$", 4, "rod", 0),
            new RegexRule("^unwind$", 3, "ound", 0),
            new RegexRule("^upbuild$", 3, "ilt", 0),
            new RegexRule("^uphold$", 3, "eld", 0),
            new RegexRule("^upheave$", 4, "ove", 0),
            new RegexRule("^uprise$", 3, "ose", 0),
            new RegexRule("^upspring$", 3, "ang", 0),
            new RegexRule("^go$", 2, "went", 0),
            new RegexRule("^wiredraw$", 3, "rew", 0),
            new RegexRule("^withdraw$", 3, "rew", 0),
            new RegexRule("^withhold$", 3, "eld", 0),
            new RegexRule("^withstand$", 3, "ood", 0),
            new RegexRule("^wake$", 3, "oke", 0),
            new RegexRule("^win$", 3, "won", 0),
            new RegexRule("^wear$", 3, "ore", 0),
            new RegexRule("^wind$", 3, "ound", 0),
            new RegexRule("^weave$", 4, "ove", 0),
            new RegexRule("^write$", 3, "ote", 0),
            new RegexRule("^trek$", 1, "cked", 0),
            new RegexRule("^ko$", 1, "o'd", 0),
            new RegexRule("^bid", 2, "ade", 0),
            new RegexRule("^win$", 2, "on", 0),
            new RegexRule("^swim", 2, "am", 0),
            // Null past forms
            new RegexRule("^" + this.VERBAL_PREFIX + "?(cast|thrust|typeset|cut|bid|upset|wet|bet|cut|hit|hurt|inset|" + "let|cost|burst|beat|beset|set|upset|offset|put|quit|wed|typeset|"
                    + "wed|spread|split|slit|read|run|shut|shed|lay)$", 0, "", 0) ],

    PRESENT_TENSE_RULES = [ new RegexRule("^aby$", 0, "es", 0), new RegexRule("^bog-down$", 5, "s-down", 0), new RegexRule("^chivy$", 1, "vies", 0),
            new RegexRule("^gen-up$", 3, "s-up", 0), new RegexRule("^prologue$", 3, "gs", 0), new RegexRule("^picknic$", 0, "ks", 0), new RegexRule("^ko$", 0, "'s", 0),
            new RegexRule("[osz]$", 0, "es", 1), new RegexRule("^have$", 2, "s", 0), new RegexRule(this.CONS + "y$", 1, "ies", 1), new RegexRule("^be$", 2, "is"),
            new RegexRule("([zsx]|ch|sh)$", 0, "es", 1) ],

    VERB_CONS_DOUBLING = [ "abat", "abet", "abhor", "abut", "accur", "acquit", "adlib", "admit", "aerobat", "aerosol", "agendaset", "allot", "alot", "anagram", "annul", "appal",
            "apparel", "armbar", "aver", "babysit", "airdrop", "appal", "blackleg", "bobsled", "bur", "chum", "confab", "counterplot", "curet", "dib", "backdrop", "backfil", "backflip",
            "backlog", "backpedal", "backslap", "backstab", "bag", "balfun", "ballot", "ban", "bar", "barbel", "bareleg", "barrel", "bat", "bayonet", "becom", "bed", "bedevil", "bedwet",
            "beenhop", "befit", "befog", "beg", "beget", "begin", "bejewel", "bemedal", "benefit", "benum", "beset", "besot", "bestir", "bet", "betassel", "bevel", "bewig", "bib", "bid",
            "billet", "bin", "bip", "bit", "bitmap", "blab", "blag", "blam", "blan", "blat", "bles", "blim", "blip", "blob", "bloodlet", "blot", "blub", "blur", "bob", "bodypop", "bog",
            "booby-trap", "boobytrap", "booksel", "bootleg", "bop", "bot", "bowel", "bracket", "brag", "brig", "brim", "bud", "buffet", "bug", "bullshit", "bum", "bun", "bus", "but",
            "cab", "cabal", "cam", "can", "cancel", "cap", "caracol", "caravan", "carburet", "carnap", "carol", "carpetbag", "castanet", "cat", "catcal", "catnap", "cavil", "chan",
            "chanel", "channel", "chap", "char", "chargecap", "chat", "chin", "chip", "chir", "chirrup", "chisel", "chop", "chug", "chur", "clam", "clap", "clearcut", "clip", "clodhop",
            "clog", "clop", "closet", "clot", "club", "co-occur", "co-program", "co-refer", "co-run", "co-star", "cob", "cobweb", "cod", "coif", "com", "combat", "comit", "commit",
            "compel", "con", "concur", "confer", "confiscat", "control", "cop", "coquet", "coral", "corbel", "corral", "cosset", "cotransmit", "councel", "council", "counsel",
            "court-martial", "crab", "cram", "crap", "crib", "crop", "crossleg", "cub", "cudgel", "cum", "cun", "cup", "cut", "dab", "dag", "dam", "dan", "dap", "daysit", "de-control",
            "de-gazet", "de-hul", "de-instal", "de-mob", "de-program", "de-rig", "de-skil", "deadpan", "debag", "debar", "log", "decommit", "decontrol", "defer", "defog", "deg", "degas",
            "deinstal", "demit", "demob", "demur", "den", "denet", "depig", "depip", "depit", "der", "deskil", "deter", "devil", "diagram", "dial", "dig", "dim", "din", "dip", "disbar",
            "disbud", "discomfit", "disembed", "disembowel", "dishevel", "disinter", "dispel", "disprefer", "distil", "dog", "dognap", "don", "doorstep", "dot", "dowel", "drag", "drat",
            "driftnet", "distil", "egotrip", "enrol", "enthral", "extol", "fulfil", "gaffe", "golliwog", "idyl", "inspan", "drip", "drivel", "drop", "drub", "drug", "drum", "dub", "duel",
            "dun", "dybbuk", "earwig", "eavesdrop", "ecolabel", "eitherspigot", "electroblot", "embed", "emit", "empanel", "enamel", "endlabel", "endtrim", "enrol", "enthral",
            "entrammel", "entrap", "enwrap", "equal", "equip", "estop", "exaggerat", "excel", "expel", "extol", "fag", "fan", "farewel", "fat", "featherbed", "feget", "fet", "fib", "fig",
            "fin", "fingerspel", "fingertip", "fit", "flab", "flag", "flap", "flip", "flit", "flog", "flop", "fob", "focus", "fog", "footbal", "footslog", "fop", "forbid", "forget",
            "format", "fortunetel", "fot", "foxtrot", "frag", "freefal", "fret", "frig", "frip", "frog", "frug", "fuel", "fufil", "fulfil", "fullyfit", "fun", "funnel", "fur", "furpul",
            "gab", "gad", "gag", "gam", "gambol", "gap", "garot", "garrot", "gas", "gat", "gel", "gen", "get", "giftwrap", "gig", "gimbal", "gin", "glam", "glenden", "glendin",
            "globetrot", "glug", "glut", "gob", "goldpan", "goostep", "gossip", "grab", "gravel", "grid", "grin", "grip", "grit", "groundhop", "grovel", "grub", "gum", "gun", "gunrun",
            "gut", "gyp", "haircut", "ham", "han", "handbag", "handicap", "handknit", "handset", "hap", "hareleg", "hat", "headbut", "hedgehop", "hem", "hen", "hiccup", "highwal", "hip",
            "hit", "hobnob", "hog", "hop", "horsewhip", "hostel", "hot", "hotdog", "hovel", "hug", "hum", "humbug", "hup", "hushkit", "hut", "illfit", "imbed", "immunblot", "immunoblot",
            "impannel", "impel", "imperil", "incur", "infer", "infil", "inflam", "initial", "input", "inset", "instil", "inter", "interbed", "intercrop", "intercut", "interfer", "instal",
            "instil", "intermit", "japan", "jug", "kris", "manumit", "mishit", "mousse", "mud", "interwar", "jab", "jag", "jam", "jar", "jawdrop", "jet", "jetlag", "jewel", "jib", "jig",
            "jitterbug", "job", "jog", "jog-trot", "jot", "jut", "ken", "kennel", "kid", "kidnap", "kip", "kissogram", "kit", "knap", "kneecap", "knit", "knob", "knot", "kor", "label",
            "lag", "lam", "lap", "lavel", "leafcut", "leapfrog", "leg", "lem", "lep", "let", "level", "libel", "lid", "lig", "lip", "lob", "log", "lok", "lollop", "longleg", "lop",
            "lowbal", "lug", "mackerel", "mahom", "man", "map", "mar", "marshal", "marvel", "mat", "matchwin", "metal", "micro-program", "microplan", "microprogram", "milksop", "mis-cal",
            "mis-club", "mis-spel", "miscal", "mishit", "mislabel", "mit", "mob", "mod", "model", "mohmam", "monogram", "mop", "mothbal", "mug", "multilevel", "mum", "nab", "nag", "nan",
            "nap", "net", "nightclub", "nightsit", "nip", "nod", "nonplus", "norkop", "nostril", "not", "nut", "nutmeg", "occur", "ocur", "offput", "offset", "omit", "ommit", "onlap",
            "out-general", "out-gun", "out-jab", "out-plan", "out-pol", "out-pul", "out-put", "out-run", "out-sel", "outbid", "outcrop", "outfit", "outgas", "outgun", "outhit", "outjab",
            "outpol", "output", "outrun", "outship", "outshop", "outsin", "outstrip", "outswel", "outspan", "overcrop", "pettifog", "photostat", "pouf", "preset", "prim", "pug", "ret",
            "rosin", "outwit", "over-commit", "over-control", "over-fil", "over-fit", "over-lap", "over-model", "over-pedal", "over-pet", "over-run", "over-sel", "over-step", "over-tip",
            "over-top", "overbid", "overcal", "overcommit", "overcontrol", "overcrap", "overdub", "overfil", "overhat", "overhit", "overlap", "overman", "overplot", "overrun", "overshop",
            "overstep", "overtip", "overtop", "overwet", "overwil", "pad", "paintbal", "pan", "panel", "paperclip", "par", "parallel", "parcel", "partiescal", "pat", "patrol", "pedal",
            "peewit", "peg", "pen", "pencil", "pep", "permit", "pet", "petal", "photoset", "phototypeset", "phut", "picket", "pig", "pilot", "pin", "pinbal", "pip", "pipefit", "pipet",
            "pit", "plan", "plit", "plod", "plop", "plot", "plug", "plumet", "plummet", "pod", "policyset", "polyfil", "ponytrek", "pop", "pot", "pram", "prebag", "predistil", "predril",
            "prefer", "prefil", "preinstal", "prep", "preplan", "preprogram", "prizewin", "prod", "profer", "prog", "program", "prop", "propel", "pub", "pummel", "pun", "pup", "pushfit",
            "put", "quarel", "quarrel", "quickskim", "quickstep", "quickwit", "quip", "quit", "quivertip", "quiz", "rabbit", "rabit", "radiolabel", "rag", "ram", "ramrod", "rap", "rat",
            "ratecap", "ravel", "re-admit", "re-cal", "re-cap", "re-channel", "re-dig", "re-dril", "re-emit", "re-fil", "re-fit", "re-flag", "re-format", "re-fret", "re-hab", "re-instal",
            "re-inter", "re-lap", "re-let", "re-map", "re-metal", "re-model", "re-pastel", "re-plan", "re-plot", "re-plug", "re-pot", "re-program", "re-refer", "re-rig", "re-rol",
            "re-run", "re-sel", "re-set", "re-skin", "re-stal", "re-submit", "re-tel", "re-top", "re-transmit", "re-trim", "re-wrap", "readmit", "reallot", "rebel", "rebid", "rebin",
            "rebut", "recap", "rechannel", "recommit", "recrop", "recur", "recut", "red", "redril", "refer", "refit", "reformat", "refret", "refuel", "reget", "regret", "reinter",
            "rejig", "rekit", "reknot", "relabel", "relet", "rem", "remap", "remetal", "remit", "remodel", "reoccur", "rep", "repel", "repin", "replan", "replot", "repol", "repot",
            "reprogram", "rerun", "reset", "resignal", "resit", "reskil", "resubmit", "retransfer", "retransmit", "retro-fit", "retrofit", "rev", "revel", "revet", "rewrap", "rib",
            "richochet", "ricochet", "rid", "rig", "rim", "ringlet", "rip", "rit", "rival", "rivet", "roadrun", "rob", "rocket", "rod", "roset", "rot", "rowel", "rub", "run", "runnel",
            "rut", "sab", "sad", "sag", "sandbag", "sap", "scab", "scalpel", "scam", "scan", "scar", "scat", "schlep", "scrag", "scram", "shall", "sled", "smut", "stet", "sulfuret",
            "trepan", "unrip", "unstop", "whir", "whop", "wig", "scrap", "scrat", "scrub", "scrum", "scud", "scum", "scur", "semi-control", "semi-skil", "semi-skim", "semiskil",
            "sentinel", "set", "shag", "sham", "shed", "shim", "shin", "ship", "shir", "shit", "shlap", "shop", "shopfit", "shortfal", "shot", "shovel", "shred", "shrinkwrap", "shrivel",
            "shrug", "shun", "shut", "side-step", "sideslip", "sidestep", "signal", "sin", "sinbin", "sip", "sit", "skid", "skim", "skin", "skip", "skir", "skrag", "slab", "slag", "slam",
            "slap", "slim", "slip", "slit", "slob", "slog", "slop", "slot", "slowclap", "slug", "slum", "slur", "smit", "snag", "snap", "snip", "snivel", "snog", "snorkel", "snowcem",
            "snub", "snug", "sob", "sod", "softpedal", "son", "sop", "spam", "span", "spar", "spat", "spiderweb", "spin", "spiral", "spit", "splat", "split", "spot", "sprag", "spraygun",
            "sprig", "springtip", "spud", "spur", "squat", "squirrel", "stab", "stag", "star", "stem", "sten", "stencil", "step", "stir", "stop", "storytel", "strap", "strim", "strip",
            "strop", "strug", "strum", "strut", "stub", "stud", "stun", "sub", "subcrop", "sublet", "submit", "subset", "suedetrim", "sum", "summit", "sun", "suntan", "sup", "super-chil",
            "superad", "swab", "swag", "swan", "swap", "swat", "swig", "swim", "swivel", "swot", "tab", "tag", "tan", "tansfer", "tap", "tar", "tassel", "tat", "tefer", "teleshop",
            "tendril", "terschel", "th'strip", "thermal", "thermostat", "thin", "throb", "thrum", "thud", "thug", "tightlip", "tin", "tinsel", "tip", "tittup", "toecap", "tog", "tom",
            "tomorrow", "top", "tot", "total", "towel", "traget", "trainspot", "tram", "trammel", "transfer", "tranship", "transit", "transmit", "transship", "trap", "travel", "trek",
            "trendset", "trim", "trip", "tripod", "trod", "trog", "trot", "trousseaushop", "trowel", "trup", "tub", "tug", "tunnel", "tup", "tut", "twat", "twig", "twin", "twit",
            "typeset", "tyset", "un-man", "unban", "unbar", "unbob", "uncap", "unclip", "uncompel", "undam", "under-bil", "under-cut", "under-fit", "under-pin", "under-skil", "underbid",
            "undercut", "underlet", "underman", "underpin", "unfit", "unfulfil", "unknot", "unlip", "unlywil", "unman", "unpad", "unpeg", "unpin", "unplug", "unravel", "unrol", "unscrol",
            "unsnap", "unstal", "unstep", "unstir", "untap", "unwrap", "unzip", "up", "upset", "upskil", "upwel", "ven", "verbal", "vet", "victual", "vignet", "wad", "wag", "wainscot",
            "wan", "war", "water-log", "waterfal", "waterfil", "waterlog", "weasel", "web", "wed", "wet", "wham", "whet", "whip", "whir", "whiteskin", "whiz", "whup", "wildcat", "win",
            "windmil", "wit", "woodchop", "woodcut", "wor", "worship", "wrap", "wiretap", "yen", "yak", "yap", "yarnspin", "yip", "yodel", "zag", "zap", "zig", "zig-zag", "zigzag", "zip",
            "ztrip", "hand-bag", "hocus", "hocus-pocus" ],

	PAST_PARTICIPLE_RULESET = {
        name : "PAST_PARTICIPLE",
        defaultRule : new RegexRule(this.ANY_STEM, 0, "ed", 2),
        rules : this.PAST_PARTICIPLE_RULES,
        doubling : false
    },

    PRESENT_PARTICIPLE_RULESET= {
        name : "ING_FORM",
        defaultRule : new RegexRule(this.ANY_STEM, 0, "ing", 2),
        rules : this.ING_FORM_RULES,
        doubling : false
    },

    PAST_TENSE_RULESET = {
        name : "PAST_TENSE",
        defaultRule : new RegexRule(this.ANY_STEM, 0, "ed", 2),
        rules : this.PAST_TENSE_RULES,
        doubling : false
    },

    PRESENT_TENSE_RULESET = {
        name : "PRESENT_TENSE",
        defaultRule : new RegexRule(this.ANY_STEM, 0, "s", 2),
        rules : this.PRESENT_TENSE_RULES,
        doubling : true
    };
    
    
	//////////////////////////////////////////////////////////////
	// private objects
	//////////////////////////////////////////////////////////////
	
	var Analyzer = makeClass();
	var Conjugator = makeClass();
	var PosTagger = makeClass();
	var RegexRule = makeClass();
	
	Analyzer.prototype = {
			
		init : function(id) {this.id = id;}, 
	
		analyze : function(input){
			error("implement me!");
		} 
	};
	
	Conjugator.prototype = {
		
		init : function() {
			
            this.perfect = this.progressive = this.passive = this.interrogative = false;
            this.tense = RiTa.PRESENT_TENSE;
            this.person = RiTa.FIRST_PERSON;
            this.number = RiTa.SINGULAR;
            this.head = "";

		},
		
        // Conjugates the verb based on the current state of the conjugator.

        // !@# Removed (did not translate) incomplete/non-working java
        // implementation of modals handling.
        // !@# TODO: add handling of past tense modals.

    	// TODO: should accept hash of arguments	
        conjugate : function(verb, args) {
        	
            var actualModal = null, // Compute modal -- this affects tense
            conjs = [], frontVG = verb, verbForm, s;

            // arguments
            
            if (args.number) {
                this.number = args.number;
            }
            if (args.person) {
                this.person = args.person;
            }
            if (args.tense) {
                this.tense = args.tense;
            }
            if (args.form) {
                this.form = args.form;
            }
            if (args.passive) {
                this.person = args.passive;
            }
            if (args.progressive) {
                this.progressive = args.progressive;
            }
            if (args.perfect) {
                this.perfect = args.perfect;
            }
            
            // --------------------------------------------------

            if (verb == null || verb.length < 1) {
                error("Make sure to set head verb before calling conjugate()!"); // remove?
            }

            if (this.form == INFINITIVE) {
            	this.actualModal = "to";
            }
            if (this.tense == FUTURE_TENSE) {
            	this.actualModal = "will";
            }

            if (this.passive) {
            	this.conjs.push(this.getPastParticiple(this.frontVG));
            	this.frontVG = "be"; // Conjugatethis.
            }

            if (this.progressive) {
                conjs.push(this.getPresentParticiple(frontVG));
                frontVG = "be"; // Conjugate
            }

            if (this.perfect) {
                conjs.push(this.getPastParticiple(frontVG));
                frontVG = "have";
            }

            if (actualModal) {
                conjs.push(frontVG);
                frontVG = null;
            }

            // Now inflect frontVG (if it exists) and push it on restVG
            if (frontVG) {
                if (this.form == GERUND) {// gerund - use ING form
                    // !@# not yet
                    // implemented!
                    conjs.push(this.getPresentParticiple(frontVG));
                }

                // / when could this happen, examples??? // !@# <--
                // comment from original java. ???
            } else if (this.interrogative && !(verb == "be") && conjs.length == 0) {
                conjs.push(frontVG);

            } else {
                verbForm = this.getVerbForm(frontVG, tense, person, number);
                conjs.push(verbForm);
            }

            // add modal, and we're done
            if (actualModal) {
                conjs.push(actualModal);
            }

            s = trim(conjs.join());

            // !@# test this
            if (endsWith(s, "peted")) error(this.toString());

            return s;
        },

        checkRules : function(ruleSet, verb) {

            var result = null, defaultRule = ruleSet.defaultRule || null, rules = ruleSet.rules, i;

            if (inArray(MODALS, verb)) {
                return verb;
            }

            i = rules.length;
            while (i--) {
                if (rules[i].applies(verb)) {
                    return rules[i].fire(verb);
                }
            }

            if (ruleSet.doubling || inArray(VERB_CONS_DOUBLING, verb)) {
                verb = this.doubleFinalConsonant(verb);
            }
            return defaultRule.fire(verb);
        },

        doubleFinalConsonant : function(word) {
            var letter = word.charAt(word.length - 1);
            return word + letter;
        },

        getPast : function(verb, pers, numb) {

            if (verb.toLowerCase() == "be") {
                switch (numb) {
                case SINGULAR:
                    switch (pers) {
                    case FIRST_PERSON:
                        break;
                    case THIRD_PERSON:
                        return "was";
                    case SECOND_PERSON:
                        return "were";
                    }
                    break;
                case PLURAL:
                    return "were";
                }
            }
            return this.checkRules(PAST_TENSE_RULESET, v);
        },



        getPresent : function(verb, person, number) {

            // Defaults if unset
            if (typeof (person) === 'undefined') {
                person = this.person;
            }
            if (typeof (number) === 'undefined') {
                number = this.number;
            }

            if ((person == THIRD_PERSON) && (number == SINGULAR)) {
                return this.checkRules(PRESENT_TENSE_RULESET, verb);

            } else if (verb == "be") {
                if (number == SINGULAR) {
                    switch (person) {
                    case FIRST_PERSON:
                        return "am";
                        break;
                    case SECOND_PERSON:
                        return "are";
                        break;
                    case THIRD_PERSON:
                        return "is";
                        break;
                    }
                } else {
                    return "are";
                }
            }
            return verb;
        },

        getPresentParticiple : function(verb) {
        	var ifr = ING_FORM_RULES
        	console.log("ifr:"+ifr.length);
        	var ppr = PRESENT_PARTICIPLE_RULESET;
        	console.log("PPR:"+ppr);
        	for (x in ppr) console.log(x+":"+ppr.x);
            return this.checkRules(ppr, verb);
        },
        
        getPastParticiple : function(verb) {
            return this.checkRules(PAST_PARTICIPLE_RULESET, verb);
        },

        getVerbForm : function(verb, tense, person, number) {
            switch (tense) {
            case PRESENT_TENSE:
                return getPresent(verb, person, number);
            case PAST_TENSE:
                return getPast(verb, person, number);
            default:
                return verb;
            }
        },

        // Returns a String representing the current person from one of
        // (first, second, third)
        getPerson : function() {
            return CONJUGATION_NAMES[RC[this.person]];
        },

        // Returns a String representing the current number from one of
        // (singular, plural)
        getNumber : function() {
            return CONJUGATION_NAMES[RC[this.number]];
        },

        // Returns a String representing the current tense from one of
        // (past, present, future)
        getTense : function() {
            return CONJUGATION_NAMES[RC[this.tense]];
        },

        // Returns the current verb
        getVerb : function() {
            return this.head;
        },

        // Returns whether the conjugation will use passive tense
        isPassive : function() {
            return this.passive;
        },
        // Returns whether the conjugation will use perfect tense
        isPerfect : function() {
            return this.perfect;
        },
        // Returns whether the conjugation will use progressive tense
        isProgressive : function() {
            return this.progressive;
        },

        // Sets the person for the conjugation, from one of the
        // constants: [FIRST_PERSON, SECOND_PERSON, THIRD_PERSON]
        setPerson : function(personConstant) {
            this.person = RC[personConstant];
        },

        // Sets the number for the conjugation, from one of the
        // constants: [SINGULAR, PLURAL]
        setNumber : function(numberConstant) {
            this.number = RC[numberConstant];
        },

        // Sets the tense for the conjugation, from one of the
        // constants: [PAST_TENSE, PRESENT_TENSE, FUTURE_TENSE]
        setTense : function(tenseConstant) {
            this.tense = RC[tenseConstant];
        },

        // Sets the verb to be conjugated
        setVerb : function(verb) {
            var v = this.head = verb.toLowerCase();
            if (v === "am" || v === "are" || v === "is" || v === "was" || v === "were") {
                this.head = "be";
            }
        },

        // Sets whether the conjugation should use passive tense
        setPassive : function(bool) {
            this.passive = bool;
        },

        // Sets whether the conjugation should use perfect tense
        setPerfect : function(bool) {
            this.perfect = bool;
        },

        // Sets whether the conjugation should use progressive tense
        setProgressive : function(bool) {
            this.progressive = bool;
        },

        // A human-readable representation of state for logging
        toString : function() {
            return "  ---------------------\n" + "  Passive = " + this.isPassive() + "\n" + "  Perfect = " + this.isPerfect() + "\n" + "  Progressive = " + this.isProgressive() + "\n"
                    + "  ---------------------\n" + "  Number = " + this.getNumber() + "\n" + "  Person = " + this.getPerson() + "\n" + "  Tense = " + this.getTense() + "\n"
                    + "  ---------------------\n";
        },

        // Returns all possible conjugations of the specified verb
        // (contains duplicates) (TODO: remove? not sure about this one)
        conjugateAll : function(verb) {

            var results = [], i, j, k, l, m, n;
            this.setVerb(verb);

            for (i = 0; i < TENSES.length; i++) {
                this.setTense(TENSES[i]);
                for (j = 0; j < NUMBERS.length; j++) {
                    this.setNumber(NUMBERS[j]);
                    for (k = 0; k < PERSONS.length; k++) {
                        this.setPerson(PERSONS[k]);
                        for (l = 0; l < 2; l++) {
                            this.setPassive(l == 0 ? true : false);
                            for (m = 0; m < 2; m++) {
                                this.setProgressive(m == 0 ? true : false);
                                for (n = 0; n < 2; n++) {
                                    this.setPerfect(n == 0 ? true : false);
                                    results.push(this.conjugate(verb));
                                }
                            }
                        }
                    }
                }
            }
            // console.log("all="+results.length);
            return results;
        }
	};
	
	PosTagger.prototype = {
			
		init : function() {
		},
		
		tag : function(input){
			error("implement me!");
		} 
	};
	

		//////////////////////////////////////////////////////////////
		// RiTa implementation
		//////////////////////////////////////////////////////////////
		
		var RiTaImpl = {

			// RiTa constants =================================
			VERSION: 11,
			INTEGER_MAX_VALUE : 2147483647,
			INTEGER_MIN_VALUE : -2147483647,

			// For Conjugator
	        FIRST_PERSON : 0,
	        SECOND_PERSON : 1,
	        THIRD_PERSON : 2,
	        PAST_TENSE : 3,
	        PRESENT_TENSE : 4,
	        FUTURE_TENSE : 5,
	        SINGULAR : 6,
	        PLURAL : 7,
	        
	        NORMAL : 0,
	        INFINITIVE : 1, // The infinitive form - 'to eat an apple'
	        GERUND : 2, // Gerund form of the VP - 'eating an apple'
	        IMPERATIVE : 3, // The imperative form - 'eat an apple!'
	        BARE_INFINITIVE : 4, // Bare infinitive VP - 'eat an apple'
	        SUBJUNCTIVE : 5, // Subjunctive form - 'if I were a rich man'


			// RiTa functions =================================
	        
            getPresentParticiple : function(verb) { // static?
               return Conjugator().getPresentParticiple(verb);
            },
            
            getPastParticiple : function(verb) { // static?
            	return Conjugator().getPastParticiple(verb);
            },
            
            conjugate : function(verb, args) {
            	return Conjugator().conjugate(verb, args);
            },
	        
	        // Pluralizes a word according to pluralization rules (see regexs in constants)
            pluralize : function(word) {

            	if (isNull(word) || !word.length) return [];

                var i, rule, result, rules = PLURAL_RULES;

                if (inArray(MODALS, word.toLowerCase())) {
                    return word;
                }

                i = rules.length;
                while (i--) {
                    rule = rules[i];
                    if (rule.applies(word.toLowerCase())) {
                        return rule.fire(word);
                    }
                }

                return DEFAULT_PLURAL_RULE.fire(word);
            },
            
            // Removes blank space from either side of 'str' 
            trim : function(str) {
            	if (isNull(str)) return "";
                return trim(str); // delegate to private
            },

            // Tokenizes the string according to Penn Treebank conventions
            tokenize : function(words) {
            	
				if (isNull(words) || !words.length) return [];

                words = words.replace(/``/g, "`` ");
                words = words.replace(/''/g, "  ''");
                words = words.replace(/([\\?!\"\\.,;:@#$%&])/g, " $1 ");
                words = words.replace(/\\.\\.\\./g, " ... ");
                words = words.replace(/\\s+/g, SP);
                words = words.replace(/,([^0-9])/g, " , $1");
                words = words.replace(/([^.])([.])([\])}>\"']*)\\s*$/g, "$1 $2$3 ");
                words = words.replace(/([\[\](){}<>])/g, " $1 ");
                words = words.replace(/--/g, " -- ");
                words = words.replace(/$/g, SP);
                words = words.replace(/^/g, SP);
                words = words.replace(/([^'])' /g, "$1 ' ");
                words = words.replace(/'([SMD]) /g, " '$1 ");

                if (SPLIT_CONTRACTIONS) {
                    words = words.replace(/'ll /g, " 'll ");
                    words = words.replace(/'re /g, " 're ");
                    words = words.replace(/'ve /g, " 've ");
                    words = words.replace(/n't /g, " n't ");
                    words = words.replace(/'LL /g, " 'LL ");
                    words = words.replace(/'RE /g, " 'RE ");
                    words = words.replace(/'VE /g, " 'VE ");
                    words = words.replace(/N'T /g, " N'T ");
                }

                words = words.replace(/ ([Cc])annot /g, " $1an not ");
                words = words.replace(/ ([Dd])'ye /g, " $1' ye ");
                words = words.replace(/ ([Gg])imme /g, " $1im me ");
                words = words.replace(/ ([Gg])onna /g, " $1on na ");
                words = words.replace(/ ([Gg])otta /g, " $1ot ta ");
                words = words.replace(/ ([Ll])emme /g, " $1em me ");
                words = words.replace(/ ([Mm])ore'n /g, " $1ore 'n ");
                words = words.replace(/ '([Tt])is /g, " $1 is ");
                words = words.replace(/ '([Tt])was /g, " $1 was ");
                words = words.replace(/ ([Ww])anna /g, " $1an na ");

                // "Nicole I. Kidman" gets tokenized as "Nicole I . Kidman"
                words = words.replace(/ ([A-Z]) \\./g, " $1. ");
                words = words.replace(/\\s+/g, SP);
                words = words.replace(/^\\s+/g, E);

                return trim(words).split(" ");
            },

            // Splits the string into sentences (according to Penn Treebank conventions)
            // TODO: re-implement me

			splitSentences: function(text) {

				if (isNull(text) || !text.length) return [];

				var arr = text.match(/(\S.+?[.!?])(?=\s+|$)/g);

				if (isNull(arr) || arr.length == 0) return [text];

				return arr;
			},

			//////////////////////////////////////////////////////////////
			// RiLexicon 
			//////////////////////////////////////////////////////////////
			RiLexicon: {

				DATA_DELIM: '|',
				STRESSED: '1',
				UNSTRESSED: '0',
				PHONEME_BOUNDARY: '-',
				WORD_BOUNDARY: " ",
				SYLLABLE_BOUNDARY: "/",
				SENTENCE_BOUNDARY: "|",
				VOWELS: "aeiou",

				isVowel: function(p) {

					if (!strOk(p)) return false; // what about 'y'?
					return RiLexicon.VOWELS.indexOf(p.substring(0, 1)) != - 1;
				},

				isConsonant: function(p) {

					if (!strOk(p)) return false;
					return ! this.isVowel(p);
				},

				contains: function(word) {

					if (!strOk(word)) return false;
					return (!isNull(RiTa_DICTIONARY[word]));
				},

				isRhyme: function(word1, word2) {

					if (!strOk(word1) || ! strOk(word2)) return false;
					if (equalsIgnoreCase(word1, word2)) return false;
					var p1 = this.lastStressedPhoneToEnd(word1);
					var p2 = this.lastStressedPhoneToEnd(word2);
					return (strOk(p1) && strOk(p2) && p1 === p2);
				},

				getRhymes: function(word) {

					this.buildWordlist();

					if (this.contains(word)) {

						var p = this.lastStressedPhoneToEnd(word);
						var entry, entryPhones, results = [];

						for (entry in RiTa_DICTIONARY) {
							if (entry === word) continue;
							entryPhones = this.getRawPhones(entry);

							if (strOk(entryPhones) && endsWith(entryPhones, p)) {
								results.push(entry);
							}
						}
						return (results.length > 0) ? results: null; // return null?
					}
					return null; // return null?
				},

				getAlliterations: function(word) {

					if (this.contains(word)) {

						var c2, entry, results = [];
						var c1 = this.firstConsonant(this.firstStressedSyllable(word));

						for (entry in RiTa_DICTIONARY) {
							c2 = this.firstConsonant(this.firstStressedSyllable(entry));
							if (c2 !== null && (c1 === c2)) {
								results.push(entry);
							}
						}
						return (results.length > 0) ? results: null; // return null?
					}
					return null; // return null?
				},

				isAlliteration: function(word1, word2) {

					if (!strOk(word1) || ! strOk(word2)) return false;

					if (equalsIgnoreCase(word1, word2)) return true;

					var c1 = this.firstConsonant(this.firstStressedSyllable(word1));
					var c2 = this.firstConsonant(this.firstStressedSyllable(word2));

					return (strOk(c1) && strOk(c2) && c1 === c2);
				},

				firstStressedSyllable: function(word) {

					var raw = this.getRawPhones(word);
					var idx = - 1,
					c, firstToEnd, result;

					if (!strOk(raw)) return null; // return null?
					idx = raw.indexOf(RiLexicon.STRESSED);

					if (idx < 0) return null; // no stresses...  return null?
					c = raw.charAt(--idx);

					while (c != ' ') {
						if (--idx < 0) {
							// single-stressed syllable
							idx = 0;
							break;
						}
						c = raw.charAt(idx);
					}
					firstToEnd = idx === 0 ? raw: trim(raw.substring(idx));
					idx = firstToEnd.indexOf(' ');

					return idx < 0 ? firstToEnd: firstToEnd.substring(0, idx);
				},

				getSyllables: function(word) {

					var phones, i;
					var raw = this.getRawPhones(word);

					if (!strOk(raw)) return null; // return null?
					raw = raw.replace(/1/g, "");
					phones = raw.split(" ");

					return phones.join(":");
				},

				getPhonemes: function(word) {

					var phones, i;
					var raw = this.getRawPhones(word);

					if (!strOk(raw)) return null; // return null?
					raw = raw.replace(/-/g, " ").replace(/1/g, "");
					phones = raw.split(" ");

					return phones.join(":");
				},

				getStresses: function(word) {
					var stresses = [],
					phones,
					i;
					var raw = this.getRawPhones(word);

					if (!strOk(raw)) return null; // return null?
					phones = raw.split(" ");
					for (i = 0; i < phones.length; i++)
					stresses[i] = (phones[i].indexOf(RiLexicon.STRESSED) > - 1) ? "1": "0";

					return stresses.join(":");
				},

				lookupRaw: function(word) {

					if (!strOk(word)) return null; // return null?
					word = word.toLowerCase();

					this.buildWordlist();

					if (!isNull(RiTa_DICTIONARY[word])) return RiTa_DICTIONARY[word];
					else {
						console.log("[WARN] No lexicon entry for '" + word + "'");
						return null; // return null?
					}
				},

				getRawPhones: function(word) {
					var data = this.lookupRaw(word);
					return (!isNull(data)) ? data[0] : null;
				},

				getPos: function(word) {
					var data = this.lookupRaw(word);
					return (isNull(data)) ? null: data[1]; // return null?
				},

				getPosArr: function(word) {
					var pl = this.getPos(word);
					if (!strOk(pl)) return null; // return null?
					return pl.split(" ");
				},

				firstConsonant: function(rawPhones) {

					if (!strOk(rawPhones)) return null; // return null?
					var phones = rawPhones.split(RiLexicon.PHONEME_BOUNDARY);
					//var phones = rawPhones.split(PHONEME_BOUNDARY);
					if (!isNull(phones)) {
						for (j = 0; j < phones.length; j++) {
							if (this.isConsonant(phones[j])) return phones[j];
						}
					}
					return null; // return null?
				},

				lastStressedPhoneToEnd: function(word) {

					if (!strOk(word)) return null; // return null?
					var idx, c, result;
					var raw = this.getRawPhones(word);

					if (!strOk(raw)) return null; // return null?
					idx = raw.lastIndexOf(RiLexicon.STRESSED);
					if (idx < 0) return null; // return null?
					c = raw.charAt(--idx);
					while (c != '-' && c != ' ') {
						if (--idx < 0) {
							return raw; // single-stressed syllable
						}
						c = raw.charAt(idx);
					}
					result = raw.substring(idx + 1);
					return result;
				},

				// TODO: Re-implement
				getRandomWord: function(pos) {
					/*
	             * var word, found = false, t; if(pos) { pos =
	             * trim(pos.toLowerCase()); for(t in RiLexicon.TAGS){ if
	             * (t[0].toLowerCase === pos) { found = true; } } if(!found) {
	             * throw "RiTa RiLexicon.getRandomWord: POS '" + pos + "'
	             * not valid!"; } } if(pos)
	             */
					this.buildWordlist();
					return RiLexicon.wordlist[Math.floor(Math.random() * RiLexicon.wordlist.length)];
				},

				// TODO: this should be to be automatic
				buildWordlist: function() {

					if (!RiLexicon.wordlist) {

						if (!isNull(RiTa_DICTIONARY)) {
							var msElapsed = Date.now();
							RiLexicon.wordlist = [];
							for (var w in RiTa_DICTIONARY)
							RiLexicon.wordlist.push(w);
							log("Loaded lexicon(#" + RiLexicon.wordlist.length + ") in " + (Date.now() - msElapsed) + " ms");
						}
						else {

							error("RiTa dictionary not found! Make sure to add it to your .html file" +
								", e.g.,\n    <script type=\"text/javascript\" src=\"rita_dict.js\"></script>");

						}
					}

				}
			},

			//////////////////////////////////////////////////////////////
			// RiGrammar 
			//////////////////////////////////////////////////////////////
			RiGrammar: {

			}
		};
		
		return RiTaImpl;
	})();
	

	// makeClass - By John Resig (MIT Licensed)
	function makeClass() {
		
	  return function(args) {
	    if ( this instanceof arguments.callee ) {
	      if ( typeof this.init == "function" ) {
	        this.init.apply( this, args.callee ? args : arguments );
	      }
	    } else {
	    	return new arguments.callee( arguments );
	  	}
	  };
	}
	
	// Expose core RiTa objects to global namespace
	window.RiTa = RiTa;
	window.RiString = RiString;
	window.RiLexicon = RiTa.RiLexicon;
	window.RiGrammar = RiTa.RiGrammar;
	
})(window);

