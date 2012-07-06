
    // ////////////////////////////////////////////////////////////
    // RiTa object (singleton)
    // ////////////////////////////////////////////////////////////
    var RiTa = {

        // RiTa constants =================================
        
        /** The current version of the RiTa tools */

        VERSION : 11,

        INTEGER_MAX_VALUE : 2147483647, // private

        INTEGER_MIN_VALUE : -2147483647, // private

        // For Conjugator =================================
        
        //TODO: add comments
        
        FIRST_PERSON : 0,

        SECOND_PERSON : 1,

        THIRD_PERSON : 2,

        PAST_TENSE : 3,

        PRESENT_TENSE : 4,

        FUTURE_TENSE : 5,

        SINGULAR : 6,

        PLURAL : 7,

        NORMAL : 0,

        /** The infinitive verb form  - 'to eat an apple' */
        INFINITIVE : 1,

        /** Gerund form of a verb  - 'eating an apple' */
        GERUND : 2,

        /** The imperative verb form - 'eat an apple!' */
        IMPERATIVE : 3,

        /** Bare infinitive verb form - 'eat an apple' */
        BARE_INFINITIVE : 4,

        /** The subjunctive verb form */

        SUBJUNCTIVE : 5,
        
        ABBREVIATIONS : [   "Adm." ,"Capt." ,"Cmdr." ,"Col." ,"Dr." ,"Gen." ,"Gov." ,"Lt." ,"Maj." ,"Messrs." ,"Mr.","Mrs." ,"Ms." ,"Prof." ,"Rep." ,"Reps." ,"Rev." ,"Sen." ,"Sens." ,"Sgt." ,"Sr." ,"St.","a.k.a." ,"c.f." ,"i.e." ,"e.g." ,"vs." ,"v.", "Jan." ,"Feb." ,"Mar." ,"Apr." ,"Mar." ,"Jun." ,"Jul." ,"Aug." ,"Sept." ,"Oct." ,"Nov." ,"Dec." ],
                          
        
        // Start Methods =================================
        
        /**
         * Returns true if the tag for 'word' is any variant of a verb in the PENN part-of-speech tag set (e.g. TODO)
         */
        isVerb: function(word) {

            if (word && word.contains(" ")) error("Only accepts a single word"); // TODO: add test

            return RiTa.tagForWordNet(word) === 'v' ;
            
        }.expects([S]).returns(B),
        
        /**
         * Returns true if the tag for 'word' is any variant of a noun in the PENN part-of-speech tag set (e.g. TODO)
         */
        isNoun : function(word) {

            if (word && word.contains(" ")) error("Only accepts a single word"); // TODO: add test

            return RiTa.tagForWordNet(word) === 'n' ;
            
        }.expects([S]).returns(B),
        
        /**
         * Returns true if the tag for 'word' is any variant of a adverb in the PENN part-of-speech tag set (e.g. TODO)
         */
        isAdverb : function(word) {
            
            if (word && word.contains(" ")) error("Only accepts a single word"); // TODO: add test

            return RiTa.tagForWordNet(word) === 'r' ;
            
        }.expects([S]).returns(B),
        
        /**
         * Returns true if the tag for 'word' is any variant of an adjective in the PENN part-of-speech tag set (e.g. TODO)
         */
        isAdjective : function(word) {
            if (word && word.contains(" ")) error("Only accepts a single word"); // TODO: add test
            return RiTa.tagForWordNet(word) === 'a' ;
            
        }.expects([S]).returns(B),
        
        /**
         * Returns true if 'tag' is a valid PENN part-of-speech tag (e.g. TODO)
         */
        isPosTag : function(tag) {
            return PosTagger.isTag(tag);
            
        }.expects([S]).returns(B),
             
        /**
         * Tags the word (as usual) with a part-of-speech from the Penn tagset, 
         * then returns the corresponding part-of-speech for WordNet from the
         * set { 'n', 'v', 'a', 'r' } as a string. 
         * 
         * @param string or array, the text to be tagged
         * 
         * TODO: example
         */
        tagForWordNet  : function(words) {
            
            var posArr = posTag(word);
            if (!isNull(pos) && posArr.length) {
                for ( var i = 0; i < posArr.length; i++) {
                    var pos = posArr[i];
                    if (PosTagger.isNounTag(pos))      posArr[i] =  "n";
                    if (PosTagger.isVerbTag(pos))      posArr[i] =  "v";
                    if (PosTagger.isAdverbTag(pos))    posArr[i] =  "r";
                    if (PosTagger.isAdjectiveTag(pos)) posArr[i] =  "a";
                }
                return posArr;  
            }
            return E; 
            
        }.expects([A],[S]).returns(A),
              
        /**
         * Uses the default PosTagger to tag the input with a tag from the PENN tag set
         * @param string or array, the text to be tagged
         * TODO: example
         */
        posTag : function(words) {    
            
            return PosTagger.tag(words);
            
        }.expects([A],[S]).returns(A),
        
        /**
         * Uses the default PosTagger to tag the input with a tag from the PENN tag set
         * in 'inline' form
         * @param string the text to tag
         * TODO: example
         */
        posTagInline : function(wordswords) { 
            
            return PosTagger.tagInline(words);
            
        }.expects([A],[S]).returns(S),
        
        /**
         * Converts a PENN part-of-speech tag to the simplified WordNet scheme (e.g. TODO)
         * TODO: example
         */
        posToWordNet  : function(tag) {
            
            error("implement me");
            
        }.expects([S]).returns(S),
        

        /**
         *  Returns the present participle form of the stemmed or non-stemmed 'verb'. 
         */
        getPresentParticiple : function(verb) { 
            
            // TODO: need to call stem() and try again if first try fails
            return Conjugator().getPresentParticiple(verb);
            
        }.expects([S]).returns(S),

        /**
         *  Returns the past participle form of the stemmed or non-stemmed 'verb'. 
         */
        getPastParticiple : function(verb) { 
            // TODO: need to call stem() and try again if first try fails
            return Conjugator().getPastParticiple(verb);
            
        }.expects([S]).returns(S),


        /**
         *  Conjugates the 'verb' according to the specified options
         *  @param string the verb stem
         *  @param object containing the relevant options for the conjugator
         *  @return string the conjugated verb
         *   
         *  TODO: 2 examples
         */
        conjugate : function(verb, args) {

            return Conjugator().conjugate(verb, args);
            
        }.expects([S,O]).returns(S),


        /** 
         * Pluralizes a word according to pluralization rules (see regexs in constants)
         * TODO: 2 examples (regular & irregular)
         */
        pluralize : function(word) {

            if (isNull(word) || !word.length)
                return [];

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
            
        }.expects([S]).returns(S),


        /**
         *  Removes blank space from either side of a string
         */
        trim : function(str) {
            
            return trim(str); // delegate to private
            
        }.expects([S]).returns(S),


        /**
         *  Tokenizes the string according to Penn Treebank conventions
         *  See: http://www.cis.upenn.edu/~treebank/tokenization.html
         *  
         *  @param string a sentence
         *  @param (optional) string or Regex - the pattern to be used for tozenization
         *  
         *  @return array - of strings, each element is a single token (or word)
         *    
         *  TODO: 2 examples, one with 1 arg, one with a regex that splits on spaces
         */
        tokenize : function(words, regex) {
            
            if (isNull(words) || !words.length) return [];
            
            if (!isNull(regex)) return words.split(regex);

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

            
            if (false/*SPLIT_CONTRACTIONS*/) {
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

            return trim(words).split(SP);
            
        }.expects([S],[S,O],[S,S]).returns(A),


        /**
         *  Splits the 'text' into sentences (according to PENN Treebank conventions)
         *  @param string - the text to be split
         *  @param (optional) string or Regex - the pattern to be used for tozenization
         *  
         */
        // TODO: test and (probably) re-implement from RiTa (RiSplitter.java)
        splitSentences : function(text, regex) {

            if (isNull(text) || !text.length)
                return [];

            var arr = text.match(/(\S.+?[.!?])(?=\s+|$)/g);

            if (isNull(arr) || arr.length == 0)
                return [ text ];

            return arr;
            
        }.expects([S],[S,O],[S,S]).returns(A),


        /**
         * Returns true if and only if the string matches 'pattern'
         * @param string to test
         * @param string or RegExp object containing regular expression
         * @return boolean true if matched, else false
         */
        regexMatch : function(string, pattern) {
            
            if (isNull(string) || isNull(pattern))
                return false;
            
            if (typeof pattern === 'string')
                pattern = new RegExp(pattern);
            
            return string.test(pattern);
            
        }.expects([S,O],[S,S]).returns(B),

        /**
         * Replaces all matches of 'pattern' in the 'string' with 'replacement'
         * @param string to test
         * @param string or RegExp object containing regular expression
         * @param string the replacement
         * @return the string with replacements or thestring on error
         */
        regexReplace : function(string, pattern, replacement) {
            
            if (isNull(string) || isNull(pattern))
                return E;
            if (typeof pattern === 'string')
                pattern = new RegExp(pattern); // TODO: is this necessary?
            return string.replace(pattern, replacement);
            
        }.expects([S,O,S],[S,S,S]).returns(B),
        
        
        /**
         * 
         */
        isAbbreviation : function(input) {
            
            return arrayContains(ABBREVIATIONS, input);
            
        }.expects([S]).returns(B),
        
        /**
         * 
         */
        isQuestion : function(text) {
            
            error("implement me");
            
        }.expects([S]).returns(B),

        /**
         * 
         */
        isSentenceEnd : function(word) {
            
            error("implement me");
            
        }.expects([S]).returns(B),


        /**
         * 
         */
        isW_Question : function(text) {    
            
            error("implement me");
            
        }.expects([S]).returns(B),

        /**
         * wait on this one...
      
        loadString : function() {    
            
            error("implement me");
            
        }.expects([S]).returns(B),   */

        /**
         * Returns a random ordering of integers from 0..numElements 
         */
        randomOrdering : function(numElements) {    
            
            var o = [];
            for ( var i = 0; i < numElements.length; i++) {
                o.push(i);
            }
            
            // Array shuffle, from Jonas Raoni Soares Silva (http://jsfromhell.com/array/shuffle)
            for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

            return o;
            
        }.expects([N]).returns(A),


        /**
         * Removes and returns a random element from an array, returning
         * it and leaving the array 1 element shorter.
         * @param array
         */
        removeRandom : function(arr) {     
            
            // test me!
            var ord = RiTa.randomOrdering(arr.length);
            var removeIdx = arr[ord[i]];
            return RiTa.remove(removeIdx,removeIdx+1);
            
        }.expects([A]).returns(S),
        

        // PRIVATE: Array Remove - By John Resig (MIT Licensed)
        remove : function(array, from, to) {
          var rest = array.slice((to || from) + 1 || array.length);
          array.length = from < 0 ? array.length + from : from;
          return array.push.apply(array, rest);
        },
        
        /**
         * Strips all punctuation from the given string
         */
        stripPunctuation : function(text) {    
            
            error("implement me");
            
        }.expects([S]).returns(S),

        /**
         * Analyzes the given string, then return the phonemes
         * @param string or array, words to analyze
         * TODO: examples
         */
        getPhonemes : function(words) {
            
            error("implement me");

        }.expects([S],[A]).returns(S),

        /**
         * Analyzes the given string, then return the pos-tags
         * @param string or array, words to analyze
         * TODO: examples
         */
        getPosTags : function(words) {

            error("implement me");

        }.expects([S],[A]).returns(S),

        /**
         * Analyzes the given string, then return the stresses
         * @param string or array, words to analyze
         * TODO: examples
         */
        getStresses : function(words) {
            
            error("implement me");

        }.expects([S],[A]).returns(S),

        /**
         * Analyzes the given string, then return the syllables
         * @param string or array, words to analyze
         * TODO: examples
         */
        getSyllables : function(words) {
            
            error("implement me");

        }.expects([S],[A]).returns(S),
        
        /**
         * 
         */
        getWordCount : function(words) {
            
            error("implement me");

        }.expects([S]).returns(N),
        
        /**
         * Returns the stemmed from of 'verb' according to the RiTa stemming rules
         */
        stem : function(verb) {
            
            error("implement me");

        }.expects([S]).returns(N),

    }; // end RiTa (static) methods