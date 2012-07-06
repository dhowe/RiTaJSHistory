(function(window, undefined) {
    
    // ////////////////////////////////////////////////////////////
    // RiLexicon
    // ////////////////////////////////////////////////////////////
    
    /**
     * @class
     * @name RiLexicon
     */
    var RiLexicon = makeClass();

    RiLexicon.FEATURE_DELIM = ':';
    
    /** Clear the whole lexicon */
    RiLexicon.clear = function() {
       RiLexicon.wordlist = undefined;
    };
    
    /** member functions */
    RiLexicon.prototype = {

        DATA_DELIM : '|', VOWELS : "aeiou",

        __init__ : function() { 
        	
        	   if (!RiLexicon.wordlist) {
               	
        	       //console.log(typeof RiTa_DICTIONARY);
                   if (typeof RiTa_DICTIONARY != 'undefined') 
                   {
                     if (!RiTa.SILENT) 
                         console.log('[RiTa] Loaded lexicon data...'); // tmp: remove
                     
                   	 RiLexicon.wordlist = RiTa_DICTIONARY;
                   } 
                   else {
               
                       error("Dictionary not found! Make sure to add it to your .html:"
                          + ", e.g.,\n\n    <script src=\"path/to/rita_dict.js\"></script>");
                   }
               }
        }.expects(),
     
        /**
         * Adds a word to the current lexicon (not permanent)
         * 
         * @example lexicon.addWord('abandon','ax-b ae1-n-d ax-n','vb nn vbp');
         * 
         * @param {string} word
         * @param {string} pronunciationData
         * @param {string} posData
         * 
         * @returns {object} this RiLexicon  
         */
        addWord : function(word, pronunciationData, posData) {
            
        	RiLexicon.wordlist[word.toLowerCase()] = [pronunciationData,posData];
            // return RiLexicon.wordlist; NO!
            return this;
            
        }.expects([S,S,S]).returns(O),
        
        /**
         * Removes a word from the current lexicon (not permanent)
         * 
         * @example removeWord('abandon');
         * 
         * @param {string} word
         * @returns {object} this RiLexicon  
         */
        removeWord : function(word) {
            
            delete RiLexicon.wordlist[word];
            // return RiLexicon.wordlist; NO!
            return this;
            
        }.expects([S]).returns(O),
        
        
        /**
         * Compares the characters of the input string  (using a version of the min-edit distance algorithm)
         * to each word in the lexicon, returning the set of closest matches.        
         * 
         * @param {string} word
         * @param {int} minAllowedDist minimum edit distance for matches (optional, default=1)
         * @param {boolean} preserveLength whether to return only words that match the length of the input word (optional, default=true)
         * 
         * @returns {array} matching words 
         */
        similarByLetter : function(input, minAllowedDist, preserveLength) { 
       
        		    var minVal = Number.MAX_VALUE, minLen = 2,  result = []; 
        		    
        		    if (!(input && input.length)) return [];
        		    
        		    input = input.toLowerCase();
        		    minAllowedDist = minAllowedDist || 1;
        		    preserveLength = preserveLength || false;
                	
        		    for (var entry in RiLexicon.wordlist) {
        		    
                      if (preserveLength && entry.length != input.length || entry.length < minLen) 
                          continue; 
       		                
                      entry = entry.toLowerCase();
                      
                      if (entry==input || entry==(input+"s")|| entry==(input+"es")) 
                          continue;
                      
        		      var med = MinEditDist.computeRaw(entry, input);     
        		      
        		      if (med == 0) continue; // same word

        		      // we found something even closer
        		      if (med >= minAllowedDist && med < minVal) {
            		      
        		          minVal = med;
        		          result = [entry];
        		      }  
        		      
        		      // we have another best to add
        		      else if (med == minVal) { 
        		    	  result.push(entry);
        		      }
        		    }        
        		    
        		    return result;
            
        }.expects([S],[S,N],[S,N,B]).returns(A),
        
        /**
         * Compares the phonemes of the input string 
         * (using a version of the min-edit distance algorithm)
         * to each word in the lexicon, returning the set of closest matches.        
         * 
         * @param {string} input
         * @param {number}  minEditDist (optional) minimum edit distance for matches 
         * @returns {array} matching words 
         */
        similarBySound: function(input, minEditDist) { // take options arg instead?
        	 	  
        	    var minVal = Number.MAX_VALUE, entry, result = [], minLen = 2;
        	    
        	    minEditDist = minEditDist || 1;
        	    
        	    var targetPhonesArr = this.getPhonemes(input.toLowerCase()).split("-");

        	    if (targetPhonesArr[0] == null || !(input && input.length)) return [];
       
        	    for (entry in RiLexicon.wordlist) {
        	
        	          if (entry.length < minLen) continue;
        	          
        	          entry = entry.toLowerCase();
            	      
        		      if (entry==input || entry==(input+"s")|| entry==(input+"es")) 
        		    	  continue; 
            		
        		      // NOTE: we don't want to call getPhonemes() here -- too slow //////
            	      //phonesArr = this.getPhonemes(entry).split("-");
        		      
        	          var phones = this.getRawPhones(entry); // use raw instead
        	          
        	          if (!phones.length)  throw Error("Failed lookup (need LTSEngine): "+entry);
        	          
        	          var phonesArr = phones.replace(/1/g, "").replace(/ /g, "-").split('-');
        	          
        	          // /////////////////////////////////////////////////////////////////
              	      
            	      var med = MinEditDist.computeRaw(phonesArr, targetPhonesArr);  

            	      if (med == 0) continue; // same phones 
    
            	      // we found something even closer
            	      if (med >= minEditDist && med < minVal) {
    
            	          minVal = med;
            	          result = [entry];
            	      }  
            	      // we have another best to add
            	      else if (med == minVal) {
            	          result.push(entry);
            	      }
        	    }

        	    return result;
            
        }.expects([S],[S,N]).returns(A),
        
        /**
         * Returns all valid substrings of the input word in the lexicon 
         *
         * @param {string} word
         * @param {number} minLength (optional, default=4) minimum length of return word 
         * @returns {array} matching words 
         */
        substrings: function(word, minLength) { 
            
            minLength = minLength || (minLength === 0) || 4;
            
        	var entry, result =[];
            for  (entry in RiLexicon.wordlist){
            	if(entry == word || entry.length < minLength ) continue;    	
            	if (word.indexOf(entry) >=0) result.push(entry);
            }
            return result;
            
        }.expects([S],[S,N]).returns(A),
        
        /**
         * Returns all valid superstrings of the input word in the lexicon 
         *
         * @param {string} word
         * @returns {array} matching words 
         */
        superstrings: function(word) { 
        	
        	var entry, result =[];
            for  (entry in RiLexicon.wordlist){
            	if(entry == word) continue;
            	if (entry.indexOf(word) >= 0) result.push(entry);
            }
            return result;
        
        }.expects([S]).returns(A),
        
        /**
         * First calls similarBySound(), then filters the result set by the algorithm 
         * used in similarByLetter(); (useful when similarBySound() returns too large a result set)
         * @param {string} word
         * @param {number} minEditDist (optional) minimum edit distance for both matches 
         * @returns {array} matching words 
         */
        similarBySoundAndLetter: function(word, minEditDist) { // take options arg instead?
			
        	var result =[];
			
        	if (isNull(minEditDist)){
        		var simSound = this.similarBySound(word);
				var simLetter = this.similarByLetter(word);
        	} else {
        		var simSound = this.similarBySound(word,minEditDist);
        		var simLetter = this.similarByLetter(word,minEditDist);
        		}

			if (isNull(simSound) || isNull(simLetter)) return result;
			
			for(var i=0; i<simSound.length; i++){
				for(var j=0; j<simLetter.length; j++){
					if(simSound[i] == simLetter[j]) result.push(simLetter[j]);
				}
			}
			return result;
            
        }.expects([S],[S,N]).returns(A),
        
        /**
         * Returns the array of all words in the lexicon or those matching a specific regex. If specified,
         * the order of the result array is randomized before return.
         *  
         * @param {regex} regex (string or object) pattern to match (optional)
         * @param {boolean} randomize randomizes the order (default=false)
         * @returns {array} words in the RiLexicon  
         */
        getWords : function() {
            
        	var a = arguments, randomize = false, regex = undefined,
        	    wordArr = [], words =  Object.keys(RiLexicon.wordlist);
            
        	switch (a.length) {
        	    
            	case 2:
            		
            	    if (getType(a[0]) == 'boolean') {
            			randomize = a[0];
            			regex = (getType(a[1]) == 'regexp') ? a[1] : new RegExp(a[1]);
            		} 
            	    else {
               			randomize = a[1];
            			regex = (getType(a[0]) == 'regexp') ? a[0] : new RegExp(a[0]);
            		};

            		break;
            		
            	case 1:
            	    
            	    //console.log(a[0] + " :: "+getType(a[0]));
            	    
            		if (getType(a[0]) == 'boolean') {
                		return a[0] ? shuffle(words) : Object.keys(words);
            		};
            		
                	regex = (getType(a[0]) == 'regexp') ? a[0] : new RegExp(a[0]);
                	
                	break;
                	
            	case 0:
            	    
            		return shuffle(words);
        	}
        	

        	for (var i = 0; i < words.length; i++) {
        	    
        		if (words[i].match(regex)) {
        		    
        		    wordArr.push(words[i]);
        		}
        	}
        	
        	return randomize ? shuffle(wordArr) : wordArr;
        	
        }.expects([],[S],[B],[S,B],[B,S],[R],[R,B],[B,R]).returns(A),
        
        /**
         * Returns true if c is a vowel
         * @private
         * @param {char} p
         * @returns {boolean}
         */
        isVowel : function(p) {

            return (strOk(p) && this.VOWELS.indexOf(p) > -1);
             
        }.expects([S]).returns(B),

        /**
         * Returns true if c is a consonant
         * @private
         * @param {char} p
         * @returns {boolean}
         */
        isConsonant : function(p) {

            return (typeof p == 'string' && p.length==1 && this.VOWELS.indexOf(p) < 0 && /^[a-z\u00C0-\u00ff]+$/.test(p));
            
        }.expects([S]).returns(B),

        /**
         * Returns true if the word exists in the lexicon
         * @param {string} word
         * @returns {boolean} 
         */
        containsWord : function(word) {

            return (strOk(word) && !isNull(RiLexicon.wordlist[word.toLowerCase()]));
            
        }.expects([S]).returns(B),
        
        /**
         * Returns true if the two words rhyme, that is, if their final stressed phoneme 
         * and all following phonemes are identical, else false.
         * <p>
         * Note: returns false if word1.equals(word2) or if either (or both) are null;
         * <p>
         * Note: at present doesn't use letter-to-sound engine if either word is not found in the lexicon, 
         * but instead just returns false. 
         * 
         * @param {string} word1
         * @param {string} word2
         * 
         * @returns {boolean} true if the two words rhyme, else false.
         */
        isRhyme : function(word1, word2) {

            if ( !strOk(word1) || !strOk(word2) || equalsIgnoreCase(word1, word2))
                return false;
            
            var p1 = this.lastStressedPhoneToEnd(word1), 
                p2 = this.lastStressedPhoneToEnd(word2);
            
            return (strOk(p1) && strOk(p2) && p1 === p2);
            
        }.expects([S,S]).returns(B),

        /**
         * 
         * Two words rhyme if their final stressed vowel and all following phonemes are identical.
         * @param {string} word
         * @returns {array} strings of the rhymes for a given word, or empty array if none are found
         */
        getRhymes : function(word) {

            //this.__buildWordlist__();

            if (this.containsWord(word)) {

                var p = this.lastStressedPhoneToEnd(word);
                var entry, entryPhones, results = [];

                for (entry in RiLexicon.wordlist) {
                    if (entry === word)
                        continue;
                    entryPhones = this.getRawPhones(entry);

                    if (strOk(entryPhones) && endsWith(entryPhones, p)) {
                        results.push(entry);
                    }
                }
                return (results.length > 0) ? results : []; // return null?
            }
            
            return []; // return null?
            
        }.expects([S]).returns(A),

        /**
         * Finds alliterations by comparing the phonemes of the input string to those of each word in the lexicon
         * 
         * @param {string} word input
         * @returns {array} strings of alliterations
         */
        getAlliterations : function(word) {

            if (this.containsWord(word)) {

                var c2, entry, results = [];
                var c1 = this.firstConsonant(this.firstStressedSyllable(word));

                for (entry in RiLexicon.wordlist) {
                    
                    c2 = this.firstConsonant(this.firstStressedSyllable(entry));
                    
                    if (c2 && c1 === c2) {
                        results.push(entry);
                    }
                }
                return (results.length > 0) ? results : []; // return null?
            }
            return []; // return null?
            
        }.expects([S]).returns(A),

        /**
         * Returns true if the first stressed consonant of the two words match, else false.
         * 
         * @param {string} word1
         * @param {string} word2
         * @returns {boolean} true if word1.equals(word2) and false if either (or both) are null;
         */
        isAlliteration : function(word1, word2) {

            if (!strOk(word1) || !strOk(word2)) return false;

            if (equalsIgnoreCase(word1, word2)) return true;

            var c1 = this.firstConsonant(this.firstStressedSyllable(word1)),
                c2 = this.firstConsonant(this.firstStressedSyllable(word2));

            //console.log("'"+c1+"'=?'"+c2+"'");
            
            return (strOk(c1) && strOk(c2) && c1 === c2);
            
        }.expects([S,S]).returns(B),

        /**
         * Returns the first stressed syllable of the input word
         * @private
         * @param {string} word
         * @returns {string}   
         */
        firstStressedSyllable : function(word) {

            var raw = this.getRawPhones(word), idx = -1, c, firstToEnd;

            if (!strOk(raw)) return E; // return null?
            
            idx = raw.indexOf(RiLexicon.STRESSED);

            if (idx < 0) return E; // no stresses... return null?
            
            c = raw.charAt(--idx);

            while (c != ' ') {
                if (--idx < 0) {
                    // single-stressed syllable
                    idx = 0;
                    break;
                }
                c = raw.charAt(idx);
            }
            
            firstToEnd = idx === 0 ? raw : trim(raw.substring(idx));
            idx = firstToEnd.indexOf(' ');

            return idx < 0 ? firstToEnd : firstToEnd.substring(0, idx);
            
        }.expects([S]).returns(S),
        
        /**
         * Returns a String containing the phonemes for each syllable of each word of the input text, 
         * delimited by dashes (phonemes) and semi-colons (words). For example, the 4 syllables of the phrase 
         * 'The dog ran fast' is "dh-ax:d-ao-g:r-ae-n:f-ae-s-t".
         * @private
         * @param {string} word
         * @returns {string} the phonemes for each syllable of each word, or null if no text has been input.
         */
        getSyllables : function(word) {

            if (!word || !word.length) return E; // return null?
            
        	var wordArr = RiTa.tokenize(trim(word)), phones, raw = [];
        	
            for (var i=0; i< wordArr.length; i++) {
                
            	raw[i] = this.getRawPhones(wordArr[i]).replace(/ /g, "/");
        	}
            
        	return joinWords(raw).replace(/1/g, "").trim();
            
        }.expects([S]).returns(S),

        /**
         * Returns a String containing all phonemes for the input text, delimited by semi-colons
         * @example "dh:ax:d:ao:g:r:ae:n:f:ae:s:t"
         * @private
         * @param {string} word
         * @returns {string} all phonemes, or null if no text has been input.
         */
        getPhonemes : function(word) {

            if (!word || !word.length) return E; // return null?

            var wordArr = RiTa.tokenize(trim(word)), raw = [];

            for (var i=0; i< wordArr.length; i++)
            {

                if (RiTa.isPunctuation(wordArr[i])) continue;

                // raw[i] = wordArr[i].length
                raw[i] = this.getRawPhones(wordArr[i]);

                if (!raw[i].length)
                    throw Error("Unable to lookup (need LTSEngine): "+wordArr[i]);

                raw[i] = raw[i].replace(/ /g, "-");
            }

            return joinWords(raw).replace(/1/g, "").trim(); 
            
        }.expects([S]).returns(S),

        /**
         * Returns a String containing the stresses for each syllable of the input text, delimited by semi-colons, 
         * @examlpe "0:1:0:1", with 1's meaning 'stressed', and 0's meaning 'unstressed', 
         * @private
         * @param {string} word
         * @returns {string} stresses for each syllable, or null if no text has been input.
         */
        getStresses : function(word) {

            if (!word || !word.length) return E; // return null?
            
            var wordArr = RiTa.tokenize(trim(word)), stresses = [], phones, raw = [];
            
            for (var i=0; i< wordArr.length; i++) {
                
                if (!RiTa.isPunctuation(wordArr[i]))
                    raw[i] = this.getRawPhones(wordArr[i]);
            }

            for (var i = 0; i < raw.length; i++) {

                if (raw[i]) { // ignore undefined array items (eg Punctuation)
                    
                    phones = raw[i].split(SP);
                    for (var j = 0; j < phones.length; j++) {

                        var isStress = (phones[j].indexOf(RiLexicon.STRESSED) > -1) 
                            ? RiLexicon.STRESSED : RiLexicon.UNSTRESSED;
                        
                        if (j > 0) isStress = "/" + isStress;

                        stresses.push(isStress);          	
                    }
                }
            }
            
            return stresses.join(" ").replace(/ \//g, "/");

        }.expects([S]).returns(S),
        
        /**
         * Returns the raw dictionary data used to create the default lexicon
         * @returns {object} dictionary mapping words to their pronunciation/pos data
         */
        getLexicalData : function() {
            
            return RiLexicon.wordlist;
            
        }.expects().returns(O),
        
        /**
         * Allows one to set the raw dictionary data used to create the default lexicon.
         * See RiLexicon.addWord() for data format
         * 
         * @param {object} dictionaryDataObject mapping words to their pronunciation/pos data
         * @returns {object} this RiLexicon
         */
        setLexicalData : function(dictionaryDataObject) {

        	RiLexicon.wordlist = dictionaryDataObject;
        	
            return RiLexicon.wordlist;
            
        }.expects([O]).returns(O),
        
        /**
         * Returns the raw dictionary entry for the given word (isn't necessary in typical usage) 
         * 
         * @param {string} word
         * @returns {array} a 2-element array of strings, the first is the stress and syllable data, the 2nd is the pos data
         * or [] if not found
         */
        lookupRaw : function(word) { // PRIVATE?

            word = word.toLowerCase();

            if (RiLexicon.wordlist[word]) return RiLexicon.wordlist[word];
            
            console.warn("[RiTa] No lexicon entry for '" + word + "'");
            
            return []; // if private, should return 'undefined'
            
        }.expects([S]).returns(A),

        /**
         * @private
         */
        getRawPhones : function(word) {
            
            var data = this.lookupRaw(word);
            return (data && data.length==2) ? data[0] : E; // TODO: verify 
            
        }.expects([S]).returns(S),

        /**
         * @private
         */
        getPosData : function(word) {
            
            var data = this.lookupRaw(word);
            return (data && data.length==2) ? data[1] : E; // TODO: verify
            
        }.expects([S]).returns(S),

        /**
         * @private
         */
        getPosArr : function(word) { // SHOULD BE PRIVATE
            
            var pl = this.getPosData(word);
            
            if (!strOk(pl)) return []; // TODO: verify 
            
            return pl.split(SP);
            
        }.expects([S]).returns(A),

        /**
         * @private
         */
        firstConsonant : function(rawPhones) {

            if (!strOk(rawPhones)) return E; // return null?
            
            var phones = rawPhones.split(RiLexicon.PHONEME_BOUNDARY);
            // var phones = rawPhones.split(PHONEME_BOUNDARY);
            
            if (!isNull(phones)) {
                
                for (var j = 0; j < phones.length; j++) {
                    //console.log(j+')'+phones[j]);
                    if (this.isConsonant(phones[j].charAt(0))) // first letter only
                        return phones[j];
                }
            }
            return E; // return null?
            
        }.expects([S]).returns(S),
        
        /**
         * @private
         */
        lastStressedPhoneToEnd : function(word) {

            if (!strOk(word)) return E; // return null?
            
            var idx, c, result;
            var raw = this.getRawPhones(word);

            if (!strOk(raw)) return E; // return null?
            
            idx = raw.lastIndexOf(RiLexicon.STRESSED);
            
            if (idx < 0) return E; // return null?
            
            c = raw.charAt(--idx);
            while (c != '-' && c != ' ') {
                if (--idx < 0) {
                    return raw; // single-stressed syllable
                }
                c = raw.charAt(idx);
            }
            result = raw.substring(idx + 1);
            
            return result;
            
        }.expects([S]).returns(S),

        // TODO: Re-implement
        /**
         * Returns a random word from the lexicon
         * 
         * @param {string} pos (optional)
         * @param {string} syllableCount (optional)
         * @returns {string} random word
         */
        getRandomWord : function(pos, syllableCount) {  // should take pos, syllableCount, neither, or both 
            
            var found = false, a = arguments, wordArr = Object.keys(RiLexicon.wordlist),
                ran = Math.floor(Math.random() * Object.keys(RiLexicon.wordlist).length),
                ranWordArr = shuffle(wordArr);
            
        	switch (a.length) {
            	    
            	case 2: //a[0]=pos 	a[1]=syllableCount
            	    
                       	a[0] = trim(a[0].toUpperCase()); 
                       	
        	            for(var j = 0; j < PosTagger.TAGS.length; j++) { 
        	                
        	            	if (PosTagger.TAGS[j] == a[0]) found = true;
        	            } 
        	            
        	            if (found) { 
        	                
        	            	for(var i=0; i< ranWordArr.length; i++){
        	            	    
        	            		var data = this.lookupRaw(ranWordArr[i]);
        	                    var posTag = RiTa.getPosTags(ranWordArr[i]);
        	                    
        	                    if (data[0].split(" ").length == a[1] && a[0] == posTag[0].toUpperCase()) {
        	                    	return ranWordArr[i];
        	                    }
        	                } 
        	            } 
        	            
        	            return E;
        	            
            		break;
            		
            	case 1:
            	    
            		if (getType(a[0]) == 'string') { //pos
            		    
                       	a[0] = trim(a[0].toUpperCase()); 
                       	
        	            for(var j = 0; j < PosTagger.TAGS.length; j++) {
        	                
        	            	if (PosTagger.TAGS[j] == a[0]) found = true;
        	            } 
        	            
        	            if (found) { 
        	                
        	            	for(var i=0; i< ranWordArr.length; i++){
        	            	    
        	                    var posTag = RiTa.getPosTags(ranWordArr[i]);
        	                    
        	                    if (a[0] == posTag[0].toUpperCase()) {
        	                    	return ranWordArr[i];
        	                    }
        	                } 
        	            } 
            		}
            		
            		else { //syllableCount    
            		    
    	            	for(var i=0; i< ranWordArr.length; i++) {
    	            	    
    	                    var data = this.lookupRaw(ranWordArr[i]);
    	                    
    	                    if (data[0].split(" ").length == a[0]) {
    	                        
    	                    	return ranWordArr[i];
    	                    }
    	                } 
            		}
            		
                	break;
                	
            	case 0:
            	    
            		return wordArr[ran];
        	}
        	return E;
        	
        }.expects([S],[],[N],[S,N]).returns(S),
 
    };
    
})(window);

