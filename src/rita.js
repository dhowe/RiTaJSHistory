
(function(window, undefined) {
	
	var _VERSION_ = '1.0.29';
	// also update /RiTaLibraryJS/www/download/index.html (TODO: make automatic)

	/**  @private Simple type-checking functions */ 
	var Type = {
		
		N : 'number', S : 'string', O : 'object', A :'array', B : 'boolean', R : 'regexp', F : 'function',
		
		// From: http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/ 
		get : function(obj) {
			
			return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		},
		
		// Returns true if the object is of type 'type', otherwise false
		 
		is : function(obj,type) {
			
			return Type.get(obj) === type;
		},
		
		// Throws TypeError if not the correct type, else returns true
		ok : function(obj,type) {
			
			if (Type.get(obj)!=type) {
				
				throw TypeError('Expected '+(type ? type.toUpperCase() : type+E)
					+ ", but received "+(obj ? Type.get(obj).toUpperCase() : obj+E));
			}
			
			return true;
		}
		
	},  is = Type.is, ok = Type.ok; // alias

	var Easing = {
	
		Linear: {
	
			None: function ( k ) {
	
				return k;
	
			}
	
		},
	
		Quadratic: {
	
			In: function ( k ) {
	
				return k * k;
	
			},
	
			Out: function ( k ) {
	
				return k * ( 2 - k );
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
				return - 0.5 * ( --k * ( k - 2 ) - 1 );
	
			}
	
		},
	
		Cubic: {
	
			In: function ( k ) {
	
				return k * k * k;
	
			},
	
			Out: function ( k ) {
	
				return --k * k * k + 1;
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k + 2 );
	
			}
	
		},
	
		Quartic: {
	
			In: function ( k ) {
	
				return k * k * k * k;
	
			},
	
			Out: function ( k ) {
	
				return 1 - (--k) * k * k * k;
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
				return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
	
			}
	
		},
	
		Quintic: {
	
			In: function ( k ) {
	
				return k * k * k * k * k;
	
			},
	
			Out: function ( k ) {
	
				return --k * k * k * k * k + 1;
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
	
			}
	
		},
	
		Sinusoidal: {
	
			In: function ( k ) {
	
				return 1 - Math.cos( k * Math.PI / 2 );
	
			},
	
			Out: function ( k ) {
	
				return Math.sin( k * Math.PI / 2 );
	
			},
	
			InOut: function ( k ) {
	
				return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
	
			}
	
		},
	
		Exponential: {
	
			In: function ( k ) {
	
				return k === 0 ? 0 : Math.pow( 1024, k - 1 );
	
			},
	
			Out: function ( k ) {
	
				return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
	
			},
	
			InOut: function ( k ) {
	
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
				return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
	
			}
	
		},
	
		Circular: {
	
			In: function ( k ) {
	
				return 1 - Math.sqrt( 1 - k * k );
	
			},
	
			Out: function ( k ) {
	
				return Math.sqrt( 1 - (--k) * k );
	
			},
	
			InOut: function ( k ) {
	
				if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
				return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
	
			}
	
		},
	
		Elastic: {
	
			In: function ( k ) {
	
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
	
			},
	
			Out: function ( k ) {
	
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
	
			},
	
			InOut: function ( k ) {
	
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
				return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
	
			}
	
		},
	
		Back: {
	
			In: function ( k ) {
	
				var s = 1.70158;
				return k * k * ( ( s + 1 ) * k - s );
	
			},
	
			Out: function ( k ) {
	
				var s = 1.70158;
				return --k * k * ( ( s + 1 ) * k + s ) + 1;
	
			},
	
			InOut: function ( k ) {
	
				var s = 1.70158 * 1.525;
				if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
				return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
	
			}
	
		},
	
		Bounce: {
	
			In: function ( k ) {
	
				return 1 - Easing.Bounce.Out( 1 - k );
	
			},
	
			Out: function ( k ) {
	
				if ( k < ( 1 / 2.75 ) ) {
	
					return 7.5625 * k * k;
	
				} else if ( k < ( 2 / 2.75 ) ) {
	
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
	
				} else if ( k < ( 2.5 / 2.75 ) ) {
	
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
	
				} else {
	
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
	
				}
	
			},
	
			InOut: function ( k ) {
	
				if ( k < 0.5 ) return Easing.Bounce.In( k * 2 ) * 0.5;
				return Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
	
			}
		}
	};

	var Interpolation = {
	
		Linear: function ( v, k ) {
	
			var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = Interpolation.Utils.Linear;
	
			if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
			if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );
	
			return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );
	
		},
	
		Bezier: function ( v, k ) {
	
			var b = 0, n = v.length - 1, pw = Math.pow, bn = Interpolation.Utils.Bernstein, i;
	
			for ( i = 0; i <= n; i++ ) {
				b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
			}
	
			return b;
	
		},
	
		CatmullRom: function ( v, k ) {
	
			var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = Interpolation.Utils.CatmullRom;
	
			if ( v[ 0 ] === v[ m ] ) {
	
				if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );
	
				return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );
	
			} else {
	
				if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
				if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );
	
				return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );
	
			}
	
		},
	
		Utils: {
	
			Linear: function ( p0, p1, t ) {
	
				return ( p1 - p0 ) * t + p0;
	
			},
	
			Bernstein: function ( n , i ) {
	
				var fc = Interpolation.Utils.Factorial;
				return fc( n ) / fc( i ) / fc( n - i );
	
			},
	
			Factorial: ( function () {
	
				var a = [ 1 ];
	
				return function ( n ) {
	
					var s = 1, i;
					if ( a[ n ] ) return a[ n ];
					for ( i = n; i > 1; i-- ) s *= i;
					return a[ n ] = s;
	
				};

			} )(),
	
			CatmullRom: function ( p0, p1, p2, p3, t ) {
	
				var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
				return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

			}
		}
	};

	// ////////////////////////////////////////////////////////////
	// RiTa object (singleton)
	// ////////////////////////////////////////////////////////////
	
	/**
	 * @namespace A collection of static variables and functions for the RiTa library
	 */
	RiTa = {

		/** The current version of the RiTa tools */
		VERSION : _VERSION_,

		/** 
		 * a=alpha
		 * b=beta
		 * @private
		 */
		_PHASE : 'a', 

		/** For tokenization, Can't -> Can not, etc. */
		SPLIT_CONTRACTIONS : false,
		
		// :::: For RiTaEvents :::::::::
	
		UNKNOWN : -1, MOVE_TO : 1, COLOR_TO : 2, FADE_IN : 3, FADE_OUT : 4, TEXT_TO : 5, 
		TIMER : 6, SCALE_TO : 7, ROTATE_TO: 8, TEXT_ENTERED : 9, LERP : 10,
	
		// :::: RiText Constants  ::::::::: 

		LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40,  CENTER : 3,
	
		// :::: Animation types :::::::::
	
		LINEAR : Easing.Linear.None, 
		
		EASE_IN :  Easing.Exponential.In,
		EASE_OUT :  Easing.Exponential.Out, 
		EASE_IN_OUT :  Easing.Exponential.InOut,
		
		EASE_IN_EXPO :  Easing.Exponential.In,
		EASE_OUT_EXPO :  Easing.Exponential.Out,
		EASE_IN_OUT_EXPO :  Easing.Exponential.InOut,
		
		EASE_IN_SINE : Easing.Sinusoidal.In,
		EASE_OUT_SINE : Easing.Sinusoidal.Out,
		EASE_IN_OUT_SINE : Easing.Sinusoidal.InOut,
		
		EASE_IN_CUBIC :  Easing.Cubic.In,
		EASE_OUT_CUBIC : Easing.Cubic.Out,
		EASE_IN_OUT_CUBIC :  Easing.Cubic.InOut,
		
		EASE_IN_QUARTIC :  Easing.Quartic.In,
		EASE_OUT_QUARTIC :  Easing.Quartic.Out,
		EASE_IN_OUT_QUARTIC :  Easing.Quartic.InOut,
		
		EASE_IN_QUINTIC : Easing.Quintic.In,
		EASE_OUT_QUINTIC : Easing.Quintic.Out,
		EASE_IN_OUT_QUINTIC : Easing.Quintic.InOut,
		
		BACK_IN : Easing.Back.In,
		BACK_OUT : Easing.Back.Out,
		BACK_IN_OUT : Easing.Back.InOut,
		
		BOUNCE_IN : Easing.Bounce.In,
		BOUNCE_OUT : Easing.Bounce.Out,
		BOUNCE_IN_OUT : Easing.Bounce.InOut,
		
		CIRCULAR_IN : Easing.Circular.In,
		CIRCULAR_OUT : Easing.Circular.Out,
		CIRCULAR_IN_OUT : Easing.Circular.InOut,
		
		ELASTIC_IN : Easing.Elastic.In,
		ELASTIC_OUT : Easing.Elastic.Out,
		ELASTIC_IN_OUT : Easing.Elastic.InOut,

		// For Conjugator =================================
		
		//TODO: add comments
		
		PHONEMES : 'phonemes',
		
		STRESSES : 'stresses',
		
		SYLLABLES : 'syllables',
		
		FIRST_PERSON : 1,

		SECOND_PERSON : 2,

		THIRD_PERSON : 3,

		PAST_TENSE : 4,

		PRESENT_TENSE : 5,

		FUTURE_TENSE : 6,

		SINGULAR : 7,

		PLURAL : 8,

		NORMAL : 9,

		FEATURE_DELIM : ':',
	
		STRESSED : '1',
	
		UNSTRESSED : '0',
	
		PHONEME_BOUNDARY : '-', 
	
		WORD_BOUNDARY : " ", 
	
		SYLLABLE_BOUNDARY : "/", 
	
		SENTENCE_BOUNDARY : "|",
	
		VOWELS : "aeiou",
		
		ABBREVIATIONS : [   "Adm." ,"Capt." ,"Cmdr." ,"Col." ,"Dr." ,"Gen." ,"Gov." ,"Lt." ,"Maj." ,"Messrs." ,"Mr.","Mrs." ,"Ms." ,"Prof." ,"Rep." ,"Reps." ,"Rev." ,"Sen." ,"Sens." ,"Sgt." ,"Sr." ,"St.","a.k.a." ,"c.f." ,"i.e." ,"e.g." ,"vs." ,"v.", "Jan." ,"Feb." ,"Mar." ,"Apr." ,"Mar." ,"Jun." ,"Jul." ,"Aug." ,"Sept." ,"Oct." ,"Nov." ,"Dec." ],

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
 
		/** Set to true to disable all console output */
		SILENT : false,
		
		// Start Methods =================================
		
		/**
		 * Joins array of word, similar to words.join(" "), but attempts to preserve punctuation position
		 * unless the 'adjustPunctuationSpacing' flag is set to false
		 * 
		 * @param {array} arr the array to join
		 * @param {string} delim the characters to place between each array element (optional)
		 * @param {boolean} adjustPunctuationSpacing (optional, default=true)
		 * 
		 * @returns {string} the joined array as string
		 */
		untokenize : function(arr, delim, adjustPunctuationSpacing) {
			 
			delim = delim || SP;
			adjustPunctuationSpacing = adjustPunctuationSpacing || 1;
			
			if (adjustPunctuationSpacing) {
				
				var newStr = arr[0] || E;
				for ( var i = 1; i < arr.length; i++) {
					if (arr[i]) {
						if (!RiTa.isPunctuation(arr[i]))
							newStr += delim;
						newStr += arr[i];
					}
				}
				
				return newStr.trim();
			}
 
			return arr.join(delim);  
		},

		
		/**
		 * Returns a random number between min(default=0) and max(default=1)
		 * @returns {number}
		 */
		random : function() {
			
			var currentRandom = Math.random();
			if (arguments.length === 0) return currentRandom;
			if (arguments.length === 1) return currentRandom * arguments[0];
			var aMin = arguments[0], aMax = arguments[1];
			
			return currentRandom * (aMax - aMin) + aMin;
			
		},
		
		/**
		 * Returns a random item from the array
		 */
		 randomItem : function(arr) {
			
			return arr[Math.floor(Math.random()*arr.length)];
		 }, 
		
		/**
		 * Convenience method to get the distance between 2 points
		 * @param {number} x1
		 * @param {number} y1
		 * @param {number} x2
		 * @param {number} y2
		 * 
		 * @returns {number}
		 */
		distance: function(x1,y1,x2,y2) {
			
			var dx = x1 - x2, dy = y1 - y2;
			return Math.sqrt(dx * dx + dy * dy);
			
		},
		
		/**
		 * Starts a timer that calls 'onRiTaEvent', or the specified callback, 
		 * every 'period' seconds
		 * 
		 * @param {number} period (in seconds)
		 * @param {function} callback called every 'period' seconds (optional)
		 * @returns {number} the unique id for the timer
		 */
		timer: function(period, callback) {
			 
			var a = arguments;
			
			// if 1st arg is an object (e.g., 'this'), ignore it...
			if (a.length && is(a[0], O)) 
				a = Array.prototype.slice.call(a, 1);
			
			if (a.length < 1)
				throw Error("Bad args to RiTa.timer("+a+")");
				
			var callback = a.length > 1 ? a[1] : null;
				
			var timer = new Timer(
				function() {       					
					RiTaEvent(RiTa, 'tick')._fire(callback);  
			}, [a[0]] * 1000, true);
			
			timer.go();
			var id = timer.id(); 
			timers[id] = timer;
			
			return id;
		}, 
		
		/**
		 * Stops a timer according to its unique id
		 * @param {number} the unique id for the timer
		 */
		stopTimer: function(id) { 
			
			if (timers[id])  
				timers[id].stop();
			else
				warn('no timer with id: '+id);
		}, 
		
		/**
		 * Pauses a timer according to its unique id
		 * @param {number} the unique id for the timer
		 * @param {number} pause-time (in seconds) (optional)
		 * @returns {number} the new unique id for the timer
		 */
		 pauseTimer : function(id, pauseSec) {  
			
			pauseSec = is(pauseSec, N) ? pauseSec : Number.MAX_VALUE;
			
			if (timers[id])  {
				timers[id].pause();
				setTimeout(function() { 
					if (timers[id])
						timers[id].play(); 
					else
						warn("no timer!!!");
				}, pauseSec*1000);
			}
			else {
				warn('no timer with id: '+id);
			}
		},   

		/**
		 * Returns true if 'tag' is a valid PENN part-of-speech tag (e.g. cd, fw, jj, ls, nn, sym, vbg, wp)
		 * @param {string} tag the PENN part-of-speech tag
		 * @returns {boolean} true if the tag a valid PENN part-of-speech tag
		 */
		_isPosTag : function(tag) {
			return PosTagger.isTag(tag);
			
		},
			 
		// TODO: example
		/**
		 * Tags the word (as usual) with a part-of-speech from the Penn tagset, 
		 * then returns the corresponding part-of-speech for WordNet from the
		 * set { 'n', 'v', 'a', 'r' } as a string. 
		 * 
		 * @param {string | array} words the text to be tagged
		 * @returns {array} the corresponding parts-of-speech for WordNet
		 */
		_tagForWordNet  : function(words) {
			
			var posArr = RiTa.getPosTags(words);

			if (!undef(words) && posArr.length) {
				for ( var i = 0; i < posArr.length; i++) {
					var pos = posArr[i];
					if (PosTagger.isNoun(pos))      posArr[i] =  "n";
					if (PosTagger.isVerb(pos))      posArr[i] =  "v";
					if (PosTagger.isAdverb(pos))    posArr[i] =  "r";
					if (PosTagger.isAdj(pos))      posArr[i] =  "a";
				}
				return posArr;  
			}
			return EA; 
		},

		//TODO: example
		/**
		 * Uses the default PosTagger to tag the input with a tag from the PENN tag set
		 * @param {string | array} words the text to be tagged
		 * @returns {array}
		 * 
		 */
		getPosTags : function(words) {    
			
			var arr = is(words,S) ? RiTa.tokenize(words) : words;
			return PosTagger.tag(arr);
		},
		
		// TODO: example
		/**
		 * Takes an array of words and of tags and returns a 
		 * combined String of the form:
		 *  <pre>"The/dt doctor/nn treated/vbd dogs/nns"</pre>
		 * assuming a "/" as 'delimiter'.
		 *
		 * @param {string | array} words the text to tag
		 * @returns {string} 
		 */
		getPosTagsInline : function(words, delimiter) { 
			
			if (!words || !words.length) return E;
			
			delimiter = delimiter || '/';
			words = is(words,S) ? RiTa.tokenize(words) : words;
			
			var sb = E, tags = RiTa.getPosTags(words);
			for (var i = 0; i < words.length; i++) {

				sb += (words[i]);
				if (!RiTa.isPunctuation(words[i])) {
					sb +=  delimiter + tags[i];
				}
				sb += SP;
			}
			
			return sb.trim();
		},

		// TODO: example
		
		/**
		 * Converts a PENN part-of-speech tag to the simplified WordNet scheme 
		 * (e.g. nn -> n, nns -> n, vbz -> v, rb -> r)
		 * { "n" (noun), "v"(verb), "a"(adj), "r"(adverb), "-"(other) }
		 * as a String.
		 * 
		 * @param {string} tag pos tag to convert
		 * @returns {string} simplified WordNet tag
		 */
		posToWordNet  : function(tag) {
			
			if (!strOk(tag)) return E;

			if (PosTagger.isNoun(tag))    
				return 'n';
			else if (PosTagger.isVerb(tag))
				return 'v';
			else if (PosTagger.isAdverb(tag))
				return  'r';
			else if (PosTagger.isAdj(tag))
				return  'a';
			else  {
				warn("[WARN] "+tag+" is not a valid pos-tag");
				return  '-';
			}
		},
		
		/**
		 *  Returns the present participle form of the stemmed or non-stemmed 'verb'. 
		 *  @param {string} verb the verb
		 *  @returns {string} the present participle form of the verb
		 */
		getPresentParticiple : function(verb) { 
			
			// TODO: need to call stem() and try again if first try fails
			return Conjugator().getPresentParticiple(verb);
		},

		/**
		 *  Returns the past participle form of the stemmed or non-stemmed 'verb'. 
		 *  @param {string} verb the verb
		 *  @returns {string} the past participle form of the verb
		 */
		getPastParticiple : function(verb) { 
			
			// TODO: need to call stem() and try again if first try fails
			return Conjugator().getPastParticiple(verb);
		},

		// TODO: 2 examples
		/**
		 *  Conjugates the 'verb' according to the specified options
		 *  @param {string} verb the verb stem
		 *  @param {object} args containing the relevant options for the conjugator
		 *  @returns {string}  the conjugated verb
		 */
		conjugate : function(verb, args) {

			return Conjugator().conjugate(verb, args);            
		},

		// TODO: 2 examples (regular & irregular) in javadoc
		
		/** 
		 * Pluralizes a word according to pluralization rules (see regexs in constants)
		 * Returns the regular or irregular plural form of noun.       
		 * 
		 * @param {string} word the noun
		 * 
		 * @returns {string} the plural form of noun
		 */
		pluralize : function(word) {

			if (!strOk(word)) return E;
			
			var i, rule, rules = PLURAL_RULES;

			if (inArray(MODALS, word.toLowerCase())) {
				return word;
			}

			for (var i = 0; i < rules.length; i++) {
				rule = rules[i];
				if (rule.applies(word.toLowerCase())) {
					return rule.fire(word);
				}
			}

			return DEFAULT_PLURAL_RULE.fire(word);            
		},
		
		// TODO: 2 examples (regular & irregular) in javadoc        

		/**
		 *
		 * Singularize a word according to singularization rules (see regexs in constants)
		 * @param {string} word the noun
		 * @returns {string}  the singular form of noun
		 */ 
		singularize : function(word) {

			if (!strOk(word)) return E;

			var i, rule, rules = SINGULAR_RULES;

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

			
			return this.stem(word, 'Pling');
		},


		/**
		 *  Removes blank space from either side of a string
		 *
		 *  @param {string} the input string
		 *  
		 *  @returns {string}  
		 */
		trim : function(str) {
			
			return trim(str); // delegate to private
		},

	
		/**
		 *  Tokenizes the string according to Penn Treebank conventions
		 *  See: http://www.cis.upenn.edu/~treebank/tokenization.html
		 *  
		 *  @param {string} words a sentence
		 *  @param {string | regex} regex (optional) the pattern to be used for tozenization
		 *  
		 *  @returns {array} strings, which each element is a single token (or word) 
		 */
		tokenize : function(words, regex) {
			
			//TODO: 2 examples for doc comment, one with 1 arg, one with 2 (a regex that splits on spaces)

			if (regex) return words.split(regex);
			
			words = trim(words).replace(/``/g, "`` ");
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
 
			if (RiTa.SPLIT_CONTRACTIONS) { // SAVE
				words = words.replace(/'ll /g, " 'll "); 
				words = words.replace(/'re /g, " 're "); 
				words = words.replace(/'ve /g, " have ");
				words = words.replace(/n't /g, " not "); 
				
				words = words.replace(/'LL /g, " 'LL "); 
				words = words.replace(/'RE /g, " 'RE "); 
				words = words.replace(/'VE /g, " 'VE "); 
				words = words.replace(/N'T /g, " N'T "); 
			}
			
			words = words.replace(/ ([Cc])an't /g, " $1an not ");
			words = words.replace(/ ([Cc])annot /g, " $1an not ");
			words = words.replace(/ ([Dd])idn't /g, " $1id not ");
			words = words.replace(/ ([CcWw])ouldn't /g, " $1ould not ");
			

			// "Nicole I. Kidman" gets tokenized as "Nicole I . Kidman"
			words = words.replace(/ ([A-Z]) \\./g, " $1. ");
			words = words.replace(/\\s+/g, SP);
			words = words.replace(/^\\s+/g, E);
			
			return trim(words).split(/\s+/); // DCH: fixed bug here, 6/3/12
		},

		
		// TODO: test and (probably) re-implement from RiTa (RiSplitter.java)
		/**
		 *  Splits the 'text' into sentences (according to PENN Treebank conventions)
		 *  
		 *  @param {string} text the text to be split
		 *  @param {string | regex} regex (optional) the pattern to be used for tozenization
		 *  
		 *  @returns {array} of sentences 
		 */
		splitSentences : function(text, regex) {

			var arr = text.match(/(\S.+?[.!?])(?=\s+|$)/g);

			return (text.length && arr && arr.length) ? arr : [ text ];
			
		},

		/**
		 * Returns true if and only if the string matches 'pattern'
		 * 
		 * @param {string} string string to test
		 * @param {string | regex} pattern object containing regular expression
		 * @returns {boolean} true if matched, else false
		 */
		_regexMatch : function(string, pattern) {
			
			if (undef(string) || undef(pattern))
				return false;
			
			if (typeof pattern === S)
				pattern = new RegExp(pattern);
			
			return pattern.test(string);
			
		},

		/**
		 * Replaces all matches of 'pattern' in the 'string' with 'replacement'
		 * 
		 * @param {string} string to test
		 * @param {string | regex } pattern object containing regular expression
		 * @param {string} replacement the replacement
		 * @returns {string} with replacements or thestring on error
		 */
		_regexReplace : function(string, pattern, replacement) {
			
			if (undef(string) || undef(pattern))
				return E;
			if (typeof pattern === S)
				pattern = new RegExp(pattern); // TODO: is this necessary?
			return string.replace(pattern, replacement);
			
		},
			 
		/**
		 * Returns true if 'input' is an abbreviation
		 * 
		 * @param {string} input
		 * @param {boolean} caseSensitive (optional, default=false)
		 * 
		 * @returns {boolean} true if 'input' is an abbreviation
		 */
		isAbbreviation : function(input, caseSensitive) {
			
			caseSensitive = caseSensitive || false;
			input = caseSensitive ? input : RiTa._titleCase(input);
			return inArray(this.ABBREVIATIONS, input);
			
		},
		
		/**
		 * Returns true if sentence starts with a question word.
		 * 
		 * @param {string} sentence
		 * 
		 * @returns {boolean} true if 'sentence' starts with a question word.
		 */
		isQuestion : function(sentence) {
			
			var sentenceArr = RiTa.tokenize((sentence));
			
			for (var i = 0; i < QUESTION_STARTS.length; i++) {
				
				if (equalsIgnoreCase(sentenceArr[0], QUESTION_STARTS[i]))
					return true;
			}
			return false;
			
		},

		/**
		 * Returns true if 'currentWord' is the final word of a sentence.
		 * This is a simplified version of the OAK/JET sentence splitter method.
		 * 
		 * @param {string} currentWord
		 * @param {string} nextWord
		 * @returns {boolean} true if 'currentWord' is the final word of a sentence.
		 */
		isSentenceEnd : function(currentWord, nextWord) {

			if ( !is(currentWord,S) || !is(nextWord,S) )
				return false;
			
			var cw = currentWord.charAt(0), cWL = currentWord.length; 
			
			// token is a mid-sentence abbreviation (mainly, titles) --> middle of sent
			if (RiTa.isAbbreviation(currentWord))
				return false;
			
			if (cWL > 1 && cw.indexOf("`'\"([{<") != -1 && RiTa.isAbbreviation(currentWord.substring(1)))
				return false;
		
			if (cWL > 2 && ((currentWord.charAt(0) == '\'' && currentWord.charAt(1) == '\'') || (currentWord.charAt(0) == '`' && currentWord.charAt(1) == '`')) && RiTa.isAbbreviation(currentWord.substring(2)))
			{
				return false;
			}
			
			var nTL = nextWord.length,
				currentToken0 = currentWord.charAt(cWL - 1), 
				currentToken1 = (cWL > 1) ? currentWord.charAt(cWL - 2) : ' ', 
				currentToken2 = (cWL > 2) ? currentWord.charAt(cWL - 3) : ' ',
				nextToken0 = nextWord.charAt(0), 
				nextToken1 = (nTL > 1) ? nextWord.charAt(1) : ' ',
				nextToken2 = (nTL > 2) ? nextWord.charAt(2) : ' ';
		
			// nextToken does not begin with an upper case,
			// [`'"([{<] + upper case, `` + upper case, or < -> middle of sent.
			if (!  (nextToken0 == nextToken0.toUpperCase()
				|| (nextToken1 == nextToken1.toUpperCase() && nextToken0.indexOf("`'\"([{<") != -1)
				|| (nextToken2 == nextToken2.toUpperCase() && ((nextToken0 == '`' && nextToken1 == '`') 
				|| (nextToken0 == '\'' && nextToken1 == '\'')))
				||  nextWord == "_" || nextToken0 == '<'))
			  return false;
		
			// ends with ?, !, [!?.]["'}>)], or [?!.]'' -> end of sentence
			if (currentToken0 == '?'
				|| currentToken0 == '!'
				|| (currentToken1.indexOf("?!.") != -1 && currentToken0.indexOf("\"'}>)") != -1)
				|| (currentToken2.indexOf("?!.") != -1 && currentToken1 == '\'' && currentToken0 == '\''))
			return true;

			// last char not "." -> middle of sentence
			if (currentToken0 != '.') return false;
		
			// Note: wont handle Q. / A. at start of sentence, as in a news wire
			//if (startOfSentence && (currentWord.equalsIgnoreCase("Q.") 
			  //|| currentWord.equalsIgnoreCase("A.")))return true; 
			
			// single upper-case alpha + "." -> middle of sentence
			if (cWL == 2 && currentToken1 == currentToken1.toUpperCase())
				return false;
		
			// double initial (X.Y.) -> middle of sentence << added for ACE
			if (cWL == 4 && currentToken2 == '.'&& (currentToken1 == currentToken1.toUpperCase() && currentWord.charAt(0) == currentWord.charAt(0).toUpperCase() ))
				return false;
		
			// U.S. or U.N. -> middle of sentence
			//if (currentToken.equals("U.S.") || currentToken.equals("U.N."))
			  //return false; // dch
			  
			//if (Util.isAbbreviation(currentToken)) return false;
			
			// (for XML-marked text) next char is < -> end of sentence
		   // if (nextToken0 == '<') return true;
			
			return true;

		},
		
		/**
		 * Returns true if sentence starts with a w-question word, eg (who,what,why,where,when,etc.)
		 * 
		 * @param {string} sentence
		 * @returns {boolean} true if sentence starts with a w-question word, eg (who,what,why,where,when,etc.)
		 */
		isW_Question : function(sentence) {    
			var sentenceArr = RiTa.tokenize((sentence));
			for (var i = 0; i < W_QUESTION_STARTS.length; i++)
				if (equalsIgnoreCase(sentenceArr[0], W_QUESTION_STARTS[i]))
					return true;
			return false;
			
		},

		/**
		 * Returns a randomly ordered array of unique integers from 0 to numElements. 
		 * The size of the array will be numElements.
		 * 
		 * @param {number} numElements
		 * @returns {array} unique integers from 0 to numElements. 
		 */
		randomOrdering : function(numElements) {    
			
			if (!numElements || numElements < 1)// !isNum(numElements)) 
				err("bad arg");
			
			var o = [];
			for ( var z = 0; z < numElements; z++) {
				o.push(z);
			}
			
			// Array shuffle, from Jonas Raoni Soares Silva (http://jsfromhell.com/array/shuffle)
			for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}

			return o;
			
		},

		/**
		 * Strips all punctuation from the given string
		 * @param {string} text input
		 * @returns {string} result
		 */
		stripPunctuation : function(text) {    

			return (text === E) ? E : text.replace(PUNCTUATION_CLASS, E); 
		},
		
		// PUNCTUATION : "����`'""\",;:!?)([].#\"\\!@$%&}<>|+=-_\\/*{^",
		
		/**
		 * Trims punctuation from each side of the token (does not trim whitespace or internal punctuation).
		 * 
		 * @param {string} text input
		 * @returns {string} result
		 */
		trimPunctuation : function(text) {
			
			// TODO: replace all this with 1 regex

			var c;

			// from the front
			while (text.length > 0) {
				c = text.charAt(0);
				if (!RiTa.isPunctuation(c)) 
					break;
				text = text.substr(1);
			}
			
			// from the back
			while (text.length > 0) {
				c = text.charAt(text.length - 1);
				if (!RiTa.isPunctuation(c)) 
					break;
				text = text.substring(0, text.length - 1);
			}

			return text;

			
		},

		/**
		 * Returns true if every character of 'text' is a punctuation character
		 * 
		 * @param {string} text input
		 * @returns {boolean} 
		 */
		// TEST: PUNCTUATION : "����`'""\",;:!?)([].#\"\\!@$%&}<>|+=-_\\/*{^",
		isPunctuation : function(text) { 
			
			if (!text || !text.length) return false;
  
			return ONLY_PUNCT.test(text); 
			
		},
		
		/**
		 * Returns true if any character of 'text' is a punctuation character
		 * 
		 * @param {string} text input
		 * @returns {boolean}
		 */
		// TEST: PUNCTUATION : "����`'""\",;:!?)([].#\"\\!@$%&}<>|+=-_\\/*{^",
		hasPunctuation : function(text) { 
			
			if (!text || !text.length) return false;
  
			return ONLY_PUNCT.test(text); 
		},

		/**
		 * Returns a string containing all phonemes for the input text
		 * 
		 * @param {string | array} words to analyze
		 * @returns {string}  e.g., "dh-ax-d-ao-g-r-ae-n-f-ae-s-t"
		 */
		getPhonemes : function(words) {

			return RiString(words).analyze().get(RiTa.PHONEMES);
			
		},

		/**
		 * Analyzes the given string and returns a new string containing the stresses
		 *  for each syllable of the input text 
		 * 
		 * @param {string | array} words to analyze
		 * 
		 * @returns {string}  e.g., "01-0-1", with 1's meaning 'stressed', 
		 *      and 0's meaning 'unstressed', 
		 */
		getStresses : function(words) {

			return RiString(words).analyze().get(RiTa.STRESSES);
		},

		/**
		 * Analyzes the given string, Returns a String containing the phonemes for each syllable of
		 * each word of the input text,  delimited by dashes (phonemes) and spaces (words) 
		 * 
		 * @param {string | array} words to analyze
		 * 
		 * @returns {string} e.g., "dh-ax d-ao-g r-ae-n f-ae-s-t" 
		 *  for the 4 syllables of the phrase 'The dog ran fast'
		 */
		getSyllables : function(words) {

			return RiString(words).analyze().get(RiTa.SYLLABLES);

		},
		
		/**
		 * Returns the # of words in the String according to the default tokenizer.
		 * 
		 * @param {string} words the string to analyze
		 * 
		 * @returns {number}
		 */
		getWordCount : function(words) {
			
			return RiTa.tokenize(words).length;

		},
		
		/**
		 * Extracts base roots from a word according to the specified stemming algorithm
		 * <p>
		 * Note: see http://text-processing.com/demo/stem/ for comparison of 
		 * Lancaster and Porter algorithms or  http://mpii.de/yago-naga/javatools 
		 * for info on PlingStemmer
		 * 
		 * @param {string} word the word to analyze
		 * 
		 * @param {string} type one of ['Lancaster' (the default), 'Porter', or 'Pling'] 
		 *  to specify the stemming algorithm to use
		 * 
		 * @returns {string} the stemmed form of 'word'
		 */
		stem : function(word, type) {
			
			type = type || 'Lancaster';  // USE CONSTANTS
			
			if (type != 'Lancaster' && type != 'Porter' && type != 'Pling')
				err('Bad stemmer type: '+type);
			
			var stemImpl = Stemmer['stem_'+type];
			
			if (word.indexOf(SP) < 0) return stemImpl(word);
			
			// dump non-words && multiple white-space - http://qaa.ath.cx/porter_js_demo.html
			word = word.replace(/[^\w]/g, SP);
			word = word.replace(/\s+/g, SP); 
			
			var res = [], words = word.split(SP);
			
			for ( var i = 0; i < words.length; i++) {
				
				res.push(stemImpl(words[i]));
			}
			
			return res.join(SP);
		},
		
		/**
		 * Provides backwards compatibility (when possible) with
		 * the original RiTa/Processing Java library
		 * 
		 * @param {boolean} true to enable compatibility, else false
		 */
		p5Compatible : function(value) {  // TODO: remove?
			
			//console.log('p5Compatible('+value+'['+window+'])');
			
			if (!arguments.callee.setupAndDraw) {
				
				arguments.callee.setupAndDraw = function() {
					if (typeof window.setup == F) setup();
					if (typeof window.draw == F) RiText.loop();
				};
			}

			
			if (typeof window != 'undefined' && window) {
				
				// TODO: add mouse-handling methods here?
				if (typeof window.mouseClicked == F) 
					window.onmouseup = window.mouseClicked;
				if (typeof window.mousePressed == F) 
					window.onmousedown = window.mousePressed;
				if (typeof window.mouseReleased == F) 
					window.onmouseup = window.mouseReleased;
				if (typeof window.mouseMoved == F) 
					window.onmousemove = window.mouseMoved;
			}
			
			//if (typeof window.mouseDragged == F) 
				//window.onmousemove = window.mouseDragged; 
			// window.onmousemove = mouseDragged;

			if (value) {
				
				// alias' for RiTa-java member functions 
				RiText.prototype.textAlign  = RiText.prototype.align;
				RiText.prototype.textFont   = RiText.prototype.font;
				RiText.prototype.textSize   = RiText.prototype.fontSize;
				RiText.prototype.setText    = RiText.prototype.text;
				RiText.prototype.fadeColor  = RiText.prototype.colorTo;
				RiText.prototype.fadeToText = RiText.prototype.textTo;
				RiText.prototype.setColor   = RiText.prototype.color;
	
				// alias' for RiTa-java static functions  (?)
				RiText.setDefaultFont = RiText.defaultFont; 
				RiText.setDefaultColor = RiText.defaultFill;
				//RiText.setDefaultAlignment = RiText.defaultAlignment;
				RiText.setCallbackTimer = RiText.timer;
				
				if (typeof window != 'undefined' && window && !hasProcessing) { 
					
					if (!window.LEFT) window.LEFT = RiTa.LEFT;
					if (!window.RIGHT) window.RIGHT = RiTa.RIGHT;
					if (!window.CENTER) window.CENTER = RiTa.CENTER;	
	
					if (!window.line) window.line = RiText.line;
					if (!window.size) window.size = RiText.size;
					if (!window.createFont) window.createFont = RiText.createFont;
					if (!window.background) window.background = RiText.background;
					if (!window.random) window.random = RiText.random;	
					
					if (!window.onload) window.onload = arguments.callee.setupAndDraw;					
				}
			}
			else { // non-compatible mode (clear extra stuff)
				
				delete RiText.prototype.textAlign;
				delete RiText.prototype.textFont;
				delete RiText.prototype.textSize;
				
				delete RiText.prototype.setColor;
				delete RiText.prototype.setText;
				delete RiText.prototype.fadeColor;
				delete RiText.prototype.fadeToText;
				
				delete RiText.setDefaultFont;
				delete RiText.setDefaultColor;
				delete RiText.setDefaultAlignment;
				delete RiText.setCallbackTimer;

				if (typeof window != 'undefined' && window && !hasProcessing)  {
					
					if (window.RIGHT === RiTa.RIGHT) delete window.RIGHT;
					if (window.LEFT === RiTa.LEFT) delete window.LEFT;
					if (window.CENTER === RiTa.CENTER) delete window.CENTER;
					
					if (window.line === RiTa.line) delete window.line;
					if (window.size === RiTa.size) delete window.size;
					if (window.random === RiTa.random) delete window.random;
					if (window.background === RiTa.background) delete window.background;
					if (window.createFont === RiTa.createFont) delete window.createFont;
					
					if (window.onload && (window.onload == arguments.callee.setupAndDraw))
						window.onload = undefined; // ?
				}
			}
		},
		
		/**
		 * Converts 'input' to Titlecase (1st letter upper, rest lower)
		 */
		_titleCase : function(input) {
			
			if (!input || !input.length) return input;
			
			return input.substring(0,1).toUpperCase() + input.substring(1);
		}
		
	}; // end RiTa object

	// ////////////////////////////////////////////////////////////
	// RiMarkov
	// ////////////////////////////////////////////////////////////
	
	/**
	 * @name RiMarkov
	 * @class Performs text generation via Markov chains (aka n-grams)
	 * with options to process single characters, words, sentences, and 
	 * arbitrary regular expressions. 
	 * 
	 * <p>
	 * 
	 * Provides a variety of methods specifically 
	 * designed for text-generation.
	 *  
	 * @example
	 *   var rm = new RiMarkov(3);
	 *   rm.loadFile("war_peace.txt"); 
	 *   var sents = rm.generateSentences(10);
	 *   for (var i = 0; i < sents.length; i++) {
	 *     console.log(sents[i]);
	 *   }
	 
	 * Note: use RiMarkov.setTokenizerRegex() to control how inputs are tokenized (or split-up). 
	 * The default is to use the Penn word-tokenizing conventions (without splitting contractions). 
	 * You may wish to simply use whitespace (or some other regular expression), which 
	 * can be accomplished as follows:
	 * <pre>
	 *   var rm = new RiMarkov(3);
	 *   rm.setTokenizerRegex(/\s+/);</pre>
	 *   
	 * This creates a new model, with n=3, that tokenizes its
	 * input on one or more whitespace characters: [ \t\n\x0B\f\r].
	 * 
	 * <p> 
	 * 
	 */
	/*
	 * Note: use allowDuplicates(false) to ensure that sentences that exist 
	 * in the input test are not output by generate().  This method should be used with care, 
	 * as certain sets of input texts (with allowDuplicates=false) may result in decreased performance
	 * and/or excessive memory use.
	 */
	var RiMarkov = makeClass();

	 /** constant for max # of tries for a generation */
  	RiMarkov.MAX_GENERATION_ATTEMPTS = 1000;
  
	RiMarkov._SSRE =  /"?[A-Z][a-z"',;`-]*/;  
	
	RiMarkov._SSDLM =  'D=l1m_';     // TODO:  (OR use HTML-style tag) ??

	RiMarkov.prototype = {

		/**
		 * @function
		 * @name RiMarkov 
		 * 
		 * Construct a Markov chain (or n-gram) model and set its n-Factor
		 * 
		 * @param {number} nFactor for the model (an int)
		 * @param {boolean} recognizeSentences whether the model will attempt to recognize (English) sentences (optional, default=true)
		 * @param {boolean} allowDuplicates whether the model allow duplicates in its output (optional, default=true)		 
		 */
		init : function(nFactor, recognizeSentences, allowDuplicates) {

			ok(nFactor, N);

			this._n = nFactor;
			this.pathTrace = [];
			this.sentenceList = [];
			this.sentenceStarts = [];
			this.minSentenceLength = 6;
			this.maxSentenceLength = 35;
			this.maxDuplicatesToSkip = 10000;
			this.root = new TextNode(null, 'ROOT');
			this.sentenceAware = (arguments.length > 1 && !recognizeSentences) ? false : true;
			this.allowDuplicates = (arguments.length > 2 && !allowDuplicates) ? false : true;
			this.printIgnoredText = false;
			this.smoothing = false;
		},

		/**
		 * Returns either the raw (unigram) probability for a single token in the model (0 if it does not exist)
		 * OR (for an array) the probability of obtaining a sequence of k tokens where k <= nFactor,
		 * e.g., if nFactor = 3, then valid lengths for the data array are 1, 2 & 3.
		 * @param {string | array} data the string (or sequence of strings) to search for
		 * 
		 * @returns {number} from 0-1
		 */
		getProbability : function(data) {
			
			if (!this.root) err("Model not initd: null root!");
			
			var tn = is(data,S) ? this.root.lookup(data) : this._findNode(data);

			return (tn) ? tn.probability() : 0;
			
		},
		
		/** 
		 * Returns the full set of possible next tokens, as an associative array, 
		 * (mapping string -> number (probability)) given an array of tokens 
		 * representing the path down the tree (with length less than n).
		 * 
		 * <p>  Note: seed arrays of any size (>0) may be input, but only 
		 * the last n-1 elements will be considered.   
		 *
		 * @param {string | array} a single token or array of tokens (strings)
		 *
		 * @returns {object} associative array mapping tokens to probabilities
		 */
		getProbabilities : function(path) {
			
			//log('getProbabilities: '+path);
			
			if (is(path,S)) path = [path];

			if (path.length > this._n) {
				
				path = path.slice(Math.max(0, path.length-(this._n-1)), path.length);
			}
			
			var probs = {}, tn = this._findNode(path);
			
			if (!tn) return {};

			var nexts = tn.childNodes();
			for (var i = 0; i < nexts.length; i++) {
				var node = nexts[i];
				if (node)  {
					probs[node.token] = node.probability();
				}
			}
			
			return probs;
		},
		
		/**
		 * If only one array parameter is provided, this function returns all possible
		 * next words (or tokens), ordered by probability, for the given
		 * array. <p>Note: seed arrays of any size (>0) may 
		 * be input, but only the last n-1 elements will be considered.   
		 *
		 * @example var result = rm.getCompletions([ "the","red"]);
		 *
		 * If two arrays are provided, it returns an unordered list of possible words <i>w</i> 
		 * that complete an n-gram consisting of: pre[0]...pre[k], <i>w</i>, post[k+1]...post[n].
		 * 
		 * As an example, the following call:
		 * 
		 * @example var result = rm.getCompletions([ "the" ], [ "red", "ball" ]);
		 * 
		 * will return all the single words that occur between 'the' and 'red ball'
		 * in the current model (assuming n > 3), e.g., [ 'round', 'big', 'bouncy']).
		 * <p> 
		 * Note: For this operation to be valid, (pre.length + post.length)
		 * must be less than the model's n-factor, otherwise an error will be thrown. 
		 * 
		 * @param {array} pre
		 * @param {array} post (optional)
		 * 
		 * @returns {array} an unordered list of possible next tokens
		 */
		getCompletions : function(pre, post) {
			
			//  log(pre+" :: "+post);
			
			var tn, result=[], node, atest, nexts;
			
			if (post) { // fill the center
	
				if (pre.length + post.length > this._n) {
	
					err('Sum of pre.length && post.length must be < N, was ' + (pre.length + post.length));
				}
	
				tn = this._findNode(pre);
				if (!tn) return null;
	
				nexts = tn.childNodes();
				for ( var i = 0; i < nexts.length; i++) {
	
					node = nexts[i];
					
					atest = pre.slice(0); // clone
	
					atest.push(node.token);
					
					for ( var j = 0; j < post.length; j++)
						atest.push(post[j]);
	
					if (this._findNode(atest)) result.push(node.token);
				}
				return result;
			}
			else { // fill the end
	
				var hash = this.getProbabilities(pre);
				var keys = okeys(hash);
				return keys.sort(function(a, b) {
	
					return hash[b] - hash[a];
				});
			}
		},
		
		/**
		 * Continues generating tokens until a token matches 'regex', assuming
		 * the length of the output array is between min and maxLength (inclusive).
		 * 
		 * @param {string} or {object} regex The regex string or object to match against
		 * @param {number} minLength the minimum number of tokens to generate (optional, default=1)
		 * @param {number} maxLength the maximum number of tokens to generate (optional)
		 * 
		 * @returns {array} strings
		 */ 
		generateUntil : function(regex, minLength, maxLength){

			minLength = minLength || 1;
			maxLength = maxLength || Number.MAX_VALUE;
			
			var mn, tokens, tries=0, maxTries=999;
			
			OUT: while (++tries < maxTries) {
			
				// generate the min number of tokens
				tokens = this.generateTokens(minLength);

				// keep adding one and checking until we pass the max
				while (tokens.length < maxLength) {
					
					mn = this._nextNodeForArr(tokens);
					
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
				err("\n[WARN] RiMarkov failed to complete after "+tries+" attempts\n");

			return tokens;

		},
			
		/**
		 * Generates a string of <pre>length</pre> tokens from the model
		 * @param {number} the target number of tokens to generate
		 * @returns {array} strings
		 */
		generateTokens: function(targetNumber) {

			var tries = 0, maxTries = 500, tokens = [];

			OUT: while(++tries < maxTries) {

				var mn = this.root.selectChild(null, true);
				if (!mn || !mn.token) continue OUT;
				tokens.push(mn);

				while(tokens.length < targetNumber) {

					mn = this._nextNodeForArr(tokens);
					if (!mn || !mn.token) { // hit the end
						tokens = []; // start over
						continue OUT;
					}

					tokens.push(mn);
				}

				break;
			}

			// uh-oh, looks like we failed...
			if (tokens.length < targetNumber) {
				err("\n[WARN] RiMarkov failed to complete after " + tries 
					+" tries, with only " + tokens.length + " successful generations...\n");
			}

			var res = [];
			for(var i = 0; i < tokens.length; i++) {
				res[i] = tokens[i].token;
			}

			return res;
		},
		

				
		/**
		 * Sets/gets the value of 'useSmoothing' to detemine 
		 * whether (add-1) smoothing is enabled for the model.
		 * Note: should be called before any data loading is done.
		 * @param {boolean} the value (optional, for sets only)
		 * @returns {object | boolean} 
		 */
		useSmoothing : function(value) {
			
			if (arguments.length) {
				
				this.smoothing = value;
				return this;
			}
			return this.smoothing;
		},
		
						
		/**
		 * Returns whether the model will try to recognize 
		 * (English-like) sentences in its input (default=true).
		 *
		 * @returns {boolean} 
		 */
		recognizeSentences : function() {
			if (arguments.length>0)
			  throw Error("recognizeSentences() takes no arguments, "+
			  	"use the constructor RiMarkov(n,recognizeSentences);");
			return this.sentenceAware;
		},

		/**
		 * Returns the current n-value for the model
		 * @returns {number}
		 */
		getN : function() {
			
			return this._n;
		},
		
		/**
		 * Returns the number of tokens currently in the model
		 * @returns {number}
		 */
		size : function() {
			
			return this.root.count;
		},
		
		/**
		 * Prints a formatted version of the model to the console 
		 */
		print : function() {
			
			if (console) console.log(this.root.asTree(false));
			return this;
		},
		
		/**
		 * Loads a text string into the model after tokenizing it.
		 * 
		 * @param {string} text the string
		 * @param {number} multiplier Weighting for text (optional, default=1) 
		 * @param {string | regex} a regular expression to be used for tokenizing
		 *   (optional, if not supplied, uses RiTa.tokenize())
		 * @see RiTa.tokenize
		 * @returns {object} this RiMarkov
		 */
		loadText : function(text, multiplier, regex) {

			ok(text,S);

			multiplier = multiplier || 1;

			if (multiplier < 1 || multiplier != Math.floor(multiplier))
		    	err('multiplier must be an positive integer, found: '+multiplier); 

			if (this.sentenceAware) 
				return this._loadSentences(RiTa.splitSentences(text), multiplier);       
			else        
				return this.loadTokens(RiTa.tokenize(text,regex), multiplier);
		},
		
		/**
		 * Loads an array of tokens (or words) into the model; each 
		 * element in the array must be a single token for proper 
		 * construction of the model. 
		 * 
		 * @param {array} tokens the strings with which to load the model 
		 * @param {number} multiplier Weighting for tokens in the array (optional, default=1)
		 * @returns {object} this RiMarkov
		 */
		loadTokens: function(tokens, multiplier) {

			//console.log("loadTokens: smooth="+this.smoothing);
			
			multiplier = multiplier || 1;

			if (multiplier < 1 || multiplier != Math.floor(multiplier))
		    	err('multiplier must be an positive integer, found: '+multiplier); 

			this.root.count += tokens.length; // here?
			
			for (var toAdd, k = 0; k < tokens.length; k++) {
				toAdd = [];

				for (var j = 0; j < this._n; j++) {
					if ((k + j) < tokens.length) toAdd[j] = (!undef(tokens[k + j])) ? tokens[k + j] : null;
					else toAdd[j] = null;
				}

				// hack to deal with multiplier...
				for (var l = 0; l < multiplier; l++) {

					var node = this.root;
					for (var i = 0; i < toAdd.length; i++) {
						if (node.token) { 
							node = node.addChild(toAdd[i], this.smoothing ? 2 : 1);
						}
					}
				}
			}

			return this;
		},
		
   
		/**
		 * Generates some # (one or more) of sentences from the model.<P>
		 * Note: multiple sentences generated by this method WILL follow
		 * the model across sentence boundaries; thus the following two calls
		 * are NOT equivalent:<pre>
			String[] results = markov.generateSentences(10);
				and
			for (int i = 0; i < 10; i++)
				results[i] = markov.generateSentence(1);</pre>
		 * The latter will create 10 sentences with no explicit relationship
		 * between one and the next; while the former will follow probabilities
		 * from one sentence (across a boundary) to the next.
		 */
		generateSentences: function(num) {

			var mn = this._getSentenceStart(), s = mn.token + SP, result = [], 
				tries = 0, totalTries = 0, wordsInSentence = 1;
			
			while (result.length < num) {
				
				if (wordsInSentence >= this.maxSentenceLength) { 
					
					//System.out.println("MarkovModel.generateSentences().reject:: too long!");
					
					mn = this._getSentenceStart(); 
					s = mn.token + SP;
					wordsInSentence = 1;
				}

				if (mn.isLeaf()) {
					mn = this._tracePathFromRoot(mn);
					continue;
				}

				mn = this._nextNodeForNode(mn);
				
				if (mn.isSentenceStart) {
					
					if (wordsInSentence >= this.minSentenceLength) {
						
						var candidate = RiTa.untokenize(s.trim().split(/\s+/));
						
						if (this._validateSentence(candidate)) {
							
							// got one, store and reset the counters
							if (result.indexOf(candidate) < 0) 
								result.push(candidate);
							//log(result.length+" RESULTS SO FAR");
							totalTries += tries; 
							tries = 0;
						} 
					}
					mn = this._getSentenceStart(); 
					s = mn.token + SP;
					wordsInSentence = 1;
					continue;
				}
				
				// add the next word
				wordsInSentence++;
				s += mn.token + SP;

				// check if its time to give up
				if (++tries >= RiMarkov.MAX_GENERATION_ATTEMPTS) {
					
					this._onGenerationIncomplete(totalTries+=tries, result.length);
					break; // give-up
				}
			}

			return result;
		},
		
		_validateSentence : function(sent) {
			
		    var tokens = RiTa.tokenize(sent), first = tokens[0], last = tokens[tokens.length-1];
 
		    if (!first.match(/[A-Z]\S*/)) {
		      if (this.printIgnoredText)
		      	log("Skipping: bad first char in '"+sent+"'");
		      return false;
		    }      
		    
		    if (!last.match(/[!?.]/)) {
		      if (this.printIgnoredText) 
		      	log("Bad last token: '"+last+"' in: "+sent);   
		      return false;
		    }
		    
		    if (!this.allowDuplicates) 
		    {
		      if (!this.recognizeSentences) {
		        err("[WARN] Invalid state: allowDuplicates must be"
		        	+" true when not generating sentences");
		      }
		      
		      if (this.sentenceList.indexOf(sent)>-1) 
		      {
		        if (++this.skippedDups == this.maxDuplicatesToSkip) {
		          log("[WARN] Hit skip-maximum (RiMarkov.maxDuplicatesToSkip="+this.maxDuplicatesToSkip
		              +") after skipping "+ this.maxDuplicatesToSkip+", now allowing duplicates!");
		          this.allowDuplicates = true;
		        }
		        
				if (this.printIgnoredText) log("Ignoring duplicate: "+sent);
				  
		        return false;
		      }
		    }
		    return true;
		},
		
		_checkPunctuation : function(sent) {    
			
			var result = value.charAt(0).toUpperCase() + value.substring(1);
			return RiTa.untokenize(result.split(/\s+/));
	    },
	    
		_tracePathFromRoot : function(node) { 
		    
		    // (TODO: change this
		    node.pathFromRoot(this.pathTrace);
		    
		    this.pathTrace.pop(); // ignore the first element
		    var mn = this.root;    
		    while ( this.pathTrace.length) {
		      var search =  this.pathTrace.pop();
		      mn = mn.lookup(search);
		    }     
		    return mn;
		},
  		
		_nextNodeForArr: function(previousTokens) {

			//if (!is(previousTokens,A)) return this.root;
			
			// Follow the seed path down the tree
			var firstLookupIdx = Math.max(0, previousTokens.length - (this._n - 1)),
				node = this.root.lookup(previousTokens[firstLookupIdx++]);

			for (var i = firstLookupIdx; i < previousTokens.length; i++) {

				if (node) node = node.lookup(previousTokens[i]);
			}

			// Now select the next node
			return node ? node.selectChild(null, true) : null;
		},
		
		_nextNodeForNode : function(current) {         
			
		    var attempts = 0, selector, pTotal=0, nodes = current.childNodes();
		    
		    while (true) {
		    	
		        pTotal = 0;
		        selector = Math.random();   
		        //System.out.println("current="+current+", selector="+selector);
		        for(var i=0,j=nodes.length; i<j; i++){
				  var child = nodes[i]
				 
		          //System.out.println("child="+child);
		          pTotal += child.probability();
		          
		          //System.out.println("pTotal="+pTotal);
		          if (current.isRoot() && (recognizeSentences && !child.isSentenceStart())) {
		            //System.out.println("continuing...");
		            continue;
		          }
		          if (selector < pTotal) {
		            //System.out.println("returning "+child+"\n====================");
		            return child;
		          }
		          //System.out.println("selector >= pTotal\n====================");
		        }
		        attempts++; 
		        console.log("[WARN] Prob. miss (#"+attempts+") in RiMarkov.nextNode()."
		        		+ " Make sure there are a sufficient\n       # of sentences"
		        		+ " in the model that are longer than your minSentenceLength.");
		        if (attempts == MAX_PROB_MISSES)
		          err  // should never happen
		            ("PROB. MISS"+current+ " total="+pTotal+" selector="+selector);  
		      }      
		},
		
		_clean : function(sentence) {

			return RiTa.trim(sentence.replace(/\s+/, SP));
		},
		
		_onGenerationIncomplete : function(tries, successes) {
			
    		if (!RiTa.SILENT) console.log("\n[WARN] RiMarkov failed to complete after "+tries
      			+" tries\n       Giving up after "+successes+" successful generations...\n");
  		},	

		/**
		 * Loads an array of sentences into the model; each
		 * element in the array must be a single sentence for
		 * proper parsing.
		 */ 
		_loadSentences : function(sentences, multiplier) {

			//console.log("_loadSentences("+this.allowDuplicates+")");
			
			var i, j, tokens, sentence, allWords = [], printIgnoredText = true;

			// do the cleaning/splitting first ---------------------

			for (i = 0; i < sentences.length; i++) {
				
				sentence = this._clean(sentences[i]);
				
				// do we need this?
				if (!this.allowDuplicates) {
					this.sentenceList.push(sentence);
				}
				
				tokens = RiTa.tokenize(sentence);
				
				//wordCount += tokens.length;
				
				if (!this._validSentenceStart(tokens[0])) {
					if (printIgnoredText)
						warn("[WARN] Skipping (bad sentence start): " + tokens);
					continue;
				}
				
				allWords.push(RiMarkov._SSDLM + tokens[0]);
				
				j = 1; // awful hack
				for (; j < tokens.length; j++)
					allWords.push(tokens[j]);
			}

			// ------------------------------------------------

			var toAdd, words = allWords,nFactor;
			//wordsPerFile += allWords.length;
			for (i = 0; i < words.length; i++) {
				
				toAdd = [];
				nFactor = this.getN();
				for (j = 0; j < nFactor; j++) {
					if ((i + j) < words.length)
						toAdd[j] = words[i + j];
				}

				// hack to deal with multiplier...
				for (j = 0; j < multiplier; j++)
					this._addSentenceSequence(toAdd);
			}
			
			return this;

		},
		  
		_validSentenceStart : function(word) {      
 
			return (!this.sentenceAware || word && word.match(RiMarkov._SSRE)); 
		},
		
		_addSentenceSequence : function(toAdd) {

			var node = this.root;

			for(var i = 0; i < toAdd.length; i++) {

				if (!toAdd[i]) continue;

				if (node.token) {

					var add = toAdd[i];

					if (startsWith(add,RiMarkov._SSDLM)) {

						add = add.substring(RiMarkov._SSDLM.length); 
						var parent = node;

						node = node.addChild(add, this.smoothing ? 2 : 1);
						node.isSentenceStart = true;

						if (parent.isRoot()) {
							this.sentenceStarts.push(node.token);
						}

					} else 
						node = node.addChild(add, this.smoothing ? 2 : 1);
				}
			}
		},
		

		_getSentenceStart : function() {
			
			if (!this.sentenceStarts || !this.sentenceStarts.length)
				err('No sentence starts found! genSen='+recognizeSentences);
			
			var start = RiTa.randomItem(this.sentenceStarts);
			
			return this.root.lookup(start);
		},

		_findNode: function(path) {

			//log("RiMarkov.findNode("+path.toString()+")");

			if (!path || !is(path, A) || !path.length) 
				return null;

			var nFactor = this._n;
			var numNodes = Math.min(path.length, nFactor - 1);
			var firstLookupIdx = Math.max(0, path.length - (nFactor - 1));
			var node = this.root.lookup(path[firstLookupIdx++]);

			if (!node) return null;

			var idx = 0; // found at least one good node
			var nodes = [];
			nodes[idx++] = node;
			for (var i = firstLookupIdx; i < path.length; i++) {
				node = node.lookup(path[i]);
				if (!node) return null;
				nodes[idx++] = node;
			}

			return nodes ? nodes[nodes.length - 1] : null;
		}

	}
	
	///////////////////////////////////////////////////////////////////////////
	// RiTaEvent class 
	///////////////////////////////////////////////////////////////////////////
	
	/**
	 * @name RiTaEvent
	 * 
	 * @class A simple wrapper for event-based callbacks 
	 */
	/*
	 * @example A typical usage might be to switch on the type 
	 * of a RiTaEvent within a callback:
	 <pre>
	 function onRiTaEvent(e)
		{
		  if (e.source() == RiTa.FADE_OUT)
			// ...
		  else 
			// ...
		}<pre>
	 */   
	var RiTaEvent = makeClass();
	
	RiTaEvent._callbacksDisabled = false;
	
	RiTaEvent.prototype = {
		
		/**
		 * Contructs a new RiTaEvent object with a source and type
		 */
		init : function(sourceRiText, eventType) {
			
			ok(sourceRiText,O);
			
			var fn = RiTaEvent.prototype.init;
			if (!fn.ID) fn.ID = 0;
			this._id = ++(fn.ID);
			
			this._source = sourceRiText;
			this._type = eventType || RiTa.UNKNOWN;
			//this._data = data;
		},
		
		
		/** @private  */
		toString : function() {
			
			// TODO: implement typeToString() and uncomment below
			
			return "RiTaEvent[#"+this._id+" type="+ // typeToString(this._type)+ 
				"("+this._type+") src="+this._source.toString()+"]";

		},
		
		/**
		 * Gets the source for this event (usually a RiText object)
		 * @returns {object} the source
		 */
		source : function() {
			
			return this._source;  
		},
		
		/**
		 * Gets the type for this event
		 * @returns {number} the type
		 */
		type : function() {
			
			return this._type;  
		},
		
		/**
		 * Fires an event and directs it to the appropriate callback implementation
		 * @param callback
		 */
		_fire: function(callback) {

			callback = callback || window.onRiTaEvent || (RiText._graphics() && RiText._graphics().onRiTaEvent); 
																				// last is for P5
			//if (typeof callback === 'function') {
			if (is(callback,F)) {

				try {
					
					callback.apply(this, [this]); // first arg should be ??

				} catch(err) {

					RiTaEvent._callbacksDisabled = true; 
					warn("RiTaEvent: error calling '"+callback+"': " + err);
					throw err;
				}
			} 
			else if (!RiTaEvent._callbacksDisabled) {

				// TODO: Consider REMOVE THIS ?
				callback = callback || 'onRiTaEvent(e) { ... }';
				warn("RiTaEvent: no '"+callback+"' callback found...");
				RiTaEvent._callbacksDisabled = true;
			}
		}
	}
	
	
	// ////////////////////////////////////////////////////////////
	// RiLexicon
	// ////////////////////////////////////////////////////////////
	
	/**
	 * @name RiLexicon
	 * 
	 * @class The core 'dictionary' (or lexicon) for the RiTa tools. 
	 * <p>
	 * It contains ~40,000 words augmented with phonemic and syllabic data, as well as a list of valid parts-of-speech for each. 
	 * The lexicon can be extended and/or customized for additional words, usages, or pronunciations.
	 * 
	 * <p> Additionally the lexicon is equipped with implementations of a variety of matching algorithms 
	 * (min-edit-distance, soundex, anagrams, alliteration, rhymes, looks-like, etc.) 
	 * based on combinations of letters, syllables and phonemes.
	 * <p>
	 * Note: For performance, the data for RiLexicon is shared in a single location for ALL created instances (static)
	 * <p> 
	 * Note: If you wish to modify or customize the lexicon (e.g., add words, or change pronunciations) 
	 * you can do so directly, by editing the 'rita_dict.js' file, or programatically, via addWord() & removeWord()
	 *
	 * @example
		var lex = new RiLexicon(this);
		var similars = lex.similarBySound("cat");
		var rhymes = lex.getSimpleRhymes("cat");
		// etc.
	 */
	var RiLexicon = makeClass();

	// ////////////////////////////////////////////////////////////
	// Static variables
	// ////////////////////////////////////////////////////////////   
	
	RiLexicon.data = undefined; // shared static var
	
	// ////////////////////////////////////////////////////////////
	// Member functions
	// ////////////////////////////////////////////////////////////
	
	RiLexicon.prototype = {
		
		/**
		 * Constructs a (singleton) instance of the RiLexicon class.
		 * <p> 
		 * Note: For performance, the data for all RiLexicon instances
		 * is shared (there is only 1 copy)
		 */
		init: function() {

			if (!RiLexicon.data) {

				if (typeof _RiTa_DICT != 'undefined') {

					log('[RiTa] Loading lexicon data...');

					RiLexicon.data = {}; // TODO: test perf. of this
					for (var word in _RiTa_DICT) {
						RiLexicon.data[word] = _RiTa_DICT[word];
					}
				} else {

					err("Dictionary not found! Make sure to add it to your sketch:" 
						+ ", e.g.,\n\n    <script src=\"path/to/rita_dict.js\"></script>");
				}
			}
		},
	
		
		/** Clears the lexicon */
		clear : function() {
			
			RiLexicon.data = undefined;
			
			for (var word in RiLexicon.data) 
				delete RiLexicon.data[word];
		},
	 
		/**
		 * Adds a word to the current lexicon. Note: will replace the word if it already exists
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
			
			RiLexicon.data[word.toLowerCase()] = [pronunciationData.toLowerCase(), posData.toLowerCase()];
			return this;
		},
		
		/**
		 * Removes a word from the current lexicon 
		 * 
		 * @example removeWord('abandon');
		 * 
		 * @param {string} word
		 * @returns {object} this RiLexicon  
		 */
		removeWord : function(word) {
			
			delete RiLexicon.data[word.toLowerCase()];
			return this;
		},
		
		/**
		 * Compares the characters of the input string  (using a version of the min-edit distance algorithm)
		 * to each word in the lexicon, returning the set of closest matches.        
		 * 
		 * @param {string} word
		 * @param {number} minAllowedDist minimum edit distance for matches (optional, default=1)
		 * @param {boolean} preserveLength whether to return only words that match the length of the input word (optional, default=true)
		 * 
		 * @returns {array} matching words 
		 */
		similarByLetter: function(input, minAllowedDist, preserveLength) {

			var minVal = Number.MAX_VALUE, minLen = 2, result = [];

			if (!(input && input.length)) return EA;

			input = input.toLowerCase();
			minAllowedDist = minAllowedDist || 1;
			preserveLength = preserveLength || false;

			for (var entry in RiLexicon.data) {

				if (preserveLength && entry.length != input.length || entry.length < minLen) 
					continue;

				entry = entry.toLowerCase();

				if (entry == input || entry == (input + "s") || entry == (input + "es")) 
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
		},

		/**
		 * Compares the phonemes of the input string 
		 * (using a version of the min-edit distance algorithm)
		 * to each word in the lexicon, returning the set of closest matches.        
		 * 
		 * @param {string} input
		 * @param {number}  minEditDist (optional) minimum edit distance for matches 
		 * @returns {array} matching words 
		 */
		similarBySound: function(input, minEditDist) { 

			minEditDist = minEditDist || 1;

			var minVal = Number.MAX_VALUE, entry, result = [], minLen = 2,
				phonesArr, phones = RiTa.getPhonemes(input), med,
				targetPhonesArr = phones ? phones.split('-') : [];

			if (!targetPhonesArr[0] || !(input && input.length)) return EA;

			for (entry in RiLexicon.data) {

				if (entry.length < minLen) 
					continue;

				entry = entry.toLowerCase();

				if (entry == input || entry == (input + "s") || entry == (input + "es")) 
					continue;

				phones = this._getRawPhones(entry);

				if (!phones.length) {

					phones = RiString._syllabify(LetterToSound().getPhones(entry));
					if (!phones) return EA;
				}

				phonesArr = phones.replace(/1/g, "").replace(/ /g, "-").split('-');

				med = MinEditDist.computeRaw(phonesArr, targetPhonesArr);

				if (med == 0) continue; // same phones 

				// found something even closer
				if (med >= minEditDist && med < minVal) {

					minVal = med;
					result = [entry];
				}
				// another best to add
				else if (med == minVal) {

					result.push(entry);
				}
			}

			return result;
		},

		
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
			for  (entry in RiLexicon.data){
				if (entry == word || entry.length < minLength ) continue;        
				if (word.indexOf(entry) >=0) result.push(entry);
			}
			
			return result;
		},
		
		/**
		 * Returns all valid superstrings of the input word in the lexicon 
		 *
		 * @param {string} word
		 * @returns {array} matching words 
		 */
		superstrings: function(word) { 
			
			var entry, result =[];
			
			for  (entry in RiLexicon.data){
				if (entry == word) continue;
				if (entry.indexOf(word) >= 0) 
					result.push(entry);
			}
			
			return result;
		},
		
		/**
		 * First calls similarBySound(), then filters the result set by the algorithm 
		 * used in similarByLetter(); 
		 * 
		 * (useful when similarBySound() returns too large a result set)
		 * 
		 * @param {string} word
		 * @returns {array} matching words 
		 */
		similarBySoundAndLetter: function(word) { 
			
			var simSound, simLetter, result = [];

			simSound = this.similarBySound(word);
			simLetter = this.similarByLetter(word);
			
			if (undef(simSound) || undef(simLetter)) 
				return result;
			
			for (var i=0; i<simSound.length; i++) {
				
				for (var j=0; j<simLetter.length; j++) {
					
					if (simSound[i] == simLetter[j]) 
						result.push(simLetter[j]);
				}
			}
			
			return result;
		},
		
		/**
		 * Returns the array of all words in the lexicon or those matching a specific regex. 
		 * If specified, the order of the result array is randomized before return.
		 *  
		 * @param {regex} regex (string or object) pattern to match (optional)
		 * @param {boolean} sorted In sorted order when true (optional, default=false)
		 * @returns {array} words in the RiLexicon  
		 */
		words : function() {
			
			var a = arguments, sorted = false, regex = undefined, 
				wordArr = [], words =  okeys(RiLexicon.data);
			
			switch (a.length) {
				
				case 2:
					
					if (is(a[0],B)) {
						sorted = a[0];
						regex = (is(a[1],R)) ? a[1] : new RegExp(a[1]);
					} 
					else {
						sorted = a[1];
						regex = (is(a[0],R)) ? a[0] : new RegExp(a[0]);
					}

					break;
					
				case 1:
										
					if (is(a[0],B)) {
						return a[0] ? shuffle(words) : okeys(words);
					}
					
					regex = (is(a[0],R)) ? a[0] : new RegExp(a[0]);
					
					break;
					
				case 0:
					
					return shuffle(words);
			}

			for (var i = 0; i < words.length; i++) {
				
				if (words[i].match(regex)) {
					
					wordArr.push(words[i]);
				}
			}
			
			// TODO: make sure we have a test for both sorted=false/true

			return sorted ? wordArr : shuffle(wordArr);  
		},
		
		/**
		 * Returns true if c is a vowel
		 * @param {char} c
		 * @returns {boolean}
		 */
		_isVowel : function(c) {

			return (strOk(c) && RiTa.VOWELS.indexOf(c) > -1);
		},

		/**
		 * Returns true if c is a consonant
		 * @param {char} p
		 * @returns {boolean}
		 */
		_isConsonant : function(p) {

			return (typeof p == S && p.length==1 && 
				RiTa.VOWELS.indexOf(p) < 0 && /^[a-z\u00C0-\u00ff]+$/.test(p));  
		},

		/**
		 * Returns true if the word exists in the lexicon (case-insensitive)
		 * @param {string} word
		 * @returns {boolean} 
		 */
		containsWord : function(word) {

			return (strOk(word) && RiLexicon.data && !undef(RiLexicon.data[word.toLowerCase()]));
		},
		
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
			
			var p1 = this._lastStressedPhoneToEnd(word1), 
				p2 = this._lastStressedPhoneToEnd(word2);
			
			return (strOk(p1) && strOk(p2) && p1 === p2);  
		},

		/**
		 * 
		 * Two words rhyme if their final stressed vowel and all following phonemes are identical.
		 * @param {string} word
		 * @returns {array} strings of the rhymes for a given word, or empty array if none are found
		 */
		rhymes : function(word) {

			//this._buildWordlist_();

			if (this.containsWord(word)) {

				var p = this._lastStressedPhoneToEnd(word);
				var entry, entryPhones, results = [];

				for (entry in RiLexicon.data) {
					if (entry === word)
						continue;
					entryPhones = this._getRawPhones(entry);

					if (strOk(entryPhones) && endsWith(entryPhones, p)) {
						results.push(entry);
					}
				}
				return (results.length > 0) ? results : EA; 
			}
			
			return EA; 
		},

		/**
		 * Finds alliterations by comparing the phonemes of the input string to those of each word in the lexicon
		 * 
		 * @param {string} word input
		 * @returns {array} strings of alliterations
		 */
		alliterations : function(word) {

			if (this.containsWord(word)) {

				var c2, entry, results = [];
				var c1 = this._firstConsonant(this._firstStressedSyllable(word));

				for (entry in RiLexicon.data) {
					
					c2 = this._firstConsonant(this._firstStressedSyllable(entry));
					
					if (c2 && c1 === c2) {
						results.push(entry);
					}
				}
				return (results.length > 0) ? results : EA; 
			}
			return EA;
		},

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

			var c1 = this._firstConsonant(this._firstStressedSyllable(word1)),
				c2 = this._firstConsonant(this._firstStressedSyllable(word2));

			//log("'"+c1+"'=?'"+c2+"'");
			
			return (strOk(c1) && strOk(c2) && c1 === c2);  
		},

		/**
		 * Returns the first stressed syllable of the input word
		 * @param {string} word
		 * @returns {string}   
		 */
		_firstStressedSyllable : function(word) {

			var raw = this._getRawPhones(word), idx = -1, c, firstToEnd;

			if (!strOk(raw)) return E; // return null?
			
			idx = raw.indexOf(RiTa.STRESSED);

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
		},
		
		/**  
		 * Returns true for 'word' if it has a verb form. That is, if any of its possible parts of speech 
		 *  are any variant of a verb in the PENN part-of-speech tag set (e.g. vb, vbg, vbd, vbp, vbz));
		 * @param {string} word the PENN part-of-speech tag
		 * @returns {boolean} true if the word can be used as a verb 
		 */
		isVerb: function(word) {

			return this._checkType(word, PosTagger.VERBS);
		},
 
		
		/**
		 * Returns true for 'word' if it has a noun form. That is, if any of its possible parts of speech 
		 *  are any variant of a noun in the PENN part-of-speech tag set(e.g. nn, nns, nnp, nnps)
		 * @param {string} word the PENN part-of-speech tag
		 * @returns {boolean} true if the word can be used as a noun
		 */
		isNoun : function(word) {

			return this._checkType(word, PosTagger.NOUNS);
		},
		
		/**
		 * Returns true for 'word' if it has an adverb form. That is, if any of its possible parts of speech 
		 *  are any variant of an adverb in the PENN part-of-speech tag set (e.g. rb, rbr, rbs)
		 * @param {string} word the PENN part-of-speech tag
		 * @returns boolean} true if the word can be used as an adverb 
		 */
		isAdverb : function(word) {
			//log("isAdverb("+word+")");
			return this._checkType(word, PosTagger.ADV);
		},
		
		/**
		 * Returns true for 'word' if it has an adjective form. That is, if any of its possible parts of speech 
		 *  are any variant of an adjective in the PENN part-of-speech tag set (e.g. jj, jjr, jjs)
		 * @param {string} word the PENN part-of-speech tag
		 * @returns {boolean} true if the word can be used as an adjective 
		 */
		isAdjective : function(word) {
			
			return this._checkType(word, PosTagger.ADJ);
		},
		
		
		/**
		 * Returns the number of words currently in the lexicon 
		 * @returns {number} words
		 */
		size : function() {
			
			return RiLexicon.data ? okeys(RiLexicon.data).length : 0
		},

		_checkType: function(word, tagArray) {

			if (word && word.indexOf(SP) != -1) 
				 throw Error("_checkType() expects a single word, found: "+word); 

			var psa = this._getPosArr(word);
			for (var i = 0; i < psa.length; i++) {
				if (tagArray.indexOf(psa[i].toUpperCase()) > -1)
					return true;
			} 
			
			return false;  
		 },
		 
		/**
		 * Returns a String containing the phonemes for each syllable of each word of the input text, 
		 * delimited by dashes (phonemes) and semi-colons (words). 
		 * For example, the 4 syllables of the phrase 
		 * 'The dog ran fast' are "dh-ax:d-ao-g:r-ae-n:f-ae-s-t".
		 * 
		 * @param {string} word
		 * 
		 * @returns {string} the phonemes for each syllable of each word
		 */
		_getSyllables : function(word) {
			
			// TODO: use feature cache?
			
			if (!strOk(word)) return E;
			
			var wordArr = RiTa.tokenize(word), raw = [];
			
			for (var i=0; i< wordArr.length; i++) {
				
				raw[i] = this._getRawPhones(wordArr[i]).replace(/\s/g, '/');
			}
			
			return RiTa.untokenize(raw).replace(/1/g, E).trim();
		},

		/**
		 * Returns a String containing all phonemes for the input text, delimited by semi-colons
		 * 
		 * @example "dh:ax:d:ao:g:r:ae:n:f:ae:s:t"
		 * 
		 * @param {string} word
		 * 
		 * @returns {string} all phonemes,
		 */
		_getPhonemes : function(word) {
			
			// TODO: use feature cache?

			if (!strOk(word)) return E;
			
			var wordArr = RiTa.tokenize(word), raw = [];
			
			for (var i=0; i< wordArr.length; i++)
			{

				if (RiTa.isPunctuation(wordArr[i])) continue;

				// raw[i] = wordArr[i].length
				raw[i] = this._getRawPhones(wordArr[i]);

				if (!raw[i].length) return E;
					//err("Unable to lookup (need LTSEngine): "+wordArr[i]);

				raw[i] = raw[i].replace(/ /g, "-");
			}

			return RiTa.untokenize(raw).replace(/1/g, E).trim(); 
		},

		/**
		 * Returns a String containing the stresses for each syllable of the input text, delimited by semi-colons, 
		 * @example "0:1:0:1", with 1's meaning 'stressed', and 0's meaning 'unstressed', 
		 * 
		 * @param {string} word
		 * 
		 * @returns {string} stresses for each syllable
		 */
		_getStresses : function(word) {

			var stresses = [], phones, raw = [],
				wordArr = is(word,A) ? word : RiTa.tokenize(word);

			if (!strOk(word)) return E;
			
			for (var i=0; i< wordArr.length; i++) {
				
				if (!RiTa.isPunctuation(wordArr[i]))
					raw[i] = this._getRawPhones(wordArr[i]);
			}

			for (var i = 0; i < raw.length; i++) {

				if (raw[i]) { // ignore undefined array items (eg Punctuation)
					
					phones = raw[i].split(SP);
					for (var j = 0; j < phones.length; j++) {

						var isStress = (phones[j].indexOf(RiTa.STRESSED) > -1) 
							? RiTa.STRESSED : RiTa.UNSTRESSED;
						
						if (j > 0) isStress = "/" + isStress;

						stresses.push(isStress);            
					}
				}
			}
			
			return stresses.join(SP).replace(/ \//g, "/");
		},
		
		
		/**
		 * Allows one to set/get the raw dictionary data used to create the default lexicon.
		 * See RiLexicon.addWord() for data format
		 * 
		 * @param {object} dictionaryDataObject mapping words to their pronunciation/pos data (optional, for sets only)
		 * @returns {object} this RiLexicon or lexical data (for gets)
		 */
		lexicalData : function(dictionaryDataObject) {

			
			if (arguments.length == 1) {
				RiLexicon.data = dictionaryDataObject;
				return this;
			}

			return RiLexicon.data;
		},
		
		/**
		 * Returns the raw (RiTa-format) dictionary entry for the given word 
		 * 
		 * @param {string} word
		 * 
		 * @returns {array} a 2-element array of strings, 
		 * the first is the stress and syllable data, 
		 * the 2nd is the pos data, or null if the word is not found
		 */
		_lookupRaw : function(word) {

			word = word.toLowerCase();

			if (RiLexicon.data && RiLexicon.data[word]) 
				return RiLexicon.data[word];
			
			//log("[RiTa] No lexicon entry for '" + word + "'");
			
			return null;
		},
		

		_getRawPhones : function(word) {
			
			var data = this._lookupRaw(word);
			return (data && data.length==2) ? data[0] : E; 
		},


		_getPosData : function(word) {
			
			var data = this._lookupRaw(word);
			return (data && data.length==2) ? data[1] : E; 
		},

		
		_getPosArr : function(word) { 
			
			var pl = this._getPosData(word);
			
			if (!strOk(pl)) return EA;
			
			return pl.split(SP);  
		},

		_getBestPos : function(word) { 
			
			var pl = this._getPosArr(word);
			
			return (pl.length > 0) ? pl[0] : [];
		},


		
		_firstConsonant : function(rawPhones) {

			if (!strOk(rawPhones)) return E; 
			
			var phones = rawPhones.split(RiTa.PHONEME_BOUNDARY);
			// var phones = rawPhones.split(PHONEME_BOUNDARY);
			
			if (!undef(phones)) {
				
				for (var j = 0; j < phones.length; j++) {
					if (this._isConsonant(phones[j].charAt(0))) // first letter only
						return phones[j];
				}
			}
			return E; // return null?  
		},
		

		_lastStressedPhoneToEnd : function(word) {

			if (!strOk(word)) return E; // return null?
			
			var idx, c, result;
			var raw = this._getRawPhones(word);

			if (!strOk(raw)) return E; // return null?
			
			idx = raw.lastIndexOf(RiTa.STRESSED);
			
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
		},

		/**
		 * Returns a random word from the lexicon
		 * 
		 * @param {string} pos (optional)
		 * @param {number} syllableCount (optional)
		 * @returns {string} random word
		 */
		randomWord : function() {  // takes nothing, pos, syllableCount, or both 
			
			var found = false, a = arguments, wordArr = okeys(RiLexicon.data),
				ran = Math.floor(Math.random() * okeys(RiLexicon.data).length),
				ranWordArr = shuffle(wordArr);
			
			switch (a.length) {
					
				case 2: //a[0]=pos  a[1]=syllableCount
					
						a[0] = trim(a[0].toUpperCase()); 
						
						for (var j = 0; j < PosTagger.TAGS.length; j++) { 
							
							if (PosTagger.TAGS[j] == a[0]) found = true;
						} 
						

						if (found) { 
							
							a[0] = a[0].toLowerCase(); 
							
							for (var i=0; i< ranWordArr.length; i++){
								
								var data = this._lookupRaw(ranWordArr[i]);
								var posTag = RiTa.getPosTags(ranWordArr[i]);
								
								if (data[0].split(SP).length == a[1] && a[0] == this._getBestPos(ranWordArr[i])) {
									return ranWordArr[i];
								}
							} 
						} 
						
						return E;
						
					break;
					
				case 1:
					
					if (is(a[0],S)) { // a[0] = pos
						
						a[0] = trim(a[0].toUpperCase()); 
						
						for(var j = 0; j < PosTagger.TAGS.length; j++) {
							
							if (PosTagger.TAGS[j] == a[0]) found = true;
						} 
						
						if (found) { 
							
							a[0] = a[0].toLowerCase();

							
							for(var i=0; i< ranWordArr.length; i++){
								
								var thePos = this._getBestPos(ranWordArr[i]);
								if (a[0] == thePos) {
									return ranWordArr[i];
								}
							} 
						} 
					}
					
					else { // a[0] = syllableCount    
						
						for(var i=0; i< ranWordArr.length; i++) {
							
							var data = this._lookupRaw(ranWordArr[i]);
							
							if (data[0].split(SP).length == a[0]) {
								
								return ranWordArr[i];
							}
						} 
					}
					
					break;
					
				case 0:
					
					return wordArr[ran];
			}
			
			return E;
		}
	}
	
	
	var Phones =        
	{
		  consonants: [ 'b', 'ch', 'd', 'dh', 'f', 'g', 'hh', 'jh', 'k', 'l', 'm', 'n', 
						'ng', 'p', 'r', 's', 'sh', 't', 'th', 'v', 'w', 'y', 'z', 'zh' ],

		  vowels: [ 'aa', 'ae', 'ah', 'ao', 'aw', 'ax', 'ay', 'eh', 'er', 'ey', 'ih', 'iy',
					'ow', 'oy', 'uh', 'uw' ],
	
		  onsets: [ 'p', 't', 'k', 'b', 'd', 'g', 'f', 'v', 'th', 'dh', 's', 'z', 'sh', 'ch', 'jh', 'm',
					'n', 'r', 'l', 'hh', 'w', 'y', 'p r', 't r', 'k r', 'b r', 'd r', 'g r', 'f r',
					'th r', 'sh r', 'p l', 'k l', 'b l', 'g l', 'f l', 's l', 't w', 'k w', 'd w', 
					's w', 's p', 's t', 's k', 's f', 's m', 's n', 'g w', 'sh w', 's p r', 's p l',
					's t r', 's k r', 's k w', 's k l', 'th w', 'zh', 'p y', 'k y', 'b y', 'f y', 
					'hh y', 'v y', 'th y', 'm y', 's p y', 's k y', 'g y', 'hh w', '' ],
	
		  digits: [ 'z-ih-r-ow', 'w-ah-n', 't-uw', 'th-r-iy', 'f-ao-r', 'f-ay-v', 's-ih-k-s', 
					's-eh1-v-ax-n', 'ey-t', 'n-ih-n' ]
	}
	
	////////////////////////////////////////////////////////////////
	// RiString
	////////////////////////////////////////////////////////////////
	
	
	/**
	 * @name RiString
	 * 
	 * @class The basic text container object, implementing a variety of 
	 * additional functionality atop the javascript string object
	 */
	var RiString = makeClass();

	
	/**
	 *  Syllabifies the input, given a string or array of phonemes in CMU Pronunciation Dictionary format 
	 *   (with optional stress numbers after vowels), e.g. "B AE1 T" or ["B", "AE1", "T"]'''
	 *       
	 *  @param {string or array} input
	 *  @returns {string} 
	 */
	RiString._syllabify = function(input) {
	   
		var dbug, None=undefined, internuclei = [], syllables = [],   // returned data structure.
			sylls = ((typeof (input) == 'string') ? input.split('-') : input);

		for (var i = 0; i < sylls.length; i++) {
		
			var phoneme = sylls[i].trim(), stress = None;

			if (!phoneme.length) continue;
			
			if ( isNum(last(phoneme)) ) {
				
				stress = parseInt(last(phoneme));
				phoneme = phoneme.substring(0, phoneme.length-1);
			}
			
			if (dbug)console.log(i+")"+phoneme + ' stress='+stress+' inter='+internuclei.join(':'));
			
			if (inArray(Phones.vowels, phoneme)) {
	 
				// Split the consonants seen since the last nucleus into coda and onset.            
				var coda = None, onset = None;
				
				// Make the largest onset we can. The 'split' variable marks the break point.
				for (var split = 0; split < internuclei.length+1; split++) {
					
					coda  = internuclei.slice(0, split);
					onset = internuclei.slice(split, internuclei.length);
					
					if (dbug)console.log('  '+split+') onset='+onset.join(':')+
						'  coda='+coda.join(':')+'  inter='+internuclei.join(':'));
					
					// If we are looking at a valid onset, or if we're at the start of the word
					// (in which case an invalid onset is better than a coda that doesn't follow
					// a nucleus), or if we've gone through all of the onsets and we didn't find
					// any that are valid, then split the nonvowels we've seen at this location.
					var bool = inArray(Phones.onsets, onset.join(" "));
					if (bool || syllables.length == 0 || onset.length == 0) {
						if (dbug)console.log('  break '+phoneme);
					   break;
					}
				}
				
				//if (dbug)console.log('  onset='+join(',',onset)+'  coda='+join(',',coda));
				
				// Tack the coda onto the coda of the last syllable. Can't do it if this
				// is the first syllable.
				if (syllables.length > 0 ) {
					
					//syllables[syllables.length-1][3] = syllables[syllables.length-1][3] || [];
					//console.log('  len='+syllables[syllables.length-1][3].length);
					extend(syllables[syllables.length-1][3], coda);
					if (dbug) console.log('  tack: '+coda+' -> len='+syllables[syllables.length-1][3].length+" ["+syllables[syllables.length-1][3]+"]");
				}
				
				// Make a new syllable out of the onset and nucleus.

				var toPush = [ [stress], onset, [phoneme], [] ];
				syllables.push(toPush);
					
				// At this point we've processed the internuclei list.
				internuclei = [];
			}
			
			else if (!inArray(Phones.consonants, phoneme) && phoneme != " ") {
				throw Error('Invalid phoneme: ' + phoneme);
			}
				
			else { // a consonant
				
				//console.log('inter.push: '+phoneme);
				internuclei.push(phoneme)
			}
		}
	  
		
		// Done looping through phonemes. We may have consonants left at the end.
		// We may have even not found a nucleus.
		if (internuclei.length > 0) {

			if (syllables.length == 0) {
				
				syllables.push([ [None], internuclei, [], [] ]);
			}
			else {
				
				extend(syllables[syllables.length-1][3], internuclei);
			}
				
		}

		return RiString._stringify(syllables);
	}
	  
	/*
	 * Takes a syllabification and turns it into a string of phonemes, 
	 * delimited with dashes, and spaces between syllables 
	 */
	RiString._stringify = function(syllables) {
			
		var ret = [];
		for (var i = 0; i < syllables.length; i++) {
			
			var syl = syllables[i];
			var stress = syl[0][0];
			var onset = syl[1];
			var nucleus = syl[2];
			var coda = syl[3];
		  
			if (stress != undefined && nucleus.length) // dch
				nucleus[0] += (E+stress);
			
			var data = [];
			for (var j = 0; j < onset.length; j++) 
				data.push(onset[j]);
			
			for (var j = 0; j < nucleus.length; j++) 
			   data.push(nucleus[j]);
			
			for (var j = 0; j < coda.length; j++) 
			   data.push(coda[j]);
			
			ret.push(data.join('-'));
		}
		
		return ret.join(SP);
	}
	
	// ////////////////////////////////////////////////////////////
	// Member functions
	// ////////////////////////////////////////////////////////////
	
	RiString.prototype = {
			
		/**
		 * The RiString constructor function
		 * 
		 * @param {string} the text 
		 */
		init : function(text) {
			
			if (is(text,N)) {
				
				text = String.fromCharCode(text);
			}
			
			ok(text,S);
			this._text = text;
			this._features = undefined;
		},
		
		copy : function() {

			var rs = RiString(this._text), feats = this.features();

			rs._features = {};

			for(var prop in feats) {

    			rs._features[prop] = feats[prop];
			}
			return rs;
		},
			
		/**
		 * Returns the full feature set for this object, first computing the default
		 * features if necessary
		 * 
		 * @see #get
		 * @see #analyze
		 * 
		 * @returns {array} the features 
		 */
		features : function() {
			
		   this._features || this.analyze();
		   return this._features;
		},
		
		_initFeatureMap : function() {

			this._features = {};					    
		    this._features.mutable = "true";
		    this._features.text = this.text();
		},
		
		/**
		 * Computes a set of features for the contained string, including
		 * phonemes, syllables, stresses, etc.
		 * 
		 * To access any of these, use get(name), e.g., 
		 * 
		 * @example myRiString.get('phonemes') ||  myRiString.get(RiTa.PHONEMES);
		 * 
		 * @returns this RiString
		 */
		analyze : function() {
	
			var phonemes = E, syllables = E, stresses = E, slash = '/',  delim = '-',
				phones, lts, ltsPhones, useRaw, words = RiTa.tokenize(this._text), 
				lts, stressyls, lex = RiLexicon();//._getInstance(); 
			
			if (!this._features) this._initFeatureMap();
			
			for (var i = 0, l = words.length; i < l; i++) {
				
				useRaw = false;
				
				phones = lex._getRawPhones(words[i]); 
				
				if (!phones) {
					
					if (words[i].match(/[a-zA-Z]+/))
						log("[RiTa] Used LTS-rules for '"+words[i]+"'");
					
					lts = lts || LetterToSound();
					
					
					ltsPhones = lts.getPhones(words[i]);
					
					if (ltsPhones && ltsPhones.length>0) {
						
						phones = RiString._syllabify(ltsPhones);
					}
					else {
						phones = words[i];
						useRaw = true;
					} 
				}
 
				phonemes += phones.replace(/[0-2]/g, E).replace(/ /g, delim) + SP;
				syllables += phones.replace(/ /g, slash).replace(/1/g, E) + SP;

				if (!useRaw) {
					stressyls = phones.split(SP);   
					for (var j = 0; j < stressyls.length; j++) {
	
						if (!stressyls[j].length) continue;
						
						stresses += (stressyls[j].indexOf(RiTa.STRESSED) > -1) 
							? RiTa.STRESSED : RiTa.UNSTRESSED;
						
						if (j < stressyls.length-1) stresses += slash;      
					}
				}
				else {
					
					stresses += words[i];
				}
				
				if (!endsWith(stresses, SP)) stresses += SP;     
			}
			
			this._features.tokens = words.join(SP);
			this._features.stresses = stresses.trim();
			this._features.phonemes = phonemes.trim().replace(/\\s+/, SP);
			this._features.syllables = syllables.trim().replace(/\\s+/, SP);
			this._features.pos = RiTa.getPosTags(this._text).join(SP);
			
			return this;
		},
		
		/**
		 * Returns the specified feature, computing it first if necessary. 
		 * Default features include RiTa.STRESSES, RiTa.PHONEMES, and RiTa.SYLLABLES.
		 * 
		 * @example myRiString.get('phonemes') ||  myRiString.get(RiTa.PHONEMES);
		 * 
		 * @returns {string} the requested feature
		 */
		get : function(featureName) {
			
			this._features || this.analyze();
			return this._features[featureName.toLowerCase()];  
		},
	

		/**
		 * Tests if this string ends with the specified suffix.
		 * 
		 * @param {string} substr string the suffix.
		 * 
		 * @returns {boolean} true if the character sequence represented by the argument is a suffix of
		 *         the character sequence represented by this object; false otherwise.          * 
		 */
		endsWith : function(substr) {
			
			return endsWith(this._text, substr);  
		},
			 
		/**
		 * Compares this RiString to the specified object. The result is true if and only if the
		 * argument is not null and is a String or RiString object that represents the same sequence 
		 * of characters as this object.
		 * 
		 * @param {string | object} str String or RiString object to compare this RiString against
		 * @returns {boolean} true if the RiString are equal; false otherwise.
		 */
		equals : function(arg) {
			
			return (typeof arg === S) ? arg === this._text :  arg.text() === this._text; 
		},

		/**
		 * Compares this RiString to another RiString, ignoring case considerations.
		 * 
		 * @param {string | object} arg String or RiString object to compare this RiString against
		 * @returns {boolean} true if the argument is not null and the Strings are equal, ignoring
		 *         case; false otherwise.
		 */
		equalsIgnoreCase : function(arg) {
			
			if (typeof arg === S) {
				
				return arg.toLowerCase() === this._text.toLowerCase();
			} 
			else {
				
				return arg.text().toLowerCase() === this._text.toLowerCase();
			}
		},

		/**
		 * Gets/sets the text contained by this object
		 * 
		 * @param {string} text (optional)
		 * 
		 * @returns {object | string} the contained text (for sets) or this RiString (for gets)
		 */
		text : function(theText) {
			
			if (arguments.length>0) {
				this._text = theText;
				this._initFeatureMap();
				return this;
			}
			return this._text;
		},

		/**
		 * Returns an array of part-of-speech tags, one per word, using RiTa.tokenize() and RiTa.getPosTags().
		 *
		 * @returns {array} strings of pos, one per word
		 */
		pos : function() {
				   
			var words = RiTa.tokenize((this._text)); // was getPlaintext()
			var tags = PosTagger.tag(words); 
  
			for ( var i = 0, l = tags.length; i < l; i++) {
				if (!strOk(tags[i])) 
					err("RiString: can't parse pos for:" + words[i]);
			}
		
			return tags;            
		},

		/**
		 * Returns the part-of-speech tag for the word at 'index', using RiTa.tokenize() and RiTa.getPosTags().
		 * 
		 * @param {number} index the word index
		 * @returns {string} the pos
		 */
		posAt : function(index) {
			
			var tags = this.pos();

			if (undef(tags) || tags.length == 0 || index < 0 || index >= tags.length)
				return E;
			
			return tags[index];
		},

		/**
		 * Returns the word at 'index', according to RiTa.tokenize()
		 * 
		 * @param {number} index the word index
		 * @returns {string} the word
		 */
		wordAt : function(index) {
			
			var words = RiTa.tokenize((this._text));
			if (index < 0 || index >= words.length)
				return E;
			return words[index];  
		},

		/**
		 * Returns the number of words in the object, according to RiTa.tokenize().
		 * 
		 * @returns {number} number of words
		 */
		wordCount : function() {
			
			if (!this._text.length) return 0;
			return this.words().length;  
		},

		/**
		 * Returns the array of words in the object, via a call to RiTa.tokenize().
		 * 
		 * @returns {array} strings, one per word
		 */
		words : function() { //TODO: change to words()
			
			return RiTa.tokenize(this._text);  
		},

		/**
		 * Returns the index within this string of the first occurrence of the specified character.
		 * 
		 * @param {string} searchstring (Required) or character to search for
		 * @param {number} start (Optional) The start position in the string to start the search. If omitted,
		 *        the search starts from position 0
		 * @returns {number} the first index of the matching pattern or -1 if none are found
		 */
		indexOf : function(searchstring, start) {
			
			return this._text.indexOf(searchstring, start);   
		},

		/**
		 * Returns the index within this string of the last occurrence of the specified character.
		 * 
		 * @param {string} searchstring The string to search for
		 * @param {number} start (Optional) The start position in the string to start the search. If omitted,
		 *        the search starts from position 0
		 *        
		 * @returns {number} the last index of the matching pattern or -1 if none are found
		 */
		lastIndexOf : function(searchstring, start) {
			
			return this._text.lastIndexOf(searchstring, start);
		},

		/**
		 * Returns the length of this string.
		 * 
		 * @returns {number} the length
		 */
		length : function() {
			
			return this._text.length;  
		},

		/**
		 * Searches for a match between a substring (or regular expression) and the contained
		 * string, and _returns the matches
		 * 
		 * @param {string} regex Regular expression
		 * @returns {array} strings matches or empty array if none are found

		 */
		match : function(regex) {
			
			var result = this._text.match(regex);
			return undef(result) ?  [] : result;   
		},
		
		
		/**
		 * Extracts a part of a string from this RiString
		 * 
		 * @param {number} begin (Required) The index where to begin the extraction. First character is at
		 *        index 0
		 * @param {number} end (Optional) Where to end the extraction. If omitted, slice() selects all
		 *        characters from the begin position to the end of the string
		 * @returns {String} 
		 */
		slice : function(begin, end) {
			
			return this._text.slice(begin, end) || E;  
		},

		/**
		 * Replaces each substring of this string that matches the given regular expression with the
		 * given replacement.
		 * 
		 * @param {string | regex } pattern the pattern to be matched
		 * @param {string} replacement the replacement sequence of char values
		 * @returns {object} this RiString
		 */
		replaceAll : function(pattern, replacement) {
			
			if (pattern && (replacement || replacement==='')) {
				this._text = replaceAll(this._text, pattern, replacement);
			}
			return this;   
		},

		/**
		 * Inserts the character at 'idx'.
		 * If the specified 'idx' is less than zero, or beyond the
		 * length of the current text, there will be no effect.
		 * 
		 * @param {number} idx the character index
		 * @param {string} replaceWith the replacement
		 * @returns {object} this RiString
		 */
		insertChar : function(idx, toInsert) {
			
			var s = this.text();
			
			if (idx > s.length || idx < -s.length) {
				console.warn("RiString.insertChar: bad index="+idx);
				return this;
			}

			 
			idx = idx < 0 ? idx += s.length : idx;
			var beg = s.substring(0, idx);
			var end = s.substring(idx);
		 
			if (toInsert) beg += toInsert;

			return this.text(beg+end);
		},
		 
	 	/**
		 * Removes the character at the specified index
		 * 
		 * @param {number} idx the index
		 * @returns {object} this RiString
		 */
		removeChar : function(idx) { 
			
			var s = this.text();
			
			if (idx > s.length || idx < -s.length) {
				console.warn("RiString.removeChar: bad index="+idx);
				return this;
			}
			idx = idx < 0 ? idx += s.length : idx;
			
			this.text(this._text.substring(0, idx).concat(this._text.substring(idx + 1)));
			return this;   
		},

		/**
		 * Replaces the character at 'idx' with 'replaceWith'.
		 * If the specified 'idx' is less than zero, or beyond the
		 * length of the current text, there will be no effect.
		 * 
		 * @param {number} idx the character index
		 * @param {string} replaceWith the replacement
		 * @returns {object} this RiString
		 */
		replaceChar : function(idx, replaceWith) {
			
			var s = this.text();
			
			if (idx > s.length || idx < -s.length) {
				console.warn("RiString.replaceChar: bad index="+idx);
				return this;
			}
			idx = idx < 0 ? idx += s.length : idx;
				
			var s = this.text();
			var beg = s.substring(0, idx);
			var end = s.substring(idx + 1);
		 
			if (replaceWith)
				beg += replaceWith;

			return this.text(beg+end);
		},

		/**
		 * Replaces the first instance of 'regex' with 'replaceWith'
		 * 
		 * @param {string | regex} regex the pattern
		 * @param {string} replaceWith the replacement
		 * 
		 * @returns this RiString
		 */
		replaceFirst : function(regex, replaceWith) {
			
			this._text = this._text.replace(regex, replaceWith);
			return this;  
		},
		
		/**
		 * Replaces the last instance of 'regex' with 'replaceWith'
		 * 
		 * @param {string | regex} regex the pattern
		 * @param {string} replaceWith the replacement
		 * 
		 * @returns this RiString
		 */
		replaceLast : function(regex, replaceWith) {
			
			//TODO: this fails for '?', other regex chars? Make TEST
			
			if (!regex) return this;
			
			var ret = this._text;

			if (is(regex, S)) {

				var len = regex.length, idx = ret.lastIndexOf(regex);
				if (idx >= 0) {
					
					this._text = ret.substring(0, idx) + replaceWith + ret.substring(idx + len);
				}	
			} 
			else {

				var matches = ret.match(regex);
				if (matches) {

					var target = matches.pop(), tmp = this._text.split(target), last = tmp.pop();
					tmp[tmp.length - 1] += replaceWith + last;
					ret = tmp.join(target);
				}

				this._text = ret;
			}

			return this;
		},
		
		/**
		 * Removes the word at 'wordIdx'.
		 * 
		 * @param {number} wordIdx the index
		 * 
		 * @returns {object} this RiString
		 */
		removeWord : function(wordIdx) {
			
			return this.replaceWord(wordIdx, E);
		},    
			
		/**
		 * Replaces the word at 'wordIdx' with 'newWord'
		 * 
		 * @param {number} wordIdx the index
		 * @param {string} newWord the replacement
		 * 
		 * @returns {object} this RiString
		 */
		insertWord : function(wordIdx, newWord) {

			var words = this.words(); //  tokenize
			
			if (wordIdx < 0) wordIdx += words.length;
			
			// log("insertWord("+ newWord+', '+wordIdx+") -> words["+wordIdx+"] = " + words[wordIdx]);
			
			if (newWord && newWord.length>=0 && wordIdx >= 0 && wordIdx < words.length) {
				
				words[wordIdx] = newWord + SP + words[wordIdx];
				
				this.text(RiTa.untokenize(words));
			}
			
			return this;  
		},
			
		/**
		 * Replaces the word at 'wordIdx' with 'newWord'
		 * 
		 * @param {number} wordIdx the index
		 * @param {string} newWord the replacement
		 * 
		 * @returns {object} this RiString
		 */
		replaceWord : function(wordIdx, newWord) {
			
			//console.log("replaceWord: "+wordIdx+", '"+newWord+"'");
			
			var words = this.words(); //  tokenize
			
			if (wordIdx < 0) wordIdx += words.length;
			
			if ((newWord || newWord===E) && wordIdx >= 0 && wordIdx < words.length) {
				
				words[wordIdx] = newWord;
				
				this.text(RiTa.untokenize(words));
			}
			
			return this;  
		}, 

		/**
		 * Split a RiString into an array of sub-RiString and return the new array.
		 * 
		 * If an empty string ("") is used as the separator, the string is split between each character.
		 * 
		 * @param {string} separator (Optional) Specifies the character to use for splitting the string. If
		 *        omitted, the string will be tokenized according to RiTa.tokenize(). 
		 * 		  If an empty string ("") is used as the separator, 
		 *        the string is split between each character.
		 *        
		 * @param {number} limit (Optional) An integer that specifies the number of splits
		 * 
		 * @returns {array} RiStrings
		 */
		split : function(separator, limit) {
			
			var parts = this._text.split(separator, limit);
			var rs = [];
			for ( var i = 0; i < parts.length; i++) {
				if (!undef(parts[i]))
					rs.push(new RiString(parts[i]));
			}
			return rs;  
		},

		/**
		 * Tests if this string starts with the specified prefix.
		 * 
		 * @param {string} substr string the prefix
		 * @returns {boolean} true if the character sequence represented by the argument is a prefix of
		 *         the character sequence represented by this string; false otherwise. Note also
		 *         that true will be returned if the argument is an empty string or is equal to this
		 *         RiString object as determined by the equals() method.
		 */
		startsWith : function(substr) {
			
			return this.indexOf(substr) == 0;  
		},

		/**
		 * Extracts the characters from this objects contained string, beginning at 'start' and
		 * continuing through the specified number of characters, and sets the current text to be
		 * that string. (from Javascript String)
		 * 
		 * @param {number} start  The index where to start the extraction. First character is at
		 *        index 0
		 * @param {number} length (optional) The index where to stop the extraction. If omitted, it extracts the
		 *        rest of the string
		 * @returns {String}
		 */
		substr : function(start, length) {
			
			return this._text.substr(start, length);
			// return this.text(res);
		},

		/**
		 * Extracts the characters from a string, between two specified indices, and sets the
		 * current text to be that string. 
		 * 
		 * @param {number} from  The index where to start the extraction. First character is at
		 *        index 0
		 * @param {number} to (optional) The index where to stop the extraction. If omitted, it extracts the
		 *        rest of the string
		 * @returns {String} 
		 */
		substring : function(from, to) {

			// return this.text(this._text.substring(from, to));
			return this._text.substring(from, to);
		},

		/**
		 * Converts this object to an array of RiString objects, one per character
		 * 
		 * @returns {array} RiStrings with each letter as its own RiString element
		 */
		toCharArray : function() {
			var parts = this._text.split(E);
			var rs = [];
			for ( var i = 0; i < parts.length; i++) {
				if (!undef(parts[i]))
					rs.push(parts[i]);
			}
			return rs;
		},

		/**
		 * Converts all of the characters in this RiString to lower case
		 * 
		 * @returns {object} this RiString
		 */
		toLowerCase : function() {
			
			return this.text(this._text.toLowerCase());
		},

		/**
		 * Returns the contained string object
		 * 
		 * @returns {string}
		 */
		toString : function() {
			
			return "RiString["+this._text+"]";
		},

		/**
		 * Converts all of the characters in this RiString to upper case
		 * 
		 * @returns {object} this RiString
		 */
		toUpperCase : function() {
			
			return this.text(this._text.toUpperCase());
		},

		/**
		 * Returns a copy of the string, with leading and trailing whitespace omitted.
		 * 
		 * @returns {object} this RiString
		 */
		trim : function() {
			
			return this.text(trim(this._text));
		},

		/**
		 * Returns the character at the given 'index', or empty string if none is found
		 * 
		 * @param {number} index index of the character
		 * @returns {string} the character
		 */
		charAt : function(index) {

			return this._text.charAt(index);  
		},

		/**
		 * Concatenates the text from another RiString at the end of this one
		 * 
		 * @returns {object} this RiString
		 */
		concat : function(riString) {
			
			return this._text.concat(riString.text());  
		}
			   
	}

	// ////////////////////////////////////////////////////////////
	// RiGrammar
	// ////////////////////////////////////////////////////////////

	/**
	 * @name RiGrammar
	 * @class A probabilistic context-free grammar with literary extensions designed for text-generation
	 * <pre> 
		rg = new RiGrammar("mygrammar.g");
		println(rg.expand())
		</pre>
	 * 
	 * RiTa grammar files are JSON-formatted text files that follow the format below:
	 *  <pre>   

		  "&lt;start&gt;": "&lt;rule1&gt; | &lt;rule2&gt; | &lt;rule3&gt;"
	
		  "&lt;rule2&gt;": "terminal1 |  terminal2 | &lt;rule1&gt;"
		
		   ...
		</pre>   
	 * <b>Primary methods of interest:</b>
	 * <ul>
	 * <li><code>expand()</code> which simply begins at the &lt;start&gt; state and 
	 * generates a string of terminals from the grammar.<p>
	 * <li><code>expandFrom(String)</code> which begins with the argument
	 * String (which can consist of both non-terminals and terminals,) 
	 * and expands from there. Notice that <code>expand()</code> is simply
	 * a convenient version of <code>expandFrom("&lt;start&gt;");</code>.<p>
	 * <li><code>expandWith(String, String)</code> takes 2 String arguments, the 1st 
	 * (a terminal) is guaranteed to be substituted for the 2nd (a non-terminal). Once this 
	 * substitution is made, the algorithm then works backwards (up the tree from the leaf)
	 * ensuring that the terminal (terminal1) appears in the output string. 
	 * For example, with the grammar fragment above, one might call:<p>
	   <pre>
			grammar.expandWith(terminal1, "&lt;rule2&gt;");
	  </pre>
	 * assuring not only that <code>&lt;rule2&gt;</code>will be used at least 
	 * once in the generation process, but that when it is, it will be replaced 
	 * by the terminal "hello".
	 *</ul>
	 *
	 *<li>A RiGrammar object will assign (by default) equal weights to all choices in a rule. 
	 *One can adjust the weights by adding 'multipliers' as follows: (in the rule below,
	 * 'terminal1' will be chosen twice as often as the 2 other choices.
	 * <pre>   
		 "&lt;rule2&gt;": "[2] terminal1 | terminal2 | &lt;rule1&gt;" 
	   </pre>
		
	 *<li>The RiGrammar object supports callbacks, from your grammar, back into your code.
	 * To generate a callback, add the method call in your grammar, surrounded by back-ticks, as follows:
	 * <pre>   
	 *     
	 *       "&lt;rule2&gt;": "The cat ran after the `pluralize('cat');` | \
	 *       The &lt;noun&gt; ran after the `pluralize(&lt;noun&gt;);`" 
	 *     </pre>
	 *     
	 * Any number of arguments may be passed in a callback, but for each call,
	 * there must be a corresponding method in the sketch, e.g.,
	 * 
	 * <pre>
	 *    function pluralize(theString) {
	 *      ...
	 *    }
	 * </pre>
	 * 
	 * @author dhowe 
	 */
	var RiGrammar = makeClass();
	
	RiGrammar.START_RULE = "<start>";
	RiGrammar.OPEN_RULE_CHAR = "<";
	RiGrammar.CLOSE_RULE_CHAR = ">";
	RiGrammar.PROB_PATT = /(.*[^\s])\s*\[([0-9.]+)\](.*)/;
	RiGrammar.OR_PATT = /\s*\|\s*/;
	RiGrammar.EXEC_PATT = /`[^`]+`/g;
	RiGrammar.STRIP_TICKS = /`([^`]*)`/g;
	
	/**
	 * Set/gets the execDisabled flag. Set to true (default=false) 
	 * if you don't want to use the exec mechanism for callbacks. Useful if you want
	 * to include backticks or method calls as terminals in your grammar.
	RiGrammar._execDisabled = function(disableExec)
	{
		if (arguments.length==1) {
			RiGrammar._execDisabled = disableExec;
		}
		return RiGrammar._execDisabled;
	}    
	*/

	RiGrammar.prototype = {

		/**
		 * Initializes a grammar, optionally accepting an object or JSON string containing the rules
		 * 
		 * @param  {none | string | object } grammar containing the grammar rules
		 */
		init : function(grammar) {
			
			(arguments.length == 0 || is(grammar,S) || ok(grammar, O)); 
			
			this._rules = {};
			this._execDisabled = false;
			grammar && this.setGrammar(grammar);  
		},
	
		/**
		 * Loads a JSON grammar via AJAX call to 'url', replacing any existing grammar. 
		 * @param {string} url of JSON file containing the grammar rules
		 * @returns {object} this RiGrammar
		 */
		_load : function(url) {
			
			this.reset();
			
			err("Implement me!");
			
			return this;
			
		},
	
		/**
		 * inits a grammar from an object or JSON string containing the rules (rather than a file)
		 * and replacing any existing grammar. 
		 * @param  {string | object} grammar containing the grammar rules
		 * @returns {object} this RiGrammar
		 */
		setGrammar : function(grammar) {
			
			this.reset();
			
			grammar = (typeof grammar == S) ?  JSON.parse(grammar) : grammar 
			
			for (var rule in grammar) 
				this.addRule(rule, grammar[rule]);
			
			return this;
			
		},
		
		
		/**
		 * Deletes the named rule from the grammar
		 * @param {String} the rule name
		 * @returns {object} this RiGrammar
		 */ 
		removeRule : function(name)  {
			
			name = this._normalizeRuleName(name);
			delete this._rules[name];
			return this;
			
		},

		_copy: function() {  // NIAPI
			var tmp = RiGrammar();
			for(var name in this._rules) {
				tmp._rules[name] = this._rules[name];
			}
			return tmp;

		},
		
		/**
		 * Adds a rule to the existing grammar, replacing any existing rule with the same name 
		 * @param {string} name
		 * @param {string} ruleStr
		 * @param {number} weight
		 * @returns {object} this RiGrammar
		 */
		addRule : function(name, ruleStr, weight) 
		{
			var dbug = false;
	
			weight = (undef(weight) ? 1.0 : weight); // default

			name = this._normalizeRuleName(name);

			if (dbug) log("addRule: "+name+ " -> "+ruleStr+" ["+weight+"]");
			
			var ruleset = ruleStr.split(RiGrammar.OR_PATT);

			for ( var i = 0; i < ruleset.length; i++) {
				
				var rule = ruleset[i];
				var prob = weight;
				var m = RiGrammar.PROB_PATT.exec(rule);
	
				if (m != null) // found weighting
				{
					if (dbug) {
						log("Found weight for " + rule);
						for (i = 0; i < m.length; i++)
							log("  " + i + ") '" + m[i] + "'");
					}
					rule = m[1] + m[3];
					prob = m[2];
					if (dbug) log("weight=" + prob + " rule='" + rule + "'");
				}
	
				if (this.hasRule(name)) {
					if (dbug)log("rule exists");
					var temp = this._rules[name];
					temp[rule] = prob;
				} 
				else {
					
					// log("new rule");
					var temp2 = {};
					temp2[rule] = prob;
					this._rules[name] = temp2;
					if (dbug)log("added rule: "+name);
				}
			}
			return this;
			
		},
	  
		/**
		 * Clears all rules in the current grammar
		 * @returns {object} this RiGrammar
		 */
		reset : function() {
			
		   this._rules = {};
		   return this;
		   
		},
			  
		/**
		 * Returns the requested rule
		 * @param {string} rule name
		 * @returns {string} the rule
		 */
		getRule : function(pre) {
			
			pre = this._normalizeRuleName(pre);
	   
			// log("getRule("+pre+")");
			var tmp = this._rules[pre];
			var name, cnt = 0;
			
			for (name in tmp) cnt++; // count the matching rules
			
			if (cnt == 1) {
				return name;
			} 
			else if (cnt > 1) {
				
				var sr = this._getStochasticRule(tmp);
				return sr;
			}
			else {
				err("No rule found for: "+pre);
			}  
		},
		
		/**
		 * Prints the grammar rules to the console in human-readable format (useful for debugging) 
		 * @returns {object} this RiGrammar
		 */
		print : function() { //TODO: compare to RiTa
			
			if (console) {
				console.log("Grammar----------------");
				for ( var name in this._rules) {
					
					console.log("  '" + name + "' -> ");
					var choices = this._rules[name];
					for ( var p in choices) {
						console.log("    '" + p + "' [" + choices[p] + "]");
					}
				}
				console.log("-----------------------");
			}
			return this;
			
		},
		
		/**
		 * Returns true if the requested rule exists in the grammar, else false
		 * @param {string} the rule name
		 * @returns {boolean} true if the rule exists in the grammar, else false
		 */
		hasRule : function(name) {
			
			//log("hasRule("+name+")");
			name = this._normalizeRuleName(name);
			return (typeof this._rules[name] !== 'undefined');
			
		},
		
		/**
		 * Expands the grammar after replacing an instance of the non-terminal
		 * 'symbol' with the String in 'literal'.
		 * <P>
		 * Guarantees that 'literal' will be in the final expanded String, 
		 * assuming at least one instance of 'symbol' in the Grammar.
		 * 
		 * @param literal
		 * @param symbol
		 * 
		 * @returns {string} expanded text
		 */
		expandWith : function(literal, symbol) { // TODO: finish 

			var gr = this._copy();
			
			var match = false;
			for ( var name in gr._rules) {
				if (name===symbol) {
					var obj = {};
					obj[literal] = 1.0;
					gr._rules[name] = obj;
					match = true;
				}
			}
			if (!match) 
				err("Rule '"+symbol+"' not found in grammar");

			// TODO: tmp, awful hack, write this correctly
			var tries, maxTries = 1000;
			for (tries = 0 ;tries < maxTries; tries++) {
				var s = gr.expand();
				if (s.indexOf(literal)>-1)
					return s;
			}
			err("\n[WARN] RiGrammar failed to complete after "+tries+" tries\n");
			
		},
		
		/**
		 * @param input
		 * @returns this
		 */
		_handleExec : function(input) { // TODO: private
					   
			//console.log("handleExec: "+input);
			
			if (!input || !input.length) return E;
			
			// strip backticks and eval
			var exec = input.replace(RiGrammar.STRIP_TICKS, "$1");
			
			try {
				input = RiTa._eval(exec);
			}
			catch (e) {
				
				warn("RiGrammar._handleExec failed on '"+input+"'\n  -> "+e.message);
				
				// if (is(exports, O)) { // we are running in node
					// console.log("found node! "+typeof module.vm);
					// module.vm.runInThisContext(exec);
					// //eval("function adj(){return 56;}") 
				// }
			}
			
			return input;
		},
		
				
		/**
		 * Expands a grammar from its '<start>' symbol
		 * @param {string} (optional) One or more function to be added to the current context BEFORE 
		 * executing the expand() call. Useful for defining functions referenced in back-ticked rules.
		 * @returns {string}
		 */
		expand : function(funs) {

			funs && RiTa._eval(funs);
			
			return this.expandFrom(RiGrammar.START_RULE);
		}, 
		
		// TODO: reconsider
		
		/**
		 * Expands the grammar, starting from the given symbol.
		 * RiGrammar.expand() is equivalent to RiGrammar.expandFrom('').
		 * 
		 * @param {string} rule
		 * @returns {string}
		 * 
		 */
		expandFrom : function(rule) {
			
			//log("expandFrom("+rule+")");
			
			if (!this.hasRule(rule)) {
				warn("Rule not found: " + rule + "\nRules: ");
				(!RiTa.SILENT) && this.print();
			}
	
			var iterations = 0;
			var maxIterations = 1000;
			while (++iterations < maxIterations) {
				
				var next = this._expandRule(rule);
				if (!next) {

					//  we're done, check for back-ticked strings to eval
					(!this._execDisabled && (rule = rule.replace
						(RiGrammar.EXEC_PATT, this._handleExec)));
								 
					break;
				} 
				rule = next;
			}
	
			if (iterations >= maxIterations)
				warn("max number of iterations reached: " + maxIterations);
	
			return rule;
			
		},
			
		_expandRule : function(prod) { 
			
			var dbug = false, trimSpace = true, result = [];
			if (trimSpace) prod = prod.trim();

			if (dbug) log("_expandRule(" + prod + ")");
			
			for ( var name in this._rules) {
				
				var entry = this._rules[name];
				if (dbug) log("  name=" + name+"  entry=" + entry+"  prod=" + prod+"  idx=" + idx);
				var idx = prod.indexOf(name);
				
				if (idx >= 0) {
					
					var pre = prod.substring(0, idx);
					var expanded = this.getRule(name);
					var post = prod.substring(idx + name.length);
					
					if (trimSpace) {
						pre = (pre || E).trim();
						post = (post || E).trim();
						expanded = (expanded || E).trim();
					}

					if (dbug) log("  pre=" + pre+"  expanded=" + expanded+"  post=" + post+"  result=" + pre + expanded + post);
					
//					var tmp = (pre + SP + expanded + SP + post);

					result.push(pre,expanded,post);

					var ok = result.join(SP);
					
					if (dbug) console.log('Returns: '+ok);

					if (trimSpace) ok = ok.trim();

					return ok;
				}
				
				// do the exec check here, in while loop()
			}
			// what happens if we get here? no expansions left, return?
		},
		
		_normalizeRuleName : function(pre) {
			
			if (!strOk(pre)) return pre;
			
			if (!startsWith(pre, RiGrammar.OPEN_RULE_CHAR))
				pre = RiGrammar.OPEN_RULE_CHAR + pre;
			
			if (!endsWith(pre,RiGrammar.CLOSE_RULE_CHAR))
				pre += RiGrammar.CLOSE_RULE_CHAR;

			if (pre.indexOf('>>')>0) err(">>");
			
			return pre;
			
		},
		
		// private?? (add structure test case)
		_getStochasticRule : function(temp)    { // map
	 
			var dbug = false;
			
			if (dbug) log("_getStochasticRule(" + temp + ")");
			
			var p = Math.random();
			var result, total = 0;
			for ( var name in temp) {
				total += parseFloat(temp[name]);
			}
			
			if (dbug) log("total=" + total+"p=" + p);
			
			 for ( var name in temp) {
				if (dbug) log("  name=" + name);
				var amt = temp[name] / total;
				
				if (dbug) log("amt=" + amt);
				
				if (p < amt) {
					result = name;
					if (dbug)log("hit!=" + name);
					break;
				} else {
					p -= amt;
				}
			}
			return result;
		}
		
	
	} // end RiGrammar
	
	
	//////////////////////////////////////////////////////////////////////
	////////// RiText   
	////////////////////////////////////////////////////////////////////// 
	
	/**
	 * @name RiText
	 * 
	 * @class A text display object for the RiTa tools. 
	 * 
	 * Wraps an instance of RiString to provide utility
	 * methods for typography, text effects, animation, etc. 
	 * 
	 * <p>
	 * 
	 * Uses either the native canvas renderer or the Processing renderer (when included) 
	 * 
	 * @property {number} x The x position
	 * @property {number} y The y position
	 */    
	var RiText = makeClass();
		
	//////////////////////////////////////////////////////////////////////
	//////// RiText statics
	////////////////////////////////////////////////////////////////////// 
	
	/**
	 * Static container for properties related to the update/render loop
	 */
	RiText._animator = {
		loopId : -1,
		actualFPS : 0,
		targetFPS : 60,
		isLooping : false,
		frameCount : 0,
		loopStarted : false,
		framesSinceLastFPS : 0,
		callbackDisabled : false,
		timeSinceLastFPS : Date.now()
	}
	
	/**
	 * Returns the current graphics context, either a canvas 2d'-context or ProcessingJS instance 
	 * @returns {object}
	 */
	RiText._graphics = function() {
		
		return RiText.renderer ? RiText.renderer._getGraphics() : null;
	}

	/**
	 * Starts a timer that calls 'onRiTaEvent' or the specified callback every 'period'
	 * seconds
	 * 
	 * @param {number} period (in seconds)
	 * @param {function} callback called every 'period' seconds (default=onRiTaEvent)
	 * @returns {number} the unique id for the timer
	 */
	RiText.timer = function(period, callback) {

		return RiTa.timer.apply(this,arguments);
	}
	
	/**
	 * Stops a timer according to its unique id
	 * @param {number} the unique id for the timer
	 */
	RiText.stopTimer = function(id) {

		RiTa.stopTimer.apply(this,arguments);
	} 
	
	/**
	 * Pauses a timer according to its unique id (and assigns a new unique id)
	 * @param {number} the unique id for the timer
	 * @param {number} period (in seconds)
	 * @returns {number} the new unique id for the timer
	 */
	RiText.pauseTimer = function(id, pauseSec) {
		
		return RiTa.pauseTimer.apply(this,arguments);
	}   
	
	/**
	 * Returns the number of frames since the start of the sketch 
	 * @returns {number} the number of frames
	 */
	RiText.frameCount = function() {   // TODO: REMOVE
		return RiText._animator.frameCount;
	}
	
	/**
	 * Immediately stops the current animation loop
	 */
	RiText.noLoop = function() {  // TODO: REMOVE
		var an = RiText._animator;
		an.isLooping = false;
		an.loopStarted = false;
		an.clearInterval(loopId);
	}
		
	/**
	 * Starts an animation loop that calls the specified callback (usually 'draw') 
	 * at the specified fps  
	 * 
	 * @param {function} callback the animation callback (optional, default='draw')
	 * @param {number} fps the target framesPerSecond (optional, default=60)
	 * <pre>
	 * Examples:
	 *  RiText.loop();
	 *  RiText.loop('draw');
	 *  RiText.loop(30);
	 *  RiText.loop(draw, 10);
	 * </pre>
	 */
	RiText.loop = function(callbackFun, fps) {   // TODO: REMOVE
		
		var a = arguments, 
			g = RiText.renderer,  
			an = RiText._animator, 
			callback = undef(window) ? null : window['draw'];
		
		if (g._type() === 'Processing') return; // let P5 do its own loop
  
		if (an.loopStarted) return;
		
		switch (a.length) {
			
			case 1:
				
				if (a[0]) {
					var type = Type.get(a[0]);
					if (type == F) {
						callback = a[0];
					}
					else if (type == N) {
						an.targetFPS = a[0];
					}
				}
				break;
				
			case 2:
				
				if (a[0]) {
					
					var type = Type.get(a[0]);
					if (type == F) {
						callback = a[0];
					}
					type = Type.get(a[1])
					if (type == N) {
						an.targetFPS = a[1];
					}
				}
				break;
		}

		an.timeSinceLastFPS = Date.now(), an.framesSinceLastFPS = 0, mps =  1E3 / an.targetFPS;
		
		if (callback && !an.callbackDisabled && window) {
			
			an.loopId = window.setInterval(function() {
				
			  try {
				
				 callback();
				 
				 var sec = (Date.now() - an.timeSinceLastFPS) / 1E3;
				 var fps = ++an.framesSinceLastFPS / sec;
				 
				 if (sec > 0.5) {
				 	
					 an.timeSinceLastFPS = Date.now();
					 an.framesSinceLastFPS = 0;
					 an.actualFPS = fps;
				 }
				 an.frameCount++;
				
			  } catch(ex) {
				  
				if (!an.callbackDisabled) {
					console.warn("Unable to invoke callback: "+callback);
					an.callbackDisabled = true;
				}
				
				window.clearInterval(an.loopId);
				console.trace(this);
				throw ex;
			  }
			  
			}, mps);
			
			an.isLooping = true;
			an.loopStarted = true;
		}

	}
	
	/**
	 * Convenience method to get the height of the current drawing surface
	 * @returns {number} width
	 */
	RiText.width = function() { return RiText.renderer._width(); } // TODO: REMOVE
	  

	/**
	 * Convenience method to get the height of the current drawing surface
	 * @returns {number} height
	 */
	RiText.height = function() { return RiText.renderer._height(); } // TODO: REMOVE
 
	/**
	 * Convenience method to draw a crisp line on the drawing surface
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} lineWidth (optional: default=1)
	 */ 
	RiText.line = function(x1, y1, x2, y2, lineWidth) { 

		var g = RiText.renderer;
		g._pushState();
		g._line(x1, y1, x2, y2, lineWidth || 1);
		g._popState();
	}
	  
	/**
	 * Convenience method to set the size of the drawing surface in the current 
	 * renderer context 
	 * @param {number} w width
	 * @param {number} h height
	 */
	RiText.size = function(w,h/*renderer*/) { // TODO: REMOVE
		
		RiText.renderer._size(w,h/*renderer*/);
	}

	/**
	 * Returns a random color in which the 3 values for rgb (or rgba if 'includeAlpha' is true), 
	 * are between min and max 
	 * 
	 * @param {number} min value
	 * @param {number} max value
	 * @param {boolean} includeAlpha true if includes alpha
	 * @returns {array} numbers - [r,g,b] or [r,g,b,a]
	 */
	RiText.randomColor = function(min,max,includeAlpha) {
		
		min = min || 0, max = max || 256;
		var col = [RiText.random(min,max),RiText.random(min,max),RiText.random(min,max)];
		if (includeAlpha) col.push(RiText.random(min,max));
		return col;
	}
	
	/**
	 * Returns a random number between 'min' (default 0) and 'max
	 * @returns {number}
	 */
	RiText.random = function() {
		
		return RiTa.random.apply(this ,arguments);
	}
	
	
	/**
	 * Convenience method to get the distance between 2 points
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * 
	 * @returns {number}
	 */
	RiText.distance = function() {
		
		return RiTa.distance.apply(this,arguments);
	}
	
	/**
	 * Convenience method to fill drawing surface background with specified color
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @param {number} a
	 */
	RiText.background = function(r,g,b,a) {
		
		var br, bg, bb, ba = 255, r = (typeof r == N) ? r : 255;

		if (arguments.length >= 3) {
			br = r;
			bg = g;
			bb = b;
		}
		if (arguments.length == 4) {
			ba = a;
		}
		if (arguments.length <= 2) {
			br = r;
			bg = r;
			bb = r;
		}
		if (arguments.length == 2) {
			ba = g;
		}
 
		RiText.renderer._background(br,bg,bb,ba);
	}
	
	/**
	 * Returns the mouse position from a mouse event
	 * in a cross-browser compatible fashion
	 * @param {MouseEvent} e mouseEvent
	 * @returns {object} mouse position with x,y properties
	 */
	RiText.mouse = function(e) { // TODO: broken for canvas (see contains-test)  // TODO: REMOVE
		
		var posX = -1,posY = -1;
		
		if (!e) var e = window.event;
		
		if (!e && !RiText.mouse.printedWarning) { 
			console.warn("No mouse-position without event!");
			RiText.mouse.printedWarning = true;
		}        
		
		if (e.pageX) {
			posX = e.pageX;
		}
		else if (e.clientX)    {
			posX = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
		}

		if (e.pageY) {
			
			posY = e.pageY;
		}
		else if (e.clientY)    {
			
			posY = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
 
		return {x:posX,y:posY};
	}

	/**
	 * Returns all RiTexts that contain the point x,y or null if none do.
	 * <p>
	 * Note: this will return an array even if only one item is picked, therefore,
	 * you should generally use it as follows:
	 * 
	 * @example
	 *   var rts = RiText.picked(mx, my);
	 *   if (rts.length) {
	 *      rts[0].doSomething();
	 *   }
	 *
	 *
	 * @param {number} x
	 * @param {number} y
	 * 
	 * @returns {array} RiText[] one or more RiTexts containing
	 * the point, or an empty array if none do.
	 */
	RiText.picked = function(x, y) {
	  var hits = [];
	  for (var i = 0; i < RiText.instances.length; i++)
	  {
		var rt = RiText.instances[i];
		rt.contains(x, y) && hits.push(rt);
	  }
	  return hits;
	}
	
	 /**
	  * Disposes of any resources associated with this RiText and removes it from
      * the draw() queue.
	  */
	RiText.dispose = function(toDelete) {
		
	   is(toDelete,A) && RiText._disposeArray(toDelete);
	   is(toDelete,O) && RiText._disposeOne(toDelete);
	}
	
	 /**
     * Deletes all current instances.
     */
	RiText.disposeAll = function() {
		
		for ( var i = 0; i < RiText.instances.length; i++) {

			if (RiText.instances[i]) {
				
				delete(RiText.instances[i]._rs);
				delete(RiText.instances[i]);
			}
		}
		
		RiText.instances = [];
   }
	
   RiText.createWords = function(txt, x, y, w, h, fontObj, leading) {

		return RiText._createRiTexts(txt, x, y, w, h, fontObj, leading, RiText.prototype.splitWords);
	}

	RiText.createLetters = function(txt, x, y, w, h, fontObj, leading) {

		return RiText._createRiTexts(txt, x, y, w, h, fontObj, leading, RiText.prototype.splitLetters);
	}

	// TODO: other alignments?
	/*RiText.createLinesOld= function(txt, x, y, maxW, maxH, theFont) { 
   
  		var strLines = txt, theFont = theFont || RiText._getDefaultFont();
				 
		if (is(txt, S)) 
			strLines = RiText._makeLines(txt, x, y, maxW, maxH, theFont);

		if (!(strLines && strLines.length)) 
			err('Unexpected fail in createLines(): no lines');

		// lay out the lines
		var rts = RiText._createLinesByCharCountFromArray(strLines, x, y, theFont);
		
		if (!rts || rts.length < 1) return EA;

		// set the paragraph spacing
		if (RiText.defaults.paragraphLeading > 0)  {
			
		  var lead = 0;
		  for (var i = 0; i < rts.length; i++) {
			  
			var str = rts[i].text();
			var idx = str.indexOf('|');
			if (idx > -1) {
			  lead += RiText.defaults.paragraphLeading;
			  rts[i].removeChar(idx);
			}
			rts[i].y += lead;
		  }
		}
		
		// check all the lines are still in the rect
		var toKill = [];
		var check = rts[rts.length - 1];   
		for (var z = 1; (check.y + check.textDescent()) > y + maxH; z++) {
			
			toKill.push(check);
			var idx = rts.length - 1 - z;
			if (idx < 0) break;
			check = rts[idx];
		}
		
		// remove the dead ones
		for (var z = 0; z < toKill.length; z++) {
			
			removeFromArray(rts, toKill[z]);
		}
		
		RiText._disposeArray(toKill);

		return rts;
	}*/

	/**
	 * Sets/gets the default font size for all RiTexts
	 * @param {object} motionType
	 * @returns {object} the current default motionType

	RiText.defaultMotionType = function(motionType) {

		if (arguments.length==1) 
			RiText.defaults.motionType = motionType;
		return RiText.defaults.motionType;
	}	 */
	
	/**
	 * Sets/gets the default alignment for all RiTexts
	 * @param {number} align (optional, for sets only)
	 * @returns {number} the current default alignment
    */
	RiText.defaultAlignment = function(align) {

		if (arguments.length==1)
			RiText.defaults.alignment = align;
		return RiText.defaults.alignment;
	}
	
	/**
	 * Sets/gets the default font size for all RiTexts
	 * @param {number} size (optional, for sets only)
	 * @returns {number} the current default font size

	RiText.defaultFontSize = function(size) {

		if (arguments.length==1) 
			RiText.defaults.fontSize = size;
		return RiText.defaults.fontSize;
	}	 */

	/**
	 * Sets/gets the default bounding box visibility
	 * @param {boolean} size (optional, for sets only)
	 * @returns {boolean} the current default bounding box visibility

	RiText.defaultBoundingBoxes = function(value) {
		
		if (arguments.length==1) 
			RiText.defaults.showBounds = value;
		return RiText.defaults.showBounds;
	}	 */

	/**
	 * Sets/gets the default font for all RiTexts
	 * @param {object} font (optional, for 'sets' only)
	 * @param {string} the font name (optional, for 'sets' only)
	 * @param {number} the font size (optional, for 'sets' only)
	 * @returns {object} the current default font
	 */
	RiText.defaultFont = function(font) {
		
		var a = arguments;
		if (a.length == 1 && typeof a[0] == O) {
			RiText.defaults.font = a[0];
		}
		// this allows for RiText.defaultFont(name,sz);
		else if (a.length > 1 && typeof a[0] == S) {
			RiText.defaults.font = RiText.renderer._createFont.apply(RiText.renderer, a);
			//if (!RiText.defaults.font.leading) RiText.defaults.font.leading = 0;
		}
		else if (a.length == 0 && !RiText.defaults.font) {
			RiText.defaults.font = RiText.createFont(RiText.defaults.fontFamily);
		}

		return RiText.defaults.font;
	}
	
	RiText.createFont = function(fontName, fontSize) {
		
		if (!fontName) err('RiText.createFont requires fontName');
		
		fontSize = fontSize || RiText.defaults.fontSize;

		return RiText.renderer._createFont(fontName, fontSize);
	}
	
	/**
	 * A convenience method to draw all existing RiText objects (with no argument)
	 * or an array of RiText objects (if supplied as an argument)
	 * @param {array} array draws only the array if supplied (optional)
	 */
	RiText.drawAll = function(array) {
		
		if (arguments.length == 1 && is(array,A)) { 
			for ( var i = 0; i < array.length; i++)
				array[i] && array[i].draw();
		}
		else {
			for ( var i = 0; i < RiText.instances.length; i++)
				RiText.instances[i] && RiText.instances[i].draw();
		}   
	}
	
	/**
	 * Sets/gets the default fill color
	 * @param {number | array} r takes 1-4 number values for rgba, or an array of size 1-4
	 * @param {number} g (optional)
	 * @param {number} b (optional)
	 * @param {number} a (optional)
	 * @returns {object} the current default color
	 */
	RiText.defaultFill = function(r, g, b, a) {
 
		if (arguments.length) { 
			RiText.defaults.color = parseColor.apply(this,arguments);
		}
		return RiText.defaults.color;
	}
	
	
  /**
	 * Set/gets default boundingbox visibility
	 *
	 * @param {boolean} trueOrFalse (optional) true or false
	 * @returns {object | boolean} this RiText (set) or the current boolean value (get)
	 */
  RiText.showBoundingBox = function(trueOrFalse) {

    if (arguments.length == 1) {
      RiText.defaults.boundingBoxVisible = trueOrFalse;
      return this;
    }

    return RiText.defaults.boundingBoxVisible;
  }


	// private statics ///////////////////////////////////////////////////////////////
	
	RiText._layoutArray = function(lines, x, y, w, h, pfont, leading) {
	
		if (!is(arguments[0], A)) { // ignore first (PApplet) argument
	    	var a = arguments;
	    	lines = a[1], x = a[2], y = a[3], w = a[4], h = a[5], pfont = a[6], leading = a[7];
	    }
	    
		var ritexts = [];
	    if (!lines || !lines.length) return ritexts;

	    for (var i = 0; i < lines.length; i++)
	      ritexts.push(RiText(lines[i], x+1, y).font(pfont));
	
	    return RiText._constrainLines(ritexts, y, h, leading);
	}
	
	RiText._constrainLines = function(ritexts, y, h, leading) {

		var ascent = ritexts[0].textAscent();
	    var descent = ritexts[0].textDescent();
	    var lastOk, next, maxY = y + h, currentY = y + ascent + 1;

	    // set y-pos for those that fit
	    for (lastOk = 0; lastOk < ritexts.length; lastOk++)
	    {
	      next = ritexts[lastOk];
	      next.y = currentY; 
	      //console.log(lastOk+") "+currentY);
	      if (!RiText._withinBoundsY(currentY, leading, maxY, descent))
	        break;
	      currentY += leading;
	    }   
	    
	    var toKill = ritexts.slice(lastOk+1);
	    
	    // and delete the rest
	    RiText.dispose(toKill);
	    	    	      
	 	var result = ritexts.slice(0, lastOk);
	 	
	 	//console.log("lastOk="+lastOk+"/"+ritexts.length + " toKill="+toKill.length+" result="+result.length);
	    
	 	return result;
  	}
  	
	RiText.createLines = function(txt, x, y, w, h, pfont, leading) {
	    
	    var a = arguments, t = Type.get(a[0]);
	    
	    if (t != S && t != A) { // ignore first (PApplet/window) argument
	    	txt = a[1], x = a[2], y = a[3], w = a[4], h = a[5], pfont = a[6], leading = a[7];
	    }
	    
	    if (!txt || !txt.length) return EA;
	    
	    w = w || Number.MAX_VALUE-x, h = h || Number.MAX_VALUE, pfont = pfont || RiText.defaultFont();
	 	leading = leading || pfont.leading || pfont.size * RiText.defaults.leadingFactor;

	    if (is(txt, A)) return RiText._layoutArray(txt, x, y, w, h, pfont, leading);
	      
	    var g = RiText.renderer, ascent, descent, leading, startX = x+1, currentX, 
	    	currentY, rlines = [], sb = E, maxW = x + w, maxH = y + h, words = [], next
	    	newParagraph = false, forceBreak = false, firstLine = true, yPos = 0, rt = undef;
	    
		// remove line breaks & add spaces around html
		txt = txt.replace(/[\r\n]/, SP);
		txt = txt.replace(/ ?(<[^>]+>) ?/, " $1 "); 	

		// split into reversed array of words
		RiText._addToStack(txt, words);
		if (!words.length) return RiText.EMPTY_ARRAY;
	 
	 	//log("txt.len="+txt.length+" x="+x+" y="+y+" w="+w+" h="+h+" lead="+leading);log(pfont);
	 	
	    g._textFont(pfont); // for ascent & descent
	    ascent = g.p.textAscent();
	    descent = g.p.textDescent();
	    currentY = y + ascent + 1;
	
	    if (RiText.defaults.indentFirstParagraph) 
	    	startX += RiText.defaults.paragraphIndent;
	        
	    while (words.length>0)
	    {
	      next = words.pop();

	      if (!next.length) continue;
	      	
	      // check for HTML-style tags 
	      if (startsWith(next,'<') && endsWith(next,'>'))
	      {
	        if (next == RiText.NON_BREAKING_SPACE)
	        {
	          sb += SP;
	        }
	        else if (next == RiText.PARAGRAPH_BREAK)
	        {
	        	// case: paragraph break
	            newParagraph = sb.length;
	        }
	        else if (next == RiText.LINE_BREAK) {
	          forceBreak = true;
	        }
	        continue;
	      }
	
	      // re-calculate our X position
	      currentX = startX + g._textWidth(pfont, sb + next);
	
	      // check it against the line-width 
	      if (!newParagraph && !forceBreak && currentX < maxW)
	      {
	        sb += next + SP; // add-word
	      }
	      else 
	      {
	         // check yPosition for line break
			if (RiText._withinBoundsY(currentY, leading, maxH, descent)) {
	        
	          yPos = firstLine ? currentY : currentY + leading;
	          rt = RiText._newRiTextLine(sb, pfont, startX, yPos);
	          rlines.push(rt);
	          
	          currentY = newParagraph ? rt.y + RiText.defaults.paragraphLeading : rt.y;
	          startX = x + 1; // reset
	
	          if (newParagraph) startX += RiText.defaults.paragraphIndent;
	          
	          sb = next + SP; // reset with next word
	          
	          newParagraph = false;
	          forceBreak = false;
	          firstLine = false;
	        }
	        else {
	        	
	          words.push(next);
	          break;
	        }
	      }
	    }
	    
	    // check if leftover words can make a new line 
		if (RiText._withinBoundsY(currentY, leading, maxH, descent)) {
						
			// TODO: what if there is are tags in here -- is it possible?)
			rlines.push(RiText._newRiTextLine(sb, pfont, x + 1, leading + currentY));
			sb = E;
	    }
	    else {
	    	
			RiText._addToStack(sb, words); // save for next
	    }

	    return rlines;
	}
	
	RiText._withinBoundsY = function(currentY, leading, maxY, descent)
  	{
    	return currentY + leading <= maxY - descent;
  	}
  
	RiText._addToStack = function(txt, words) {

		var tmp = txt.split(SP)
		for ( var i = tmp.length - 1; i >= 0; i--)
			words.push(tmp[i]);
	}
	  
	RiText._newRiTextLine = function(s, pf, xPos, nextY) {
		
	    // strip trailing spaces
	    while (s != null && s.length > 0 && endsWith(s, SP))
	      s = s.substring(0, s.length - 1);
	    
	    return RiText(s, xPos, nextY, pf);
	    //console.log(rt);return rt;
	}
	
	RiText._makeLinesOld = function(txt, x, y, maxW, maxH, theFont) {  // TODO: remove

		//log('_makeLines('+txt.length+','+x+','+y+','+maxW+','+maxH+','+theFont+')');

		var currentH = 0, currentW = 0, newParagraph = false, forceBreak = false, strLines = [],
			sb = RiText.defaults.indentFirstParagraph ? RiText.defaults.paragraphIndent : E,
			g = RiText.renderer, fn = RiText._makeLines;
			
		// remove line breaks & add spaces around html
		txt = replaceAll(txt, "[\r\n]", SP);
		txt = replaceAll(txt," ?(<[^>]+>) ?", " $1 "); 	

		// split into reversed array of words
		var tmp = txt.split(SP), words = [];
		for ( var i = tmp.length - 1; i >= 0; i--)
			words.push(tmp[i]);

		// cached helpers //////////////////////////////////////////// 
		
		fn.checkLineHeight = fn.checkLineHeight || function(currentH, lineH, maxH) {
			
			return currentH + lineH <= maxH;
		};
		
		fn.addLine = fn.addLine || function(arr, s) {
			if (s && s.length) {
				// strip trailing spaces (regex?)
				while (s.length > 0 && endsWith(s, ' '))
					s = s.substring(0, s.length - 1);
				arr.push(s); 
			}
		};
		
		// the guts ////////////////////////////////////////////////
			
		var tmp = new RiText('_',0,0,theFont), textH = tmp.textHeight();
		RiText.dispose(tmp); // grab the line height [?]
		
		while (words.length > 0) {

			var next = words.pop();
			
			if (next.length == 0) continue;

			if (startsWith(next, '<') && endsWith(next, ">")) {
		 
				if (next === RiText.NON_BREAKING_SPACE) {
					
					sb += SP;
				}
				else if (next === RiText.PARAGRAPH_BREAK) {
					
					if (sb.length > 0) { // case: paragraph break
						
						newParagraph = true;
					}
					else if (RiText.indentFirstParagraph) {
					
						sb += RiText.defaults.paragraphIndent;
					}
				}
				else if (endsWith(next, RiText.LINE_BREAK)) {
					
					forceBreak = true;
				}
				continue;
			}

			currentW = g._textWidth(theFont, sb + next);

			// check line-length & add a word
			if (!newParagraph && !forceBreak && currentW < maxW) {
				
				sb += next + " "; 
			}
			else // new paragraph or line-break
			{
				// check vertical space, add line & next word
				if (fn.checkLineHeight(currentH, textH, maxH)) {
					
					fn.addLine(strLines, sb);
					sb = E;

					if (newParagraph) { // do indent

						sb += RiText.defaults.paragraphIndent;
						if (RiText.defaults.paragraphLeading > 0) {
							sb += '|'; // filthy
						}
					}
					newParagraph = false;
					forceBreak = false;
					sb += next + SP;

					currentH += textH;
				}
				else {
					
					if (next != null) words.push(next);
					break;
				}
			}
		}

		// check if leftover words can make a new line
		if (fn.checkLineHeight(currentH, textH, maxH)) {
			
			fn.addLine(strLines, sb);
			sb = E;
		}
		else {
			var tmp = sb.split(SP);
			for ( var i = tmp.length - 1; i >= 0; i--) {
				words.push(tmp[i]);
			}
		}
		
		return strLines;
	}
	
	RiText._createRiTexts = function(txt, x, y, w, h, fontObj, lead, splitFun) {  

		//if (!txt || !txt.length) return EA;

		var rlines = RiText.createLines(txt, x, y, w, h, fontObj, lead);
		if (!rlines || rlines.length < 1) return EA;

		var result = [];
		var font = rlines[0].font();
		for (var i = 0; i < rlines.length; i++) {
			
			var rts = splitFun.call(rlines[i]);
			for (var j = 0; j < rts.length; j++) {// add the words
				
				result.push(rts[j].font(fontObj)); 
			}
			
			RiText.dispose(rlines[i]);
		}

		return result;
	}
	
	/*RiText._createLinesByCharCountFromArray = function(txtArr, startX, startY, fontObj) {

		if (!fontObj) err('no font in _createLinesByCharCountFromArray!');

		//log('createLinesByCharCountFromArray('+txtArr.length+','+startX+','+startY+','+fontObj.size+','+fontObj.leading+')');

		var rts = [], leading = fontObj.leading, yOff = startY + leading;
		
		for ( var i = 0; i < txtArr.length; i++) {
			
			rts.push(RiText(txtArr[i], startX, yOff, fontObj));
		}
		
		return (rts && rts.length > 1)  ? RiText._handleLeading(fontObj, rts, yOff) : []; 
	}*/
	
	// Returns the pixel x-offset for the word at 'wordIdx' 
	RiText._wordOffsetFor = function(rt, words, wordIdx) { 

		if (wordIdx < 0 || wordIdx >= words.length)
			throw new Error("Bad wordIdx=" + wordIdx + " for " + words);
		
		rt.g._pushState();

		var xPos = rt.x;

		if (wordIdx > 0) {
			
			var pre = words.slice(0, wordIdx);
			var preStr = '';
			for ( var i = 0; i < pre.length; i++) {
				preStr += pre[i] + ' ';
			}

			var tw = rt.g._textWidth(rt._font, preStr);

			//log("x="+xPos+" pre='"+preStr+"' tw=" + tw); 

			switch (rt._alignment) {
				case RiTa.LEFT:
					xPos = rt.x + tw;
					break;
				case RiTa.RIGHT:
					xPos = rt.x - tw;
					break;
				case RiTa.CENTER:
					console.warn("TODO: test center-align here");
					xPos = rt.x; // ?
					break;
			}
		}
		rt.g._popState();

		return xPos;
	}
	
	RiText._handleLeading = function(fontObj, rts, startY) {

		
		if(!rts || !rts.length) return;

		fontObj = fontObj || RiText._getDefaultFont();

		//log('handleLeading: '+fontObj.leading);

		var nextHeight = startY;
		rts[0].font(fontObj);
		for(var i = 0; i < rts.length; i++) {

			//if(fontObj) rts[i].font(fontObj); // set the font
			rts[i].y = nextHeight; // adjust y-pos
			nextHeight += fontObj.leading;
		}

		return rts;
	}
	
	RiText._disposeOne = function(toDelete) {
		
		removeFromArray(RiText.instances, toDelete);
		
		if (toDelete) {
			delete(toDelete._rs);
			delete(toDelete);
			toDelete._rs = {};
			toDelete = {};
		}

	}  

	RiText._disposeArray = function(toDelete) {
		
		for ( var i = 0; i < toDelete.length; i++) {
			
			RiText._disposeOne(toDelete[i]);
		}
		
		toDelete = [];
	}
	
	// TODO: test this font default across all platforms and browsers
	
	RiText._getDefaultFont = function() {
		
		//log("RiText._getDefaultFont: "+RiText.defaults.fontFamily+","+RiText.defaults.font.size);
		
		RiText.defaults.font = RiText.defaults.font || 
			RiText.renderer._createFont(RiText.defaults.fontFamily, 
				RiText.defaults.fontSize, RiText.defaults.leading);
		
		return RiText.defaults.font;
	}
	
	// RiText.foreach = function(fun) {
// 	
		// var f = function(el,idx,arr){ fun(el,idx,arr); return 1; }; 
		// RiText.instances.every(f);
	// }
	
	// PUBLIC statics (TODO: clean up) ///////////////////////////////////////////
   
	RiText.NON_BREAKING_SPACE = "<sp/>";
	RiText.PARAGRAPH_BREAK = "<p/>";
	RiText.LINE_BREAK = "<br/>";
	RiText.instances = [];
	
	/**
	 * A set of static defaults to be shared by RiText objects
     *
	 * @example 
	 *  RiText.defaults.alignment = RiTa.RIGHT;
	 *  RiText.defaults.fontSize = 20;
	 * 
	 * @property {object} defaults
	 */
	RiText.defaults = { 
		
		color : { r : 0, g : 0, b : 0, a : 255 }, fontFamily: 'Times New Roman',  
		alignment : RiTa.LEFT, motionType : RiTa.LINEAR, font: null, fontSize: 14,
		paragraphLeading : 0, paragraphIndent: 20, indentFirstParagraph : false,
		boundingStroke : null, boundingStrokeWeight : 1, showBounds : false, leadingFactor: 1.2,
		rotateX:0, rotateY:0, rotateZ:0, scaleX:1, scaleY:1, scaleZ:1
	}

	RiText.prototype = {

		/**
		 * @private
		 * @param { S | N | O } text
		 * @param x
		 * @param y
		 * @param font
		 * @returns {RiText}
		 */
		init : function(text, x, y, font) { 
			
			if (!RiText.renderer) 
				err("No graphics context, RiText unavailable");
			
			this._color = { 
				r : RiText.defaults.color.r, 
				g : RiText.defaults.color.g, 
				b : RiText.defaults.color.b, 
				a : RiText.defaults.color.a 
			};
			
			var bbs = RiText.defaults.boundingStroke;
			this._boundingStroke = { 
				r : (bbs && bbs.r) || this._color.r, 
				g : (bbs && bbs.g) || this._color.g, 
				b : (bbs && bbs.b) || this._color.b, 
				a : (bbs && bbs.a) || this._color.a
			};
			
			/*var bbf = RiText.defaults.boundingFill;
			this._boundingFill = { 
				r : (bbf && bbf.r) || this._color.r, 
				g : (bbf && bbf.g) || this._color.g, 
				b : (bbf && bbf.b) || this._color.b, 
				a : (bbf && bbf.a) || 0
			};*/
	
			this._showBounds = RiText.defaults.showBounds;
			this._motionType = RiText.defaults.motionType;
			this._alignment = RiText.defaults.alignment;
	
			this._rotateX = RiText.defaults.rotateX;
			this._rotateY = RiText.defaults.rotateY;
			this._rotateZ = RiText.defaults.rotateZ;
			
			this._scaleX = RiText.defaults.scaleX;
			this._scaleY = RiText.defaults.scaleY;
			this._scaleZ = 1;
	 
			this._behaviors = [];
			
			this.g = RiText.renderer;
			
			// handle the arguments
			var args = this._initArgs.apply(this,arguments);

			this.font(args[3]);
			this.text(args[0]);

			// center by default
			this.x = is(args[1],N) ? args[1] : this.g._width()  / 2 - this.textWidth()  / 2.0;
			this.y = is(args[2],N) ? args[2] : this.g._height() / 2 + this.textHeight() / 2.0;
			this.z = 0;

			//log('RiText: '+this._rs._text +"("+this.x+","+this.y+")"+" / "+ this._font.name);

			RiText.instances.push(this);
			
			return this;
		},
		
	
		_initArgs : function() {

			var a = arguments, t = Type.get(a[0]);
		
			//console.error(a[0]);
			//console.error("a[0]="+t+" a.length="+a.length+" type="+t+" analyze="+typeof a[0].text);
			
			if (a.length && (t===O || t==='global') && typeof a[0].analyze != F) {
				
				// recurse, ignore 'this'
				var shifted = Array.prototype.slice.call(a, 1);

				return this._initArgs.apply(this, shifted);
			}

			var parsed = [E, null, null, null];
			if (a.length) {

				if (is(a[0], S))   // String
					parsed[0] = a[0];
				
				else if (is(a[0], O) && typeof a[0].text == F)
					parsed[0] = a[0].text(); // RiString
				
				else if (is(a[0], N)) // Number
					parsed[0] = String.fromCharCode(a[0]);
					
				else
				  console.error("Unexpected Arg: "+a[0]+" (type="+(typeof a[0])+")");
			}
			if (a.length > 1) parsed[1] = a[1];

			if (a.length> 2) parsed[2] = a[2];

			if (a.length> 3) parsed[3] = a[3];

			return parsed;
		},
		
		/**
		 * Returns the specified feature, computing it first if necessary. <p>
		 * 
		 * Default features include RiTa.STRESSES, RiTa.PHONEMES, and RiTa.SYLLABLES.
		 * 
		 * @example myRiText.get('phonemes') ||  myRiText.get(RiTa.PHONEMES);
		 * 
		 * @returns {string} the requested feature
		 */
		get : function(featureName) {
			
			return this._rs.get(featureName);
		},
		
		/**
		 * Returns the full feature set for this object
		 * 
		 * @see #get
		 * @see #analyze
		 * 
		 * @returns {array} the features 
		 */
		features : function() {
			
		   return this._rs.features();
		},
		
		/**
		 * Draws the object to the screen
		 * 
		 * @returns {object} this RiText
		 */
		draw : function() {
		  this._update()._render();   
		  if (this.fadeToTextCopy)
			  this.fadeToTextCopy.draw();
		  return this;
		},
		
		_update : function() {
			
			if (this._behaviors.length)
				this._updateBehaviors();
			return this;
		},
		
		_render : function() {
			
			var g = this.g;
			
			if (!g) err('no-renderer');
			
			if (this._rs && this._rs.length) {
			
				g._pushState();
				
				var bb = g._getBoundingBox(this); // cache this!
				
				g._translate(this.x, this.y);
				g._translate(bb.width/2, bb.height/-4);
				g._rotate(this._rotateZ);				
				//g._fill(255,0,0);
				//g.p.ellipse(0,0,10,10);
				g._translate(bb.width/-2, bb.height/4);
				g._scale(this._scaleX, this._scaleY, this._scaleZ); 
			 
				// Set color
				g._fill(this._color.r, this._color.g, this._color.b, this._color.a);

				// Set font params
				g._textFont(this._font);
				g._textAlign(this._alignment);
		
				// Draw text
				g._text(this._rs._text, 0, 0);
				
		
				// And the bounding box
				if (this._showBounds) {
					
					//	console.log(this.text()+".bb="+this._showBounds);
					
					//g._fill(this._boundingFill.r, this._boundingFill.g, 
						//this._boundingFill.b, this._boundingFill.a);
					g._fill(0, 0, 0, 0); // push/popStyle
					
					g._stroke(this._boundingStroke.r, this._boundingStroke.g, 
							this._boundingStroke.b, this._boundingStroke.a);

					// shift bounds based on alignment  // TODO: check that rotation still works w bounds? 
					switch(this._alignment) {
						
						case RiTa.RIGHT:
							g._translate(-bb.width,0);
							break;
						case RiTa.CENTER:
							g._translate(-bb.width/2,0);
							break;
					}
					//g.p.noFill();
					g._rect(0, bb.y, bb.width, bb.height);
				}
				
				g._popState();
			}
	
			return this;
		},
		
		///////////////////////////////// Text Behaviors ////////////////////////////////////
	
		/**
		 * Sets/gets the animation <code>motionType</code> for this RiText
		 * according to one of the following functions: <br>
		 * <ul>
		 * <li>RiText.LINEAR
		 * <li>
		 * <li>RiText.EASE_IN
		 * <li>RiText.EASE_OUT
		 * <li>RiText.EASE_IN_OUT
		 * <li>
		 * <li>RiText.EASE_IN_EXPO
		 * <li>RiText.EASE_OUT_EXPO
		 * <li>RiText.EASE_IN_OUT_EXPO
		 * <li>
		 * <li>RiText.EASE_IN_SINE
		 * <li>RiText.EASE_OUT_SINE
		 * <li>RiText.EASE_IN_OUT_SINE
		 * <li>
		 * <li>RiText.EASE_IN_CUBIC
		 * <li>RiText.EASE_OUT_CUBIC
		 * <li>RiText.EASE_IN_OUT_CUBIC
		 * <li>
		 * <li>RiText.EASE_IN_QUARTIC
		 * <li>RiText.EASE_OUT_QUARTIC
		 * <li>RiText.EASE_IN_OUT_QUARTIC
		 * <li>
		 * <li>RiText.EASE_IN_QUINTIC
		 * <li>RiText.EASE_OUT_QUINTIC
		 * <li>RiText.EASE_IN_OUT_QUINTIC
		 * <li>
		 * <li>RiText.BACK_IN
		 * <li>RiText.BACK_OUT
		 * <li>RiText.BACK_IN_OUT
		 * <li>
		 * <li>RiText.BOUNCE_IN
		 * <li>RiText.BOUNCE_OUT
		 * <li>RiText.BOUNCE_IN_OUT
		 * <li>
		 * <li>RiText.CIRCULAR_IN
		 * <li>RiText.CIRCULAR_OUT
		 * <li>RiText.CIRCULAR_IN_OUT
		 * <li>
		 * <li>RiText.ELASTIC_IN
		 * <li>RiText.ELASTIC_OUT
		 * <li>RiText.ELASTIC_IN_OUT                  
		 * </ul>
		 * 
		 * @param {number} motionType (optional)
		 * @returns {number} motionType
		 */
		motionType : function (motionType) {
			if (arguments.length) {
				this._motionType = motionType;
				return this;
			}
			return this._motionType;
		},
		
		/**
		 * Fades in current text over <code>seconds</code> starting at
		 * <code>startTime</code>. Interpolates from the current color {r,g,b,a}
		 * to {r,g,b,255}.
		 * 
		 * @param {number} seconds start Time
		 *          time in future to start
		 * @param {number} delay seconds
		 *          time for fade
		 * @param {function} callback 
		 * 
		 * @returns {number} the unique id for this behavior
		 */
		fadeIn : function(seconds, delay, callback) {
			
			return this.colorTo([this._color.r, this._color.g, this._color.b, 255],
				seconds, delay, null, 'fadeIn', false);
		},
	
		/**
		 * Fades out current text over <code>seconds</code> starting at
		 * <code>startTime</code>. Interpolates from the current color {r,g,b,a} 
		 * to {r,g,b,0}.
		 *
		 * @param {number} seconds
		 *          time for fade
		 * @param {number} delay 
		 *          (optional, default=0),  # of seconds in the future that the fade will start 
		 *          
		 * @param {function} callback the callback to be invoked when the behavior has completed (optional: default=onRiTaEvent(e)
		 * 
		 * @param {boolean} destroyOnComplete
		 *          (optional, default=false), destroys the object when the behavior completes
		 * @returns {number} the unique id for this behavior
		 */
		fadeOut : function(seconds, delay, callback, destroyOnComplete) {
	
			destroyOnComplete = destroyOnComplete || false;
			return this.colorTo([this._color.r, this._color.g, this._color.b, 0], 
				seconds, delay, null, 'fadeOut', destroyOnComplete);
		},

		
		/**
		 * Scales to 'theScale' over 'seconds' starting at 'delay' seconds in the future
		 * 
		 * @param {number} theScale delay 
		 *          (optional, default=0),  # of seconds in the future that the fade will start       
		 * @param {number} seconds
		 *          time for fade
		 * @param {number} delay seconds
		 *          time for fade
		 * @param {function} callback the callback to be invoked when the behavior has completed (optional: default=onRiTaEvent(e)
		 * 
		 * @returns {number} the unique id for this behavior
		 */
		scaleTo : function(theScale, seconds, delay, callback) {

			var rt = this;
			delay = delay || 0;
			seconds = seconds || 1.0;
				
			var id = setTimeout(function() {
				
				var tb = new TextBehavior(rt)
					.to( { _scaleX: theScale, _scaleY: theScale }, seconds*1000)
					.easing(rt._motionType)
					.onUpdate( function () {
						rt._scaleX = this._scaleX;
						rt._scaleY = this._scaleY;
					})
					//.delay(delay*1000)
					.onComplete( 
						function () {
						   RiTaEvent(rt, 'scaleToComplete')._fire(callback);                    
					});
			
				tb.start();
				
			}, delay*1000);
				
			return id;
		},
		
		/**
		 * Rotates to 'radians' over 'seconds' starting at 'delay' seconds in the future
		 * 
		 * @param {number} angleInRadians
		 * @param {number} seconds
		 *          time for fade  
		 * @param {number} delay 
		 *          (optional, default=0),  # of seconds in the future that the fade will start       
		 * @param {function} callback the callback to be invoked when the behavior has completed (optional: default=onRiTaEvent(e)
		 * 
		 * @returns {number} the unique id for this behavior
		 */
		rotateTo : function(angleInRadians, seconds, delay, callback) {


			var rt = this;
			delay = delay || 0;
			seconds = seconds || 1.0;
				
			var id = setTimeout(function() {
				
				var tb = new TextBehavior(rt)
					.to( { _rotateZ: angleInRadians  }, seconds*1000)
					.easing(rt._motionType)
					.onUpdate( function () {
					
						rt._rotateZ = this._rotateZ;
					})
					//.delay(delay*1000)
					.onComplete( 
						function () {
						   RiTaEvent(rt, 'rotateToComplete')._fire(callback);                    
					});
			
				tb.start();
				
			}, delay*1000);
				
			return id;
		},
		
		/**
		 * Fades out the current text and fades in the <code>newText</code> over
		 * <code>seconds</code>
		 * 
		 * @param {string} newText
		 *          to be faded in
		 * 
		 * @param {number} seconds
		 *          time for fade
		 * 
		 * @param {number} endAlpha 
		 *  (optional, default=255), the alpha to end on
		 *  
		 * @param {function} callback the callback to be invoked when the 
		 * behavior has completed (optional: default=onRiTaEvent(e))
		 * 
		 * @returns {number} - the unique id for this behavior
		 */
		textTo: function(newText, seconds, endAlpha, callback) {
			
		  // grab the alphas if needed
		  var c = this._color, startAlpha = 0, endAlpha = endAlpha || 255; // this._color.a
		  
		  if (this.fadeToTextCopy) 
		  {
			startAlpha = this.fadeToTextCopy.alpha();
			//RiText.dispose(this.fadeToTextCopy); // TODO: do we need this?
		  }
		
		  // use the copy to fade out
		  this.fadeToTextCopy = this.copy();

		  //this.fadeToTextCopy.fadeOut(seconds, 0, true);
		  this.fadeToTextCopy.colorTo(
		  		[this._color.r, this._color.g, this._color.b, 0], 
				seconds, 0, null, 'silent', true); // fade-out
		  
		  RiText.dispose(this.fadeToTextCopy.fadeToTextCopy); // no turtles
		  
		  // and use 'this' to fade in
		  this.text(newText).alpha(startAlpha);
		  
		  return this.colorTo([c.r, c.g, c.b, endAlpha], seconds * .95, 0, null, 'textTo', false);
		},


		/**
		 * Transitions to 'color' (rgba) over 'seconds' starting at 'delay' seconds in the future
		 * 
		 * @param {array} colors (length 1-4)  r,g,b,a (0-255)
		 * @param {number} delay seconds
		 *          time for fade
		 * @param {number} seconds delay 
		 *          (optional, default=0),  # of seconds in the future that the fade will start 
		 * @param {function} callback the callback to be invoked when the behavior has completed
		 *   (optional: default=onRiTaEvent(e))

		 * @returns {number} the unique id for this behavior
		 */
		colorTo : function(colors, seconds, delay, callback, _type, _destroyOnComplete) {             

			// DH: omitting last 2 args from docs as they are private!

			if (!is(colors,A))  err('arg#1 to colorTo() must be an array');
			
			//log(colors[0], g: colors[1], b: colors[2], a: colors[3], seconds);

			delay = delay || 0;
			seconds = seconds || 1.0;
			colors = parseColor.apply(this, colors);
			_type = _type || 'colorTo';            

			var rt = this, id = setTimeout(function() {

				new TextBehavior(rt, rt._color)
					.to( { r: colors.r, g: colors.g, b: colors.b, a: colors.a }, seconds*1000)
					.easing(rt._motionType)
					.onUpdate( function () {
					   rt._color.r = this.r;
					   rt._color.g = this.g;
					   rt._color.b = this.b;
					   rt._color.a = this.a
					})
					.onComplete( 
						function () {
							if (_type != 'silent')
								RiTaEvent(rt, _type+'Complete')._fire(callback);    
							if (_destroyOnComplete) {
								RiText.dispose(rt);
							}
						})
					.start();
				
			}, delay*1000);
			
			return id;
		},
    /**
     * Sets/gets color for this RiText
     * @param {number | array} r takes 1-4 number values for rgba, or an array of size 1-4
	   * @param {number} g (optional)
	   * @param {number} b (optional)
	   * @param {number} a (optional)
	   * @returns {object} the current color (get) or the RiText object (set)
	   */
    color : function(r, g, b, a) {

      if (0 == arguments.length) {
        return this._color;
      }
      else {
        this._color = parseColor.apply(this,arguments);
        return this;
      }
    },
		/**
		 * Move to new x,y position over 'seconds'
		 * <p>
		 * Note: uses the current <code>motionType</code> for this object, starting at 'delay' seconds in the future
		 * 
		 * @param {number} newX
		 * @param {number} newY
		 * @param {number} seconds
		 * @param {number} delay
		 * @param {function} callback the callback to be invoked when the behavior has completed (optional: default=onRiTaEvent(e)
		 * 
		 * @returns {number} the unique id for this behavior
		 */
		moveTo : function(newX,newY,seconds,delay,callback) {
			
			var rt = this;
			
			delay = delay || 0;
			seconds = seconds || 1.0;
			
			var id = setTimeout(function() {
				
				new TextBehavior(rt)
					.to( { x: newX, y: newY }, seconds*1000)
					.easing(rt._motionType)
					.onUpdate( function () {
						rt.x = this.x ;
						rt.y = this.y ;
					})
					.delay(delay).onComplete( 
						function () {
							RiTaEvent(rt, 'moveToCompleted')._fire(callback);                    
						})
					.start();
				
			}, delay*1000);
			
			return id;
		},

		analyze : function() {
	
			this._rs.analyze();
			return this;
		},
		
		/**
		 * Set/gets the text for this RiText
		 * 
		 * @param {string} txt the new text (optional)
		 * @returns {object | string} this RiText (for sets) or the current text (for gets) 
		 */
		text : function(txt) {
			
			if (arguments.length == 1) {
				
				var theType = Type.get(txt);
				
				if (theType == N) {
					txt = String.fromCharCode(txt);
				}
				else if (theType == O && typeof txt.text == F) { 
					txt = txt.text();
				}
				this._rs = (this._rs) ? this._rs.text(txt) : new RiString(txt);
				
				if (!this._rs) err("no rs!! "+txt); // TODO:remove
	 
				return this;
			}
			
			return this._rs._text;
		},
		
		/**
		 * Searches for a match between a substring (or regular expression) and the contained
		 * string, and returns the matches
		 * 
		 * @param {string | object} regex
		 * @returns {array} strings matches or empty array if none are found
		 */
		match : function(regex) {
			
			return this._rs.match(regex);
			
		},
		
		 /**
		 * Returns the character at the given 'index', or empty string if none is found
		 * 
		 * @param {number} index index of the character
		 * @returns {string} the character
		 */
		charAt : function(index) {

			return this._rs.charAt(index);
			
		},

		
		/**
		 * Concatenates the text from another RiText at the end of this one
		 * 
		 * @returns {object} this RiText
		 */
		concat : function(riText) {

			return this._rs._text.concat(riText.text());
			
		},
		
		 /**
		 * Returns true if and only if this string contains the specified sequence of char values.
		 * 
		 * @param {string} text text to be checked
		 * @returns {boolean}
		 */
		containsWord : function(text) {
			
			return this._rs.indexOf(text) > -1;
			
		},
		
		/**
		 * Tests if this string ends with the specified suffix.
		 * 
		 * @param {string} substr string the suffix.
		 * 
		 * @returns {boolean} true if the character sequence represented by the argument is a suffix of
		 *         the character sequence represented by this object; false otherwise.          * 
		 */
		endsWith : function(substr) {
			
			return endsWith(this._rs._text, substr);
			
		},
		
		/**
		 * Compares this RiText to the specified object. The result is true if and only if the
		 * argument is not null and is a RiText object that represents the same sequence of
		 * characters as this object.
		 * 
		 * @param {object} RiText RiText object to compare this RiText against.
		 * @returns {boolean} true if the RiText are equal; false otherwise.
		 */
		equals : function(RiText) {
			
			return RiText._rs._text === this._rs._text;
			
		},

		/**
		 * Compares this RiText to another RiText, ignoring case considerations.
		 * 
		 * @param {string | object} str String or RiText object to compare this RiText against
		 * @returns {boolean} true if the argument is not null and the Strings are equal, ignoring
		 *         case; false otherwise.
		 */
		equalsIgnoreCase : function(str) {
			
			if (typeof str === S) {
				
				return str.toLowerCase() === this._rs._text.toLowerCase();
			} 
			else {
				
				return str.text().toLowerCase() === this._rs._text.toLowerCase();
			}
			
		},
		
		 /**
		 * Returns the index within this string of the first occurrence of the specified character.
		 * 
		 * @param {string} searchstring (Required) or character to search for
		 * @param {number} start (Optional) The start position in the string to start the search. If omitted,
		 *        the search starts from position 0
		 * @returns {number} the first index of the matching pattern or -1 if none are found
		 */
		indexOf : function(searchstring, start) {
			
			return this._rs._text.indexOf(searchstring, start);
			
		},

		
		 /**
		 * Returns the index within this string of the last occurrence of the specified character.
		 * 
		 * @param {string} searchstring The string to search for
		 * @param {number} start (Optional) The start position in the string to start the search. If omitted,
		 *        the search starts from position 0
		 *        
		 * @returns {number} the last index of the matching pattern or -1 if none are found
		 */
		lastIndexOf : function(searchstring, start) {
			
			return this._rs._text.lastIndexOf(searchstring, start);
			
		},
		
		/**
		 * Returns the length of this string.
		 * 
		 * @returns {number} the length
		 */
		length : function() {
			
			return this._rs._text.length;
			
		},
		
	
		 /**
		 * Returns an array of part-of-speech tags, one per word, using RiTa.tokenize() and RiTa.posTag().
		 *
		 * @returns {array} strings of pos, one per word
		 */
		pos : function() {
				   
			var words = RiTa.tokenize((this._rs._text)); // was getPlaintext()
			var tags = PosTagger.tag(words); 
  
			for ( var i = 0, l = tags.length; i < l; i++) {
				if (!strOk(tags[i])) 
					err("RiText: can't parse pos for:" + words[i]);
			}
		
			return tags;
			
		},

		/**
		 * Returns the part-of-speech tag for the word at 'index', using RiTa.tokenize() and RiTa.posTag().
		 * 
		 * @param {number} index the word index
		 * @returns {string} the pos
		 */
		posAt : function(index) {
			
			var tags = this._rs.pos();

			if (undef(tags) || tags.length == 0 || index < 0 || index >= tags.length)
				return E;
			
			return tags[index];
			
		},

		 /**
		 * Inserts the character at the specified index
		 * 
		 * @param {number} ind the index
		 * @param {string} theChar the character(s)
		 * @returns {object} RiText
		 */
		insertChar : function(ind, theChar) { 
			
			this._rs.insertChar(ind, theChar);
			return this;
			
		},
		
		/**
		 * Removes the character at the specified index
		 * 
		 * @param {number} ind the index
		 * @returns {object} RiText
		 */
		removeChar : function(ind) { 
			
			this._rs.removeChar(ind);
			return this;
			
		},
		

	  /**
		 * Replaces the character at 'idx' with 'replaceWith'. If the specified 'idx' is less than
		 * zero, or beyond the length of the current text, there will be no effect.
		 * 
		 * @param {number} idx the character index
		 * @param {string} replaceWith the replacement
		 * @returns {object} this RiText
		 */
		replaceChar : function(idx, replaceWith) {
			
			this._rs.replaceChar(idx, replaceWith);
			return this;
		},

		/**
		 * Replaces the first instance of 'regex' with 'replaceWith'
		 * 
		 * @param {string | regex} regex the pattern
		 * @param {string} replaceWith the replacement
		 * 
		 * @returns this RiText
		 */
		replaceFirst : function(regex, replaceWith) {
			
			if (replaceWith) 
				this._rs._text = this._rs._text.replace(regex,replaceWith);
			return this;
			
		},
		
		/**
		 * Replaces the last instance of 'regex' with 'replaceWith'
		 * 
		 * @param {string | regex} regex the pattern
		 * @param {string} replaceWith the replacement
		 * 
		 * @returns this RiText
		 */
		replaceLast : function(regex, replaceWith) {
		   
			if (replaceWith) {

				if (this._rs._text.lastIndexOf(regex) >= 0) { //TODO: this do not work for regex..
					var ind = this._rs._text.lastIndexOf(regex);
					var before = this._rs._text.substring(0, ind);
					var after = this._rs._text.substring(ind + regex.length);

					var finished = before + replaceWith + after;
					this._rs._text = finished;

					return this;
				}
			};
		},
		
		/**
		 * Replaces each substring of this string that matches the given regular expression with the
		 * given replacement.
		 * 
		 * @param {string | regex } pattern the pattern to be matched
		 * @param {string} replacement the replacement sequence of char values
		 * @returns {object} this RiText
		 */
		replaceAll : function(pattern, replacement) {
			
			// SHOULD BE: this._rs._text.replace(pattern, replacement)
			if (pattern && (replacement || replacement==='')) {
				this._rs._text = replaceAll(this._rs._text, pattern, replacement);
			}
			return this;
			
		},
		
		 /**
		 * Replaces the word at 'wordIdx' with 'newWord'
		 * 
		 * @param {number} wordIdx the index
		 * @param {string} newWord the replacement
		 * 
		 * @returns {object} this RiText
	     */
		replaceWord : function(wordIdx, newWord) {

			this._rs.replaceWord.apply(this,arguments);
			
			return this; // TODO: check that all RiText methods use the delegate 
						//  (like above) for methods that exist in RiString
		},	 
		
		/**
		 * Removes the word at 'wordIdx'.
		 * 
		 * @param {number} wordIdx the index
		 * 
		 * @returns {object} this RiText
		 */
		removeWord : function(wordIdx) {
			
			this._rs.removeWord.apply(this,arguments);
			return this;
		},   
		
		
		/**
		 * Inserts 'newWord' at 'wordIdx' and shifts each subsequent word accordingly.
		 *
		 * @returns {object} this RiText
		 */
		insertWord : function(wordIdx, newWord) {
			
			this._rs.insertWord.apply(this, arguments);
			return this;            
		},
		
	
		 /**
		 * Extracts a part of a string from this RiText
		 * 
		 * @param {number} begin (Required) The index where to begin the extraction. First character is at
		 *        index 0
		 * @param {number} end (Optional) Where to end the extraction. If omitted, slice() selects all
		 *        characters from the begin position to the end of the string
		 * @returns {object} this RiText
		 */
		slice : function(begin, end) {
			
			var res = this._rs._text.slice(begin, end) || E;
			return this._rs.text(res);
			 
		},
		
		/**
		 * Split a RiText into an array of sub-RiText and return the new array.
		 * 
		 * If an empty string ("") is used as the separator, the string is split between each character.
		 * 
		 * @param {string} separator (Optional) Specifies the character to use for splitting the string. If
		 *        omitted, the entire string will be returned. If an empty string ("") is used as the separator, 
		 *        the string is split between each character.
		 *        
		 * @param {number} limit (Optional) An integer that specifies the number of splits
		 * 
		 * @returns {array} RiText
		 
		split : function(separator, limit) {
			
			var parts = this._rs._text.split(separator, limit);
			var rs = [];
			for ( var i = 0; i < parts.length; i++) {
				if (!undef(parts[i]))
					rs.push(new RiText(parts[i]));
			}
			return rs;
		},*/
		
		 /**
		 * Tests if this string starts with the specified prefix.
		 * 
		 * @param {string} substr string the prefix
		 * 
		 * @returns {boolean} true if the character sequence represented by the argument is a prefix of
		 *         the character sequence represented by this string; false otherwise. Note also
		 *         that true will be returned if the argument is an empty string or is equal to this
		 *         RiText object as determined by the equals() method.
		 */
		startsWith : function(substr) {
			
			return this._rs.indexOf(substr) == 0;
			
		},
		
		 /**
		 * Extracts the characters from a string, between two specified indices, and sets the
		 * current text to be that string. 
		 * 
		 * @param {number} from  The index where to start the extraction. First character is at
		 *        index 0
		 * @param {number} to (optional) The index where to stop the extraction. If omitted, it extracts the
		 *        rest of the string
		 * @returns {object} this RiText
		 */
		substring : function(from, to) {

			return this._rs.text(this._rs._text.substring(from, to));
			
		},

		
		 /**
		 * Extracts the characters from this objects contained string, beginning at 'start' and
		 * continuing through the specified number of characters, and sets the current text to be
		 * that string. (from Javascript String)
		 * 
		 * @param {number} start  The index where to start the extraction. First character is at
		 *        index 0
		 * @param {number} length (optional) The index where to stop the extraction. If omitted, it extracts the
		 *        rest of the string
		 * @returns {object} this RiText
		 */
		substr : function(start, length) {
			
			var res = this._rs._text.substr(start, length);
			return this._rs.text(res);
			
		},
		
		/**
		 * Converts this object to an array of RiText objects, one per character
		 * 
		 * @returns {array} RiTexts with each letter as its own RiText element
		 */
		toCharArray : function() {
			return this._rs._text.split(E); // DCH: to match Java, 4/13/13
			/*var parts = this._rs._text.split(E);
			var rs = [];
			for ( var i = 0; i < parts.length; i++) {
				if (!undef(parts[i]))
					rs.push(parts[i]);
			}
			return rs;*/
		},
		
		/**
		 * Converts all of the characters in this RiText to lower case
		 * 
		 * @returns {object} this RiText
		 */
		toLowerCase : function() {
			
			return this._rs.text(this._rs._text.toLowerCase());
			
		},
		 
		/**
		 * Converts all of the characters in this RiText to upper case
		 * 
		 * @returns {object} this RiText
		 */
		toUpperCase : function() {
			
			return this._rs.text(this._rs._text.toUpperCase());
			
		},
		
		/**
		 * Returns a copy of the string, with leading and trailing whitespace omitted.
		 * 
		 * @returns {object} this RiText
		 */
		trim : function() {
			
			return this._rs.text(trim(this._rs._text));
			
		},
		
		/**
		 * Returns the word at 'index', according to RiTa.tokenize()
		 * 
		 * @param {number} index the word index
		 * @returns {string} the word
		 */
		wordAt : function(index) {
			
			var words = RiTa.tokenize((this._rs._text));
			if (index < 0 || index >= words.length)
				return E;
			return words[index];
			
		},
		
		/**
		 * Returns the number of words in the object, according to RiTa.tokenize().
		 * 
		 * @returns {number} number of words
		 */
		wordCount : function() {
			
			if (!this._rs._text.length) return 0;
			return this.words().length;
		},
		
		/**
		 * Returns the array of words in the object, via a call to RiTa.tokenize().
		 * 
		 * @returns {array} strings, one per word
		 */
		words : function() { 
			
			return RiTa.tokenize(this._rs._text);
		},

		/**
		 * Returns the distance between the center points of this and another RiText
		 * @returns {number} the distance
		 */
		distanceTo : function(riText) {
			
		  var p1 = this.center(), p2 = riText.center();
		  return RiTa.distance( p1.x,  p1.y,  p2.x,  p2.y);
		},
	  
		/**
		 * Returns the center point of this RiText as derived from its bounding box
		 * @returns {object} { x, y }
		 */
		center : function() {
			
			var bb = this.boundingBox();
			return { x: bb.x + bb.width/2.0, y: bb.y - bb.height/2.0 };
		},
		
		/**
		 * Splits the object into an array of RiTexts, one per word
		 * tokenized with the supplied regex.
		 * 
		 * @param {regex | string} to split
		 * @returns {array} RiTexts
		 */
		splitWords : function(regex) {
			
			regex = regex || SP;
			
			(typeof regex == S) && (regex = new RegExp(regex));  
			
			var l = [];
			var txt = this._rs._text;
			var words = txt.split(regex);
	
			for ( var i = 0; i < words.length; i++) {
				if (words[i].length < 1) continue;
				var tmp = this.copy();
				tmp.text(words[i]);
				var mx = RiText._wordOffsetFor(this, words, i);
				tmp.position(mx, this.y);
				l.push(tmp);
			}
	
			return l;
		},
	
		/**
		 * Splits the object into an array of RiTexts, one per letter.
		 * @returns {array} RiTexts
		 */
		splitLetters : function() {
	
			var l = [];
			var chars = [];
			var txt = this.text();
			var len = txt.length;
			for (var t = 0; t < len; t++) {
				chars[t] = txt.charAt(t);
			}
	
			for ( var i = 0; i < chars.length; i++) {
				if (chars[i] == SP) continue;
				var tmp = this.copy();
				tmp.text(chars[i]);
				var mx = this.charOffset(i);
				tmp.position(mx, this.y);
				l.push(tmp);
			}
	
			return l;
		},
		
		/**
		 * Returns true if the bounding box for this RiText contains the point mx/my
		 * 
		 * @param {number} mx
		 * @param {number} my
		 * @returns {boolean}
		 */
		contains : function(mx, my) {
						

		   var bb = this.boundingBox(false);
		   //log('contains('+mx+','+my+') '+ bb.x + ","+bb.width+","+bb.y + ","+(bb.height));
		   
			//           // TODO: need to test this with point
			//           if (!my && Type.get(mx.x) == 'Number' && Type.get(mx.y) == 'Number') {
			//               mx = mx.x;
			//               my = mx.y;
			//           }
			//           
		   bb.x += this.x;
		   bb.y += this.y;
		   
		   return (!(mx<bb.x || mx > bb.x+bb.width || my < bb.y || my > bb.y+bb.height));
		},
		
		/**
		 * Creates and returns a new (copy) of this RiText
		 * @returns {object} RiText
		 */
		copy : function() {

			var c = new RiText(this.text(), this.x, this.y, this._font);
			c.fill(this._color.r, this._color.g, this._color.b, this._color.a);

			for (var prop in this) {
				if (typeof this[prop] ==  F || typeof this[prop] ==  O) 
					continue;
				c[prop] = this[prop];
			}

			return c;
		},
		
		/**
		 * Set/gets the alignment for this RiText (RiTa.LEFT || RiTa.CENTER || RiTa.RIGHT)
		 * 
		 * @param {object} align (optional) the alignment 
		 * @returns {object} this RiText (set) or the current font (get)
		 */
		align : function(align) {
			if (arguments.length) {
				this._alignment = align;
				return this;
			}
			return this._alignment;
		},

		
		/**
		 * Set/gets the font for this RiText
		 * 
		 * @param {object} font (optional) containing the font data OR
		 * @param {string} font containing the font name AND
		 * @param {number} size (optional) containing the font size 
		 * @returns {object} this RiText (set) or the current font (get)
		 */
		font : function(font, size) {
			
			var a = arguments;
			
			if (a.length == 1) {

				this._font = font || RiText._getDefaultFont();
				this._font.size = this._font.size || RiText.defaults.fontSize;
				if (!this._font.leading) this._font.leading = 0;
				return this;
			}
			else if (a.length == 2) {
				
				return this.font( RiText.createFont(a[0], a[1]) );
			}

			return this._font;
		},    
		

		/**
		 * Set/gets the visibility of the bounding box for this RiText
		 * 
		 * @param {boolean} trueOrFalse (optional) true or false 
		 * @returns {object | boolean} this RiText (set) or the current boolean value (get)
		 */
		showBounds : function(trueOrFalse) {
		   if (arguments.length == 1) {
			   this._showBounds = trueOrFalse;
			   return this;
		   }
		   return this._showBounds;
		},

		/**
		 * Set/gets the fill color for this RiText
		 * 
		 * @param {number | array} takes 1-4 number values for rgba, or an array of size 1-4
		 * @param {number} cg
		 * @param {number} cb
		 * @param {number} ca
		 * 
		 * @returns {object} either this RiText (for sets) or the current color object (for gets)
		 */
		fill : function(cr, cg, cb, ca) {
			//console.log("fill");
			if (arguments.length == 0) 
				return this._color;
			this._color = parseColor.apply(this, arguments);
			return this;
		},
	
		/**
		 * Returns false if the alpha value of this object is &lt;= 0, else true
		 * @returns {boolean} 
		 */
		isVisible : function(b) { 
			
			if (arguments.length)
				 err('visible() takes no arguments');
			
			return this._color.a > 0;
		},
		
		/**
		 * Set/gets the alpha (transparency) for this RiText
		 *
		 * @param {number} a (optional) input (0-255) 
		 * @returns {object | number} either this RiText (for set) or the current alpha value (for get)
		 */
		alpha : function(a) {
			if (arguments.length==1) {
				this._color.a = a;
				return this;
			}
			else return this._color.a;
		},
	
		/**
		 * Set/gets the position for this RiText
		 * 
		 * @param {number} x (optional) X coordinate
		 * @param {number} y (optional) Y coordinate
		 * 
		 * @returns {object} either this RiText (for sets) or object {x, y} (for gets)
		 */
		position : function(x, y) {
			
			//TODO: add Z
			 
			if (!arguments.length) 
				return { x: this.x, y: this.y };
			this.x = x;
			this.y = y;
			return this;
		},
	 
		/**
		 * Sets/gets the 2d rotation for this RiText
		 * 
		 * @param {number} rotate degree to rotate
		 * 
		 * @returns {object} either this RiText (for sets) or the current degree of rotation (for gets)
		 */
		rotate : function(rotate) {
			
			//TODO: add X,Y ??
		  if (!arguments.length) 
			  return this._rotateZ
		  this._rotateZ = rotate;
		  return this;
		},
	
		/**
		 * Sets/gets the scale factor for this RiText (takes 0-2 arguments) 
		 * 
		 * @param {number} theScaleX the ScaleX ratio
		 * @param {number} theScaleY (optional) the ScaleY ratio 
		 * 
		 @returns { object } either this RiText (for sets) or the current scales (for gets)
		 */
		scale : function(theScaleX, theScaleY) {
			
			if (!arguments.length) return { x:this._scaleX, y:this._scaleY }; //TODO: add Z
				
			if (arguments.length == 1) theScaleY = theScaleX;
			
			this._scaleX = theScaleX;
			this._scaleY = theScaleY;
			
			return this;
		},
	
		/**
		 * Returns the pixel x-offset for the character at 'charIdx'
		 * 
		 * @param {number} charIdx
		 * @returns {number} the pixel x-offset
		 */
		charOffset : function(charIdx) {
	
			var theX = this.x;
	
			if (charIdx > 0) {
	
				var txt = this.text();
	
				var len = txt.length;
				if (charIdx > len) // -1?
				charIdx = len;
	
				var sub = txt.substring(0, charIdx);
				theX = this.x + this.g._textWidth(this._font, sub);
			}

			return theX;
		},
		
		/**
		 * Returns the pixel x-offset for the word at 'wordIdx'
		 * @param {number} wordIdx
		 * @returns {number} the pixel x-offset
		 */
		wordOffset : function(wordIdx) { 
			
			var words =  this.text().split(' ');
			return RiText._wordOffsetFor(this, words, wordIdx);
		},

		/**
		 * Returns the relative bounding box for the current text
		 * @param {boolean} (optional, default=false) 
		 * 	if true, bounding box is first transformed (rotate,translate,scale) 
		 * @returns {object} x,y,width,height 
		 */
		boundingBox : function(transformed) {

			var g = this.g;

			g._pushState();

			g._rotate(this._rotateZ);
			g._translate(this.x, this.y);
			g._scale(this._scaleX, this._scaleY, this._scaleZ); 
	
			// Set font params
			g._textFont(this._font);
			g._textAlign(this._alignment);

				var bb = this.g._getBoundingBox(this);
				if (transformed) {
					bb.x += this.x;
					bb.y += this.y;
					bb.width *= this._scaleX;
					bb.height *= this._scaleY
				}
					
			g._popState();

			return bb;
		},

		/**
		 * Returns the current width of the text (derived from the bounding box)
		 * @returns {number} the width of the text
		 */
		//@param {boolean} (optional, default=false) if true, width is first scaled
		textWidth : function() { 
			
			return this.g._textWidth(this._font,this._rs._text);
		},
		
		/**
		 * Returns the current height of the text (derived from the bounding box)
		 * @returns {number} the current height of the text
		 */
		// * @param {boolean} (optional, default=false) if true, height is first scaled
		textHeight : function() { 
			
			return this.g._textHeight(this);
		},
		
		/**
		 * Sets/gets the size of the current font. Note: this method only
		 * effects only scaleX/Y, not the font's internal properties 
		 * 
		 * @param {number} sz (optional) font size 
		 * 
		 * @returns {object | number} either this RiText (for set) or the current font size (for get)
		 */
		fontSize : function(sz) {
 
			// TODO: what to do if scaleX and scaleY are different?
			
			return (arguments.length) ? this.scale( sz / this._font.size) 
				: (this._font.size * this._scaleX);
		},
		
		/**
		 * Returns the ascent of the current font 
		 * @returns {number} the ascent of the current font
		 */
		textAscent : function() { 
			
			return this.g._textAscent(this);
		},
		
		/**
		 * Returns the descent of the current font 
		 * @returns {number} the descent of the current font 
		 */
		textDescent : function() { 
			
			return this.g._textDescent(this);
		},
		 
		/**
		 * Adds a new text behavior to the object  
		 * @returns {array} 
		 */
		_addBehavior: function ( behavior ) {

			this._behaviors.push( behavior );

		},
		
		/**
		 * Returns the specified text behavior  
		 * @param {number} the behavior id
		 */
		_getBehavior: function ( id ) {

			for (var i = 0; i < this._behaviors.length; i++) {
				if (this._behaviors[i].id == id)
					return this._behaviors[i].id;
			}
			
			return null;
		},
		
		/**
		 * Removes the specified text behavior for the object  
		 * 
		 * @param {number} the behavior id
		 * @returns {object} this RiText
		 */
		stopBehavior: function ( id ) {

			var behavior = this._getBehavior(id);
			
			if (behavior) {
				var i = this._behaviors.indexOf(behavior);
				if ( i !== -1 ) {
	
					this._behaviors.splice( i, 1 );
	
				}
			}
			return this;
		},
		
		/**
		 * Removes all text behaviors for the object  
		 * 
		 * @returns {object} this RiText 
		 */
		stopBehaviors: function () {

			this._behaviors = [];
			return this;
		},
		
		/**
		 * Updates existing text behaviors for the object 
		 * @param {string} the behaviors
		 */
		_updateBehaviors: function (time) {

			var i = 0;
			var num = this._behaviors.length;
			var time = time || Date.now();

			while ( i < num ) {

				if (this._behaviors[i].update(time) ) {
					i++;

				} else {

					this._behaviors.splice(i, 1);
					num --;

				}
			}
		},
		
		/** @private */
		toString : function() {
			
			var s =  (this._rs && this._rs._text) || 'undefined';
			return '['+Math.round(this.x)+","+Math.round(this.y)+",'"+s+"']";
		}

		//        updateMousePosition : function(curElement, event) {
		//            var offset = calculateOffset(window, event);
		//            p.mouseX = event.pageX - offset.X;
		//            p.mouseY = event.pageY - offset.Y
		//        }
	}
	
	/////////////////////////////////////////////////////////////////////////
	// RiLetterToSound (adapted from FreeTTS text-to-speech)
	/////////////////////////////////////////////////////////////////////////
	
	var LetterToSound = makeClass();
	
	/**
	 * Entry in file represents the total number of states in the file. This
	 * should be at the top of the file. The format should be "TOTAL n" where n is
	 * an integer value.
	 */
	LetterToSound.TOTAL = "TOTAL";
	
	/**
	 * Entry in file represents the beginning of a new letter index. This should
	 * appear before the list of a new set of states for a particular letter. The
	 * format should be "INDEX n c" where n is the index into the state machine
	 * array and c is the character.
	 */
	LetterToSound.INDEX = "INDEX";
	
	/**
	 * Entry in file represents a state. The format should be "STATE i c t f"
	 * where 'i' represents an index to look at in the decision string, c is the
	 * character that should match, t is the index of the state to go to if there
	 * is a match, and f is the of the state to go to if there isn't a match.
	 */
	LetterToSound.STATE = "STATE";
	
	/**
	 * Entry in file represents a final state. The format should be "PHONE p"
	 * where p represents a phone string that comes from the phone table.
	 */
	LetterToSound.PHONE = "PHONE";
	
	/**
	 * If true, the state string is tokenized when it is first read. The side
	 * effects of this are quicker lookups, but more memory usage and a longer
	 * startup time.
	 */
	LetterToSound.tokenizeOnLoad = true;
	
	/**
	 * If true, the state string is tokenized the first time it is referenced. The
	 * side effects of this are quicker lookups, but more memory usage.
	 */
	LetterToSound.tokenizeOnLookup = false;

	/**
	 * The 'window size' of the LTS rules.
	 */
	LetterToSound.WINDOW_SIZE = 4;

	/** The list of phones that can be returned by the LTS rules.
	LetterToSound.phonemeTable = null;  */
	
	LetterToSound.prototype = {
		
		/**
		 * @private
		 */
		init : function() {
			
			/**
			 * The indices of the starting points for letters in the state machine.
			 */
			this.letterIndex = {};
			
			/**
			 * An array of characters to hold a string for checking against a rule. This
			 * will be reused over and over again, so the goal was just to have a single
			 * area instead of new'ing up a new one for every word. The name choice is to
			 * match that in Flite's <code>cst_lts.c</code>.
			 */
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
			if (!LetterToSound.RULES) LetterToSound.RULES = _RiTa_LTS;
			
			if (!LetterToSound.RULES.length) 
				throw Error("No LTS-rules found!");
			
			// add the rules to the object (static?)
			for ( var i = 0; i < LetterToSound.RULES.length; i++) {
				
				this.parseAndAdd(LetterToSound.RULES[i]);
			}
		},
		
		_createState : function(type, tokenizer) {
		 
			if (type === LetterToSound.STATE)
			{
			  var index = parseInt(tokenizer.nextToken());
			  var c = tokenizer.nextToken();
			  var qtrue = parseInt(tokenizer.nextToken());
			  var qfalse = parseInt(tokenizer.nextToken());
			  
			  return new DecisionState(index, c.charAt(0), qtrue, qfalse);
			}
			else if (type === LetterToSound.PHONE)
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

		  if (type == LetterToSound.STATE || type == LetterToSound.PHONE)
		  {
			if (LetterToSound.tokenizeOnLoad)
			{
			  this.stateMachine[this.numStates] = this._createState(type, tokenizer);
			} 
			else
			{
			  this.stateMachine[this.numStates] = line;
			}
			this.numStates++;
		  } 
		  else if (type==LetterToSound.INDEX)
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
		  else if (type==LetterToSound.TOTAL)
		  {
			this.stateMachine = [];
			this.stateMachineSize = parseInt(tokenizer.nextToken());
		  }
		},
		
		/**
		 * Calculates the phone list for a given word. If a phone list cannot be
		 * determined, <code>[]</code> is returned. 
		 * 
		 * @param {string | array } input the word or words to find
		 * 
		 * @return {string} phones for word, separated by delim,
		 *   or <code>empty string</code>
		 */
		getPhones : function(input, delim) {
			
			var ph, result = []; 
			
			delim = delim || '-';
			
			if (is(input, S)) {
				
				if (!input.length) return E; 
				
				input = RiTa.tokenize(input);
			}
  
			for (var i = 0; i < input.length; i++) {
				
				ph = this._computePhones(input[i]);
				result[i] = ph ? ph.join(delim) : E;
			}
			
			return result.join(delim);  
		},

		/**
		 * Calculates the phone list for a given word. If a phone list cannot be
		 * determined, <code>null</code> is returned. 
		 * 
		 * @param word the word or words to find
		 * 
		 * @return array of phones for word or <code>null</code>
		 */
		_computePhones : function(word) {
			
		  var dig, phoneList = [], full_buff, tmp, currentState, startIndex, stateIndex, c;
		  
		  if (!word || !word.length || RiTa.isPunctuation(word))
			  return null;
		  
		  word = word.toLowerCase();
		  
		  if (isNum(word)) {
			  
			  word = (word.length>1) ? word.split(E) : [word];
			  
			  for (var i = 0; i < word.length; i++) {
				  
				  dig = parseInt(word[i]);
				  if (dig < 0 || dig > 9)
					  throw Error("Attempt to pass multi-digit number to LTS: '"+word+"'");
				  
				  phoneList.push(Phones.digits[dig]);
			  }
			  
			  return phoneList;
		  }
	
		  // Create "000#word#000"
		  tmp = "000#"+word.trim()+"#000", full_buff = tmp.split("");
		  
		  // For each character in the word, create a WINDOW_SIZE
		  // context on each size of the character, and then ask the
		  // state machine what's next. Its magic
		  for (var pos = 0; pos < word.length; pos++) {
			  
			for (var i = 0; i < LetterToSound.WINDOW_SIZE; i++) {
				
			  this.fval_buff[i] = full_buff[pos + i];
			  this.fval_buff[i + LetterToSound.WINDOW_SIZE] = full_buff[i + pos + 1 + LetterToSound.WINDOW_SIZE];
			}
			
			c = word.charAt(pos);
			startIndex = this.letterIndex[c];
			
			// must check for null here, not 0
			if (startIndex==null) {
				warn("Unable to generate LTS for '"+word+"'\nNo LTS index for character: '"+c + "', isDigit=" + isNum(c) + ", isPunct=" + RiTa.isPunctuation(c));
				return null;
			}

			stateIndex = parseInt(startIndex);
			
			currentState = this.getState(stateIndex);
			
			while (! (currentState instanceof FinalState) ) {
				
			  stateIndex = currentState.getNextState(this.fval_buff);
			  currentState = this.getState(stateIndex);
			}
			
			currentState.append(phoneList);
		  }
		  
		  return phoneList;
		},
		
		getState : function(i) {

			if (is(i,N)) {
				
				var state = null;
				
				// WORKING HERE: this check should fail :: see java
				if (is(this.stateMachine[i],S)) {
					
				  state = this.getState(this.stateMachine[i]);
				  if (LetterToSound.tokenizeOnLookup)
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
	}
	
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
		init : function(index, c, qtrue, qfalse) {
			
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
		init : function(phones) {
			
			this.phoneList = [];
			
			if (phones===("epsilon"))
			{
				this.phoneList = null;
			} 
			else if (is(phones,A)) {
				
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
			return LetterToSound.PHONE + " epsilon";
		  } 
		  else if (this.phoneList.length == 1)
		  {
			return LetterToSound.PHONE + " " + this.phoneList[0];
		  } 
		  else
		  {
			return LetterToSound.PHONE + " " + this.phoneList[0] + "-" + this.phoneList[1];
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
		}
	}
	
	/////////////////////////////////////////////////////////////////////////
	//StringTokenizer
	/////////////////////////////////////////////////////////////////////////
	
	var StringTokenizer = makeClass();  
	
	StringTokenizer.prototype = {
	
		init : function(str, delim) {
			
			this.idx = 0;
			this.text = str;
			this.delim = delim || " ";
			this.tokens = str.split(delim);
		},
		
		nextToken : function() {
			
			return (this.idx < this.tokens.length) ? this.tokens[this.idx++] : null;
		}
	}
	
	////////////////////////// PRIVATE CLASSES ///////////////////////////////

	
	// ///////////////////////////////////////////////////////////////////////
	// RiText_Canvas 2d-Renderer
	// ///////////////////////////////////////////////////////////////////////
	
	/**
	 * @name RiText_Canvas
	 * @class
	 * @private
	 */
	var RiText_Canvas = makeClass();
	
	RiText_Canvas.prototype = {

		init : function(ctx) {
			this.ctx = ctx;
		},
		
		_getGraphics : function() {
			return this.ctx;
		},
		
		_pushState : function() {
			this.ctx.save();
			return this;
		},
		
		_popState : function() {
			this.ctx.restore();
			return this;
		},
		
		_background : function(r,g,b,a) {
			this._fill(r,g,b,a);
			this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
		},

		_scale : function(sx, sy) {
			this.ctx.scale(sx, sy, 1);
		},
		
		_translate : function(tx, ty) {
			this.ctx.translate(tx, ty, 0);
		},
		
		_rotate : function(zRot) {
			//console.log('rotate: '+zRot);
			this.ctx.rotate(0,0,zRot);
		},
		
		_line : function(x1,y1,x2,y2,lw) {
			
	  
			lw = lw || 1; // canvas hack for crisp lines
			x1 = Math.round(x1), x2 = Math.round(x2);
			y1 = Math.round(y1), y2 = Math.round(y2);
			
			//log('line: ('+(x1)+","+(y1)+","+(x2)+","+(y2)+")");
			
			this.ctx.save();
			
			if (x1 === x2) {
				if (y1 > y2) {
					var swap = y1;
					y1 = y2;
					y2 = swap;
				}
				y2++;
				if (lw % 2 === 1)
					this.ctx.translate(0.5, 0);
			} 
			else if (y1 === y2) {
				if (x1 > x2) {
					var swap = x1;
					x1 = x2;
					x2 = swap;
				}
				x2++;
				if (lw % 2 === 1) 
					this.ctx.translate(0, 0.5);
			}
			
			
			this.ctx.beginPath();
			this.ctx.moveTo(x1 || 0, y1 || 0);
			this.ctx.lineTo(x2 || 0, y2 || 0);
			this.ctx.lineWidth = lw;
			this.ctx.stroke();
			
			this.ctx.restore();
		},
		
		_rect : function(x,y,w,h) {
  
			this._line(x,y,x+w,y);
			this._line(x,y+h,x+w,y+h);
			this._line(x,y,x,y+h);
			this._line(x+w,y,x+w,y+h)

			// TODO: add test with filled bounding boxes and check
			this.ctx.fillRect(x+1,y+1,w-1,h-1); // [hack] 
		},
		
		_size : function(w, h, renderer) {
			
			
			this.ctx.canvas.width = w;
			this.ctx.canvas.height = h;
			if (renderer) console.warn("Renderer arg ignored");
		},
		
		_createFont : function(fontName, fontSize, leading) {
			
			var font = {
				name:       fontName, 
				size:       fontSize || RiText.defaults.font.size 
				//leading:    leading || 0
			};
			return font;
		},
		
		_width : function() {
			
			return this.ctx.canvas.width || 200;
		},
		
		_height : function() {
			
			return this.ctx.canvas.height || 200;
		},
		
		_fill : function(r,g,b,a) {
			
			this.ctx.fillStyle="rgba("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+","+(a/255)+")";
		},
		
		_stroke : function(r,g,b,a) {
			
			this.ctx.strokeStyle = is(r,S) ? r : "rgba("+Math.round(r)
				+","+Math.round(g)+","+Math.round(b)+","+(a/255)+")";
		},
		
		_textAlign : function(align) {
			
			switch (align) {
				case RiTa.LEFT:
					this.ctx.textAlign = 'left';
					break;
				case RiTa.CENTER:
					this.ctx.textAlign = 'center';
					break;
				case RiTa.RIGHT:
					this.ctx.textAlign = 'right';
					break;
			}
		},
		
		_type : function() { return "Canvas"; },
		
		// only applies the font to the context!
		_textFont : function(fontObj) {
			if (!is(fontObj,O))
				err("_textFont expects object, but got: "+fontObj);
			this.ctx.font = "normal "+fontObj.size+"px "+fontObj.name;
		},
		
		_textAscent : function(rt) {
			return this._getMetrics(rt).ascent;
		},
		
		_textDescent : function(rt) {
			return this._getMetrics(rt).descent;
		},

		// should operate on the RiText itself (take rt as arg?)
		_text : function(str, x, y) {
			//log("text: "+str+","+x+","+y+","+this.ctx.textAlign);
			this.ctx.baseline = 'alphabetic';
			this.ctx.fillText(str, x, y);
			//this.ctx.strokeText(str, x, y);
		},

		_textWidth : function(fontObj, str) {
			this.ctx.save();
			this._textFont(fontObj);
			var tw = this.ctx.measureText(str).width;
			this.ctx.restore();
			return tw;
		},

		_textHeight : function(rt) {
			this.ctx.save();
			var h = this._getBoundingBox(rt).height;
			this.ctx.restore();
			return h;
		},
		
		//  hack to deal with lack of metrics in the canvas
		_getBoundingBox : function(rt) {

			//this.ctx.save();
			
			this._textFont(rt._font);
			var w = this.ctx.measureText(rt.text()).width;
			// this must be cached...
			var metrics = this._getMetrics(rt);
			
			//log('[CTX] ascent='+metrics.ascent+' descent='+metrics.descent+" h="+(metrics.ascent+metrics.descent));
			//this.ctx.restore();
			
			return { x: 0, y: -metrics.ascent-1, width: w, height: metrics.ascent+metrics.descent+1 };
		},

		_getOffset : function(elem) { // private, not in API 
			var box = elem.getBoundingClientRect();
			return { top: box.top, left: box.left };
		},
		
		_getDivChild : function(html) { // private, not in API 
			
			var frag = document.createDocumentFragment(); 
			var div = document.createElement("div");
			frag.appendChild( div );
			div.innerHTML = html;
			div.parentNode.removeChild( div );            
			return div.firstChild; 
		},
		
		_getMetrics : function(rt) {  // hack for font metrics in the canvas
			
			// TODO: if (rt._metrics) return rt._metrics; // check cache (invalidate on any change of font or size or...)

			var st = '<span style="font-size: '+rt._font.size+'; font-family: '+rt._font.name+'">'+rt.text()+'</span>';
			var dt = '<div style="display: inline-block; width: 1px; height: 0px; vertical-align: bottom; "></div>';
			var text = this._getDivChild(st);
			var block = this._getDivChild(dt);

			// make the 'div' fragment   ====================
			var fragment = document.createDocumentFragment(); 
			var div = document.createElement("div");
			fragment.appendChild( div );
			
			// append 'text' and 'block' to the div
			div.appendChild(text); 
			div.appendChild(block);
  
			// insert the fake 'div' in the body
			document.body.appendChild(div);

			try {
				var result = {};

				block.style.verticalAlign = 'baseline';
				result.ascent = this._getOffset(block).top - this._getOffset(text).top + 1;
				
				block.style.verticalAlign = 'bottom';
				var height = this._getOffset(block).top - this._getOffset(text).top;

				result.descent = (height - result.ascent);
				result.ascent -=  result.descent;
			} 
			finally {
				document.body.removeChild(div);
				div.removeChild(text);
				div.removeChild(block);
				// fragment.removeChild(div);
			}

			// TODO: rt._metrics = results; // add to cache
			
			return result;
		},

		/** @private */
		toString : function() {
			
			return "RiText_"+this._type;
		}
		
	}        
	
	// ////////////////////////////////////////////////////////////
	// Timer
	// ////////////////////////////////////////////////////////////
	
	var timers = new Object(); // static

	/**
	 * @name Timer - modified from Resig's JQuery-Timer
	 * @class
	 * @private
	 */
	var Timer = function(func, time, autostart) {
			
		this.set = function(func, time, autostart) {
			
			this.init = true;
			if (typeof func == 'function') this.action = func;
			if (!isNaN(time)) this.intervalTime = time;
			if (autostart && !this.isActive) {
				this.isActive = true;
				this.setTimer();
			}
			return this;
		};
		
		this.once = function(time) {
			
			var timer = this;
			if (isNaN(time)) time = 0;
			window.setTimeout(function() {timer.action();}, time);
			return this;
		};
		
		this.play = function(reset) {
			
			if (!this.isActive) {
				if (reset) this.setTimer();
				else this.setTimer(this.remaining);
				this.isActive = true;
			}
			return this;
		};
		
		this.pause = function() {
			
			if (this.isActive) {
				this.isActive = false;
				this.remaining -= new Date() - this.last;
				this.clearTimer();
			}
			return this;
		};
		
		this.stop = function() {
			
			this.isActive = false;
			this.remaining = this.intervalTime;
			this.clearTimer();
			return this;
		};
		
		this.toggle = function(reset) {
			
			if (this.isActive) this.pause();
			else if (reset) this.play(true);
			else this.play();
			return this;
		};
		
		this.reset = function() {
			
			this.isActive = false;
			this.play(true);
			return this;
		};
		
		this.id = function() {
			return this.timeoutObject;
		};
			
		this.clearTimer = function() { // private
			window.clearTimeout(this.timeoutObject);
		};
		
		this.setTimer = function(time) {
			
			var timer = this;
			if (typeof this.action != 'function') return;
			if (isNaN(time)) time = this.intervalTime;
			this.remaining = time;
			this.last = new Date();
			this.clearTimer();
			this.timeoutObject = window.setTimeout
				(function() { timer.go(); }, time);
		};
		
		this.go = function() {
			if (this.isActive) {
				this.action();
				this.setTimer();
			}
		};
		
		if (this.init) {
			return new Timer(func, time, autostart);
		} else {
			this.set(func, time, autostart);
			return this;
		}
	};
		
	// ////////////////////////////////////////////////////////////
	// TextNode
	// ////////////////////////////////////////////////////////////
	
	/**
	 * @name TextNode
	 * @class
	 * @private
	 */
	var TextNode = makeClass();
	
	//TextNode.ignoreCase = true;
	
	TextNode.prototype = {

		init : function(parent, token) {
			
			this.count = 0;
			this.children = {};
			this.parent = parent;
			this.token = token;
		},
		
		pathFromRoot : function(result) {       
		    var mn = this;
		    while (true) {
		      if (mn.isRoot()) break;
		      result.push(mn.token);      
		      mn = mn.parent;          
		    }   
		},
				
		selectChild : function(regex, probabalisticSelect) {
			
			var ps = probabalisticSelect || true;
			return this.children ? this._select(this.childNodes(regex), ps) : null;
		},
		
		_select : function (arr, probabalisticSelect) {
			
			if (!arr) throw TypeError("bad arg to '_select()'");
			
			probabalisticSelect = probabalisticSelect || false;
			
			return (probabalisticSelect ? this._probabalisticSelect(arr) 
				: arr[Math.floor((Math.random()*arr.length))]);    
		},
		
		_probabalisticSelect : function(arr)  {    
			
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
			err("Invalid State in RiTa.probabalisticSelect()");   
		},

		addChild : function(newToken, initialCount) {

		  initialCount = initialCount || 1;

		  var key = this._key(newToken), node = this.children[key];

		  //  add first instance of this token 
		  if (!node) {
			node = new TextNode(this, newToken);
			node.count = initialCount;
			this.children[key] = node;   
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
			
			return undef(this.parent);
		},
		
		isLeaf : function() {
			
			return this.childCount() == 0;
		},
		
		probability : function() {
			
			//log('probability: '+ this.count+'/'+this.siblingCount());
			return this.count/this.siblingCount();
		},
		

		childNodes : function(regex) {
			
			if (!this.children) return EA;
			
			regex = is(regex,S) ? new RegExp(regex) : regex;
			
			var res = [];
			for (var k in this.children)  {
				var nd = this.children[k];
				if (!regex || (nd && nd.token && nd.token.search(regex)>-1)) {
					res.push(nd);
				}
			}
			
			return res;
		},        
		
		/**
		 * Returns the number of siblings for this node 
		 */
		siblingCount : function() {
			
		  if (this.isRoot()) err("Illegal siblingCount on ROOT!");
		  
		  if (!this.parent) err("Null parent for: "+this.token);
		  
		  return this.parent.childCount();
		},
		
		/**
		 * Returns the number of unique children 
		 */
		uniqueCount : function() {
		
			var sum = 0;
			for (var k in this.children) sum++;
			return sum;
		},
		
		 /**
		 * Returns the number of children for this node 
		 */
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
		
		/*
		 * takes node or string, returns node
		 */
		lookup : function(obj) {   
			
		  if (!obj) return null;
		  
		  obj = (typeof obj != S && obj.token) ? obj.token : obj;
		  
		  var key = this._key(obj);
		  
		  //log(this.token+".lookup("+this._key(obj)+") :: "+this.children[key]);
		  
		  return obj ? this.children[key] : null; 
		},
		
	
		_key : function(str) {

			return str;//(str && TextNode.ignoreCase) ? str.toLowerCase() : str;
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
			  err("ILLEGAL FREQ: "+node.count+" -> "+mn.token+","+node.token);
			
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
		} 
	}

	// ////////////////////////////////////////////////////////////
	// Conjugator
	// ////////////////////////////////////////////////////////////
	

	/**
	 * @name Conjugator
	 * @class
	 * @private
	 */
	var Conjugator = makeClass();
	
	Conjugator.prototype = {

		init : function() {
			
			// TODO: get rid of these and make static method ?
			
			this.perfect = this.progressive = this.passive = this.interrogative = false;
			this.tense = RiTa.PRESENT_TENSE;
			this.person = RiTa.FIRST_PERSON;
			this.number = RiTa.SINGULAR;
			this.form = RiTa.NORMAL;
			this.head = "";

		},

		// Conjugates the verb based on the current state of the conjugator.
		// !@# Removed (did not translate) incomplete/non-working java
		// implementation of modals handling.
		// !@# TODO: add handling of past tense modals.
		conjugate : function(verb, args) {

			var s = E, actualModal = null, conjs = [], frontVG = verb, verbForm;
			
			if (!verb || !verb.length) return E;
			
			if (!args) return verb;

			// ------------------ handle arguments ------------------
			
			args.number && (this.number = args.number);
			args.person && (this.person = args.person);
			args.tense && (this.tense = args.tense);
			args.form && (this.form = args.form);
			args.passive && (this.passive = args.passive);
			args.progressive && (this.progressive = args.progressive);
			args.interrogative && (this.interrogative = args.interrogative);
			args.perfect && (this.perfect = args.perfect);
			
			// ----------------------- start ---------------------------
			if (this.form == RiTa.INFINITIVE) {
				actualModal = "to";
			}

			if (this.tense == RiTa.FUTURE_TENSE) {
				actualModal = "will";
			}

			if (this.passive) {
				conjs.push(this.getPastParticiple(frontVG));
				frontVG = "be"; 
			}

			if (this.progressive) {
				conjs.push(this.getPresentParticiple(frontVG));
				frontVG = "be"; 
			}

			if (this.perfect) {
				conjs.push(this.getPastParticiple(frontVG));
				frontVG = "have";
			}

			if (actualModal) {
				// log("push: "+frontVG);
				conjs.push(frontVG);
				frontVG = null;
			}

			// Now inflect frontVG (if it exists) and push it on restVG
			if (frontVG) {

				if (this.form === RiTa.GERUND) { // gerund - use ING form
					
					var pp = this.getPresentParticiple(frontVG);

					// !@# not yet implemented! ??? WHAT?
					conjs.push(pp);
					
				}
				else if (this.interrogative && !(verb == "be") && conjs.length < 1) {

					conjs.push(frontVG);
					
				}
				else {

					verbForm = this.getVerbForm(frontVG, this.tense, this.person, this.number);
					conjs.push(verbForm);
				}
			}

			// add modal, and we're done
			actualModal && conjs.push(actualModal);

			var s = E;
			for ( var i = 0; i < conjs.length; i++) {
				
				s = conjs[i] + " " + s;
			}

			// !@# test this
			endsWith(s, "peted") && err("Unexpected output: " + this.toString());

			return trim(s);
		},

		checkRules : function(ruleSet, verb) {

			var res, name = ruleSet.name, rules = ruleSet.rules, defRule = ruleSet.defaultRule || null;

			//TODO: remove comments            
			//log(ruleSet.name+' -> '+ruleSet.doubling);
			
			if (!rules) err("no rule: "+ruleSet.name+' of '+verb);
			
			if (inArray(MODALS, verb)) return verb;

			for ( var i = 0; i < rules.length; i++) {

				//log("checkRules2("+name+").fire("+i+")="+rules[i].regex);
				if (rules[i].applies(verb)) {

					var got = rules[i].fire(verb);

				//log("HIT("+name+").fire("+i+")="+rules[i].regex+"_returns: "+got);
					return got;
				}
			}
			//log("NO HIT!");

			if (ruleSet.doubling && inArray(VERB_CONS_DOUBLING, verb)) {

			//log("doDoubling!");
				verb = this.doubleFinalConsonant(verb);
			}

			res = defRule.fire(verb);

			//log("checkRules("+name+").returns: "+res);
			
			return res;
		},

		doubleFinalConsonant : function(word) {
			var letter = word.charAt(word.length - 1);
			return word + letter;
		},

		getPast : function(verb, pers, numb) {

			if (verb.toLowerCase() == "be") {

				switch (numb) {

				case RiTa.SINGULAR:

					switch (pers) {

					case RiTa.FIRST_PERSON:
						break;

					case RiTa.THIRD_PERSON:
						return "was";

					case RiTa.SECOND_PERSON:
						return "were";

					}
					break;

				case RiTa.PLURAL:

					return "were";
				}
			}

			var got = this.checkRules(PAST_TENSE_RULESET, verb);

			//log("getPast(" + verb + ").returns: " + got);

			return got;
		},

		getPresent : function(verb, person, number) {

			person = person || this.person;
			number = number || this.number;

			if ((person == RiTa.THIRD_PERSON) && (number == RiTa.SINGULAR)) {

				return this.checkRules(PRESENT_TENSE_RULESET, verb);
			} 
			else if (verb == "be") {

				if (number == RiTa.SINGULAR) {

					switch (person) {

					case RiTa.FIRST_PERSON:
						return "am";

					case RiTa.SECOND_PERSON:
						return "are";

					case RiTa.THIRD_PERSON:
						return "is";

						// default: ???
					}

				} else {
					return "are";
				}
			}
			return verb;
		},

		getPresentParticiple : function(verb) {
			
			return strOk(verb) ? this.checkRules(PRESENT_PARTICIPLE_RULESET, verb) : E;
		},

		getPastParticiple : function(verb) {
			
			var res = strOk(verb) ? this.checkRules(PAST_PARTICIPLE_RULESET, verb) : E;
	//            log("getPastParticiple("+verb+") -> "+res);
			return res;
		},

		getVerbForm : function(verb, tense, person, number) {

			switch (tense) {

			case RiTa.PRESENT_TENSE:
				return this.getPresent(verb, person, number);

			case RiTa.PAST_TENSE:
				return this.getPast(verb, person, number);

			default:
				return verb;
			}
		},

		// Returns a String representing the current person from one of
		// (first, second, third)
		getPerson : function() {
			return CONJUGATION_NAMES[this.person];
		},

		// Returns a String representing the current number from one of
		// (singular, plural)
		getNumber : function() {
			return CONJUGATION_NAMES[this.number];
		},

		// Returns a String representing the current tense from one of
		// (past, present, future)
		getTense : function() {
			return CONJUGATION_NAMES[this.tense];
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
		// constants: [RiTa.FIRST_PERSON, RiTa.SECOND_PERSON, RiTa.THIRD_PERSON]
		setPerson : function(personConstant) {
			this.person = personConstant;
		},

		// Sets the number for the conjugation, from one of the
		// constants: [RiTa.SINGULAR, RiTa.PLURAL]
		setNumber : function(numberConstant) {
			this.number = numberConstant;
		},

		// Sets the tense for the conjugation, from one of the
		// constants: [RiTa.PAST_TENSE, RiTa.PRESENT_TENSE, RiTa.FUTURE_TENSE]
		setTense : function(tenseConstant) {
			this.tense = tenseConstant;
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
			return "  ---------------------\n" + "  Passive = " + this.isPassive() + "\n"
					+ "  Perfect = " + this.isPerfect() + "\n" + "  Progressive = "
					+ this.isProgressive() + "\n" + "  ---------------------\n" + "  Number = "
					+ this.getNumber() + "\n" + "  Person = " + this.getPerson() + "\n"
					+ "  Tense = " + this.getTense() + "\n" + "  ---------------------\n";
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
			// log("all="+results.length);
			return results;
		}
	}

	// ////////////////////////////////////////////////////////////
	// PosTagger  (singleton)
	// ////////////////////////////////////////////////////////////
	var PosTagger = {

		// Penn Pos types ------------------------------ (40+UKNOWN)

		UNKNOWN : [ '???', 'UNKNOWN' ],
		N : [ 'N', 'NOUN_KEY' ],
		V : [ 'V', 'VERB_KEY' ],
		R : [ 'R', 'ADVERB_KEY' ],
		A : [ 'A', 'ADJECTIVE_KEY' ],
		CC : [ 'CC', 'Coordinating conjunction' ],
		CD : [ 'CD', 'Cardinal number' ],
		DT : [ 'DT', 'Determiner' ],
		EX : [ 'EX', 'Existential there' ],
		FW : [ 'FW', 'Foreign word' ],
		IN : [ 'IN', 'Preposition or subordinating conjunction' ],
		JJ : [ 'JJ', 'Adjective' ],
		JJR : [ 'JJR', 'Adjective, comparative' ],
		JJS : [ 'JJS', 'Adjective, superlative' ],
		LS : [ 'LS', 'List item marker' ],
		MD : [ 'MD', 'Modal' ],
		NN : [ 'NN', 'Noun, singular or mass' ],
		NNS : [ 'NNS', 'Noun, plural' ],
		NNP : [ 'NNP', 'Proper noun, singular' ],
		NNPS : [ 'NNPS', 'Proper noun, plural' ],
		PDT : [ 'PDT', 'Predeterminer' ],
		POS : [ 'POS', 'Possessive ending' ],
		PRP : [ 'PRP', 'Personal pronoun' ],
		PRP$ : [ 'PRP$', 'Possessive pronoun (prolog version PRP-S)' ],
		RB : [ 'RB', 'Adverb' ],
		RBR : [ 'RBR', 'Adverb, comparative' ],
		RBS : [ 'RBS', 'Adverb, superlative' ],
		RP : [ 'RP', 'Particle' ],
		SYM : [ 'SYM', 'Symbol' ],
		TO : [ 'TO', 'to' ],
		UH : [ 'UH', 'Interjection' ],
		VB : [ 'VB', 'Verb, base form' ],
		VBD : [ 'VBD', 'Verb, past tense' ],
		VBG : [ 'VBG', 'Verb, gerund or present participle' ],
		VBN : [ 'VBN', 'Verb, past participle' ],
		VBP : [ 'VBP', 'Verb, non-3rd person singular present' ],
		VBZ : [ 'VBZ', 'Verb, 3rd person singular present' ],
		WDT : [ 'WDT', 'Wh-determiner' ],
		WP : [ 'WP', 'Wh-pronoun' ],
		WP$ : [ 'WP$', 'Possessive wh-pronoun (prolog version WP-S)' ],
		WRB : [ 'WRB', 'Wh-adverb' ],

		TAGS : [ 'CC', 'CD', 'DT', 'EX', 'FW', 'IN', 'JJ', 
				'JJR', 'JJS', 'LS', 'MD', 'NN', 'NNS', 'NNP', 
				'NNPS', 'PDT', 'POS', 'PRP', 'PRP$', 'RB', 
				'RBR', 'RBS', 'RP', 'SYM', 'TO', 
				 'UH', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'WDT', 
				 'WP', 'WP$', 'WRB', 'UNKNOWN' ],

		NOUNS : [ 'NN', 'NNS', 'NNP', 'NNPS' ],
		VERBS : [ 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ' ],
		ADJ : [ 'JJ', 'JJR', 'JJS' ],
		ADV : [ 'RB', 'RBR', 'RBS', 'RP' ],

   
		isVerb : function(tag) {
			
			return inArray(this.VERBS, tag.toUpperCase());
		},

		isNoun : function(tag) {
			
			return inArray(this.NOUNS, tag.toUpperCase());
		},

		isAdverb : function(tag) {
			//log('tag='+tag+' count='+this.TAGS.length);
			return inArray(this.ADV, tag.toUpperCase());
		},

		isAdj : function(tag) {
			return inArray(this.ADJ, tag.toUpperCase());
		},

		isTag : function(tag) {
			return inArray(this.TAGS, tag);
		},

		hasTag : function(choices, tag) {
			ok(choices,A);
			var choiceStr = choices.join();
			return (choiceStr.indexOf(tag) > -1);
		},
		
		/**
		 * Returns an array of parts-of-speech from the Penn tagset, 
		 * each corresponding to one word of input
		 */
		tag : function(words) {
			
			var result = [], choices2d = [], lex = RiLexicon();//._getInstance(); 
			
			words = is(words,A) ?  words : [ words ];
			
			for (var i = 0, l = words.length; i < l; i++) {
	 
				if (!strOk(words[i])) {
					choices2d[i] = [];
					continue;
				}
				
				var data = lex._getPosArr(words[i]);

				if (undef(data) || data.length == 0) {
					
					if (words[i].length == 1) {
						
						result.push(isNum(words[i].charAt(0)) ? "cd" : words[i]);
					} 
					else {
						
						result.push("nn");
					}
					choices2d[i] = [];  // TODO: OK?
				} 
				else {
					result.push(data[0]);
					choices2d[i] = data;
				}
			}

					// Adjust pos according to transformation rules
			return this._applyContext(words, result, choices2d);	
		},

		
		// Applies a customized subset of the Brill transformations
		_applyContext : function(words, result, choices) {
			
			//log("_applyContext("+words+","+result+","+choices+")");

			// Shortcuts for brevity/readability
			var sW = startsWith, eW = endsWith, PRINT_CUSTOM_TAGS = (0 && !RiTa.SILENT);

			// Apply transformations
			for (var i = 0, l = words.length; i < l; i++) {

				// transform 1: DT, {VBD | VBP | VB} --> DT, NN
				if (i > 0 && (result[i - 1] == "dt")) {
					if (sW(result[i], "vb")) {
						if (PRINT_CUSTOM_TAGS) {
							log("PosTagger: changing verb to noun: " + words[i]);
						}
						result[i] = "nn";
					}

					// transform 1: DT, {RB | RBR | RBS} --> DT, {JJ |
					// JJR | JJS}
					else if (sW(result[i], "rb")) {
						if (PRINT_CUSTOM_TAGS) 
							log("PosTagger: custom tagged '"+words[i]+"', "+ result[i]);
						result[i] = (result[i].length > 2) ? "jj" + result[i].charAt(2) : "jj";
						if (PRINT_CUSTOM_TAGS) {
							log(" -> " + result[i]);
						}
					}
				}

				// transform 2: convert a noun to a number (cd) if it is
				// all digits and/or a decimal "."
				if (sW(result[i], "n") && choices[i] == null) {
					if (isNum(words[i])) {
						result[i] = "cd";
					} // mods: dch (add choice check above) <---- ? >
				}

				// transform 3: convert a noun to a past participle if
				// words[i] ends with "ed"
				if (sW(result[i], "n") && eW(words[i], "ed")) {
					result[i] = "vbn";
				}

				// transform 4: convert any type to adverb if it ends in "ly";
				if (eW(words[i], "ly")) {
					result[i] = "rb";
				}

				// transform 5: convert a common noun (NN or NNS) to a
				// adjective if it ends with "al", special-case for mammal
				if (sW(result[i], "nn") && eW(words[i], "al") && words[i] != 'mammal') {
					result[i] = "jj";
				}

				// transform 6: convert a noun to a verb if the
				// preceeding word is "would"
				if (i > 0 && sW(result[i], "nn") && equalsIgnoreCase(words[i - 1], "would")) {
					result[i] = "vb";
				}

				// transform 7: if a word has been categorized as a
				// common noun and it ends with "s", then set its type to plural common noun (NNS)
				if ((result[i] == "nn") && words[i].match(/^.*[^s]s$/)) {
					if (!NULL_PLURALS.applies(words[i])) 
						result[i] = "nns";
				}

				// transform 8: convert a common noun to a present
				// participle verb (i.e., a gerund)
				if (sW(result[i], "nn") && eW(words[i], "ing")) {
					// DH: fixed here -- add check on choices for any verb: eg. // 'morning'
					if (this.hasTag(choices[i], "vb")) {
						result[i] = "vbg";
					} else if (PRINT_CUSTOM_TAGS) {
						log("[RiTa] PosTagger tagged '" + words[i] + "' as " + result[i]);
					}
				}
				
				// transform 9(dch): convert plural nouns (which are also 3sg-verbs) to 
      			// 3sg-verbs when following a singular noun (the dog dances, Dave dances, he dances) 
				if (i>0 && result[i] == "nns" && this.hasTag(choices[i], "vbz") && result[i-1].match(/^(nn|prp|nnp)$/)) {
					result[i] = "vbz";
				}

				// transform 10(dch): convert common nouns to proper
				// nouns when they start w' a capital and (?are not a
				// sentence start?)
				if (/*i > 0 && */sW(result[i], "nn") && (words[i].charAt(0) == words[i].charAt(0).toUpperCase())) 
				{
					result[i] = eW(result[i], "s") ? "nnps" : "nnp";
				}

				// DISABLED: transform 10(dch): convert plural nouns (which are
				// also 3sg-verbs) to 3sg-verbs when followed by adverb
				/*if (i < result.length - 1 && result[i] == "nns" && sW(result[i + 1], "rb")
						&& this.hasTag(choices[i], "vbz")) {
					result[i] = "vbz";
				}*/
			}
		 
			return result;
		}

	}// end PosTagger

	/**
	 * @name Stemmer
	 * @class
	 * @private
	 */
	var Stemmer = {};
	
	// Stemming demo/comparison - http://text-processing.com/demo/stem/
	
	/**  
	 *  Porter stemmer in Javascript: from https://github.com/kristopolous/Porter-Stemmer
	 *  Ported from Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
	 *  no. 3, pp 130-137, see also http:www.tartarus.org/~martin/PorterStemmer
	 */
	Stemmer.stem_Porter = (function() {
		
		var step2list = {
				"ational" : "ate",
				"tional" : "tion",
				"enci" : "ence",
				"anci" : "ance",
				"izer" : "ize",
				"bli" : "ble",
				"alli" : "al",
				"entli" : "ent",
				"eli" : "e",
				"ousli" : "ous",
				"ization" : "ize",
				"ation" : "ate",
				"ator" : "ate",
				"alism" : "al",
				"iveness" : "ive",
				"fulness" : "ful",
				"ousness" : "ous",
				"aliti" : "al",
				"iviti" : "ive",
				"biliti" : "ble",
				"logi" : "log"
			},
	
			step3list = {
				"icate" : "ic",
				"ative" : "",
				"alize" : "al",
				"iciti" : "ic",
				"ical" : "ic",
				"ful" : "",
				"ness" : ""
			},
	
			c = "[^aeiou]",          // consonant
			v = "[aeiouy]",          // vowel
			C = c + "[^aeiouy]*",    // consonant sequence
			V = v + "[aeiou]*",      // vowel sequence
	
			mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
			meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
			mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
			s_v = "^(" + C + ")?" + v;                   // vowel in stem
	
		return function (w) {
			var     stem,
				suffix,
				firstch,
				re,
				re2,
				re3,
				re4,
				origword = w;
	
			if (w.length < 3) { return w; }
	
			firstch = w.substr(0,1);
			if (firstch == "y") {
				w = firstch.toUpperCase() + w.substr(1);
			}
	
			// Step 1a
			re = /^(.+?)(ss|i)es$/;
			re2 = /^(.+?)([^s])s$/;
	
			if (re.test(w)) { w = w.replace(re,"$1$2"); }
			else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }
	
			// Step 1b
			re = /^(.+?)eed$/;
			re2 = /^(.+?)(ed|ing)$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				re = new RegExp(mgr0);
				if (re.test(fp[1])) {
					re = /.$/;
					w = w.replace(re,"");
				}
			} else if (re2.test(w)) {
				var fp = re2.exec(w);
				stem = fp[1];
				re2 = new RegExp(s_v);
				if (re2.test(stem)) {
					w = stem;
					re2 = /(at|bl|iz)$/;
					re3 = new RegExp("([^aeiouylsz])\\1$");
					re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
					if (re2.test(w)) { w = w + "e"; }
					else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
					else if (re4.test(w)) { w = w + "e"; }
				}
			}
	
			// Step 1c
			re = /^(.+?)y$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				stem = fp[1];
				re = new RegExp(s_v);
				if (re.test(stem)) { w = stem + "i"; }
			}
	
			// Step 2
			re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				stem = fp[1];
				suffix = fp[2];
				re = new RegExp(mgr0);
				if (re.test(stem)) {
					w = stem + step2list[suffix];
				}
			}
	
			// Step 3
			re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				stem = fp[1];
				suffix = fp[2];
				re = new RegExp(mgr0);
				if (re.test(stem)) {
					w = stem + step3list[suffix];
				}
			}
	
			// Step 4
			re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
			re2 = /^(.+?)(s|t)(ion)$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				stem = fp[1];
				re = new RegExp(mgr1);
				if (re.test(stem)) {
					w = stem;
				}
			} else if (re2.test(w)) {
				var fp = re2.exec(w);
				stem = fp[1] + fp[2];
				re2 = new RegExp(mgr1);
				if (re2.test(stem)) {
					w = stem;
				}
			}
	
			// Step 5
			re = /^(.+?)e$/;
			if (re.test(w)) {
				var fp = re.exec(w);
				stem = fp[1];
				re = new RegExp(mgr1);
				re2 = new RegExp(meq1);
				re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
				if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
					w = stem;
				}
			}
	
			re = /ll$/;
			re2 = new RegExp(mgr1);
			if (re.test(w) && re2.test(w)) {
				re = /.$/;
				w = w.replace(re,"");
			}
	
			// and turn initial Y back to y
	
			if (firstch == "y") {
				w = firstch.toLowerCase() + w.substr(1);
			}
	
			return w;
		}
	})();

	Stemmer.stem_Lancaster = (function() {
		
		function accept(token) {
			
			return (token.match(/^[aeiou]/)) ?
				(token.length > 1) : (token.length > 2 && token.match(/[aeiouy]/));
		}
		
		// take a token, look up the applicable rule and do the stem
		function applyRules(token, intact) {

			var section = token.substr(-1), rules = ruleTable[section], input = token;
	
			if (rules) {
				
				for (var i = 0; i < rules.length; i++) {
					
				 // only apply intact rules to intact tokens
					if ((intact || !rules[i].intact) && token.substr(0 - rules[i].pattern.length) == rules[i].pattern) {
						
						// hack off only as much as the rule indicates
						var result = token.substr(0, token.length - rules[i].size);
	
						// if the rules wants us to apply an appendage do so
						if (rules[i].appendage) {
							result += rules[i].appendage;
						}
	
						if (accept(result)) {
							
							token = result;
	
							// see what the rules wants to do next
							if (rules[i].continuation) {
								
								// this rule thinks there still might be stem left. keep at it.
								// since we've applied a change we'll pass false in for intact
								return applyRules(result, false);
								
							} else {
								
								// the rule thinks we're done stemming. drop out.
								return result;
							}
						}
					}
				}
			}
			// else // warn('No stemming rules (LancasterImpl) found for: '+input);
	
			return token;
		}
	
		var ruleTable = { // indexed by last character of word
			
			"a": [
				{
					"continuation": false, 
					"intact": true, 
					"pattern": "ia", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": true, 
					"pattern": "a", 
					"size": "1"
				}
			], 
			"b": [
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "bb", 
					"size": "1"
				}
			], 
			"c": [
				{
					"appendage": "s", 
					"continuation": false, 
					"intact": false, 
					"pattern": "ytic", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ic", 
					"size": "2"
			   }, 
				{
					"appendage": "t", 
					"continuation": true, 
					"intact": false, 
					"pattern": "nc", 
					"size": "1"
				}
			], 
			"d": [
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "dd", 
					"size": "1"
				}, 
				{
					"appendage": "y", 
					"continuation": true, 
					"intact": false, 
					"pattern": "ied", 
					"size": "3"
				}, 
				{
					"appendage": "s", 
					"continuation": false, 
					"intact": false, 
					"pattern": "ceed", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "eed", 
					"size": "1"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ed", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "hood", 
					"size": "4"
				}
			], 
			"e": [
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "e", 
					"size": "1"
				}
			], 
			"f": [
				{
					"appendage": "v", 
					"continuation": false, 
					"intact": false, 
					"pattern": "lief", 
					"size": "1"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "if", 
					"size": "2"
				}
			], 
			"g": [
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ing", 
					"size": "3"
				}, 
				{
					"appendage": "y", 
					"continuation": false, 
					"intact": false, 
					"pattern": "iag", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ag", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "gg", 
					"size": "1"
				}
			], 
			"h": [
				{
					"continuation": false, 
					"intact": true, 
					"pattern": "th", 
					"size": "2"
				}, 
				{
					"appendage": "c", 
					"continuation": false, 
					"intact": false, 
					"pattern": "guish", 
					"size": "5"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ish", 
					"size": "3"
				}
			], 
			"i": [
				{
					"continuation": false, 
					"intact": true, 
					"pattern": "i", 
					"size": "1"
				}, 
				{
					"appendage": "y", 
					"continuation": true, 
					"intact": false, 
					"pattern": "i", 
					"size": "1"
				}
			], 
			"j": [
				{
					"appendage": "d", 
					"continuation": false, 
					"intact": false, 
					"pattern": "ij", 
					"size": "1"
				}, 
				{
					"appendage": "s", 
					"continuation": false, 
					"intact": false, 
					"pattern": "fuj", 
					"size": "1"
				}, 
				{
					"appendage": "d", 
					"continuation": false, 
					"intact": false, 
					"pattern": "uj", 
					"size": "1"
				}, 
				{
					"appendage": "d", 
					"continuation": false, 
					"intact": false, 
					"pattern": "oj", 
					"size": "1"
				}, 
				{
					"appendage": "r", 
					"continuation": false, 
					"intact": false, 
					"pattern": "hej", 
					"size": "1"
				}, 
				{
					"appendage": "t", 
					"continuation": false, 
					"intact": false, 
					"pattern": "verj", 
					"size": "1"
				}, 
				{
					"appendage": "t", 
					"continuation": false, 
					"intact": false, 
					"pattern": "misj", 
					"size": "2"
				}, 
				{
					"appendage": "d", 
					"continuation": false, 
					"intact": false, 
					"pattern": "nj", 
					"size": "1"
				}, 
				{
					"appendage": "s", 
					"continuation": false, 
					"intact": false, 
					"pattern": "j", 
					"size": "1"
				}
			], 
			"l": [
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ifiabl", 
					"size": "6"
				}, 
				{
					"appendage": "y", 
					"continuation": false, 
					"intact": false, 
					"pattern": "iabl", 
					"size": "4"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "abl", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ibl", 
					"size": "3"
				}, 
				{
					"appendage": "l", 
					"continuation": true, 
					"intact": false, 
					"pattern": "bil", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "cl", 
					"size": "1"
				}, 
				{
					"appendage": "y", 
					"continuation": false, 
					"intact": false, 
					"pattern": "iful", 
					"size": "4"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ful", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ul", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ial", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ual", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "al", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ll", 
					"size": "1"
				}
			], 
			"m": [
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ium", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": true, 
					"pattern": "um", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ism", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "mm", 
					"size": "1"
				}
			], 
			"n": [
				{
					"appendage": "j", 
					"continuation": true, 
					"intact": false, 
					"pattern": "sion", 
					"size": "4"
				}, 
				{
					"appendage": "c", 
					"continuation": false, 
					"intact": false, 
					"pattern": "xion", 
					"size": "4"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ion", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ian", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "an", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "een", 
					"size": "0"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "en", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "nn", 
					"size": "1"
				}
			], 
			"p": [
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ship", 
					"size": "4"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "pp", 
					"size": "1"
				}
			], 
			"r": [
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "er", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ear", 
					"size": "0"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ar", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "or", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ur", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "rr", 
					"size": "1"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "tr", 
					"size": "1"
				}, 
				{
					"appendage": "y", 
					"continuation": true, 
					"intact": false, 
					"pattern": "ier", 
					"size": "3"
				}
			], 
			"s": [
				{
					"appendage": "y", 
					"continuation": true, 
					"intact": false, 
					"pattern": "ies", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "sis", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "is", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ness", 
					"size": "4"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ss", 
					"size": "0"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ous", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": true, 
					"pattern": "us", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": true, 
					"pattern": "s", 
					"size": "1"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "s", 
					"size": "0"
				}
			], 
			"t": [
				{
					"appendage": "y", 
					"continuation": false, 
					"intact": false, 
					"pattern": "plicat", 
					"size": "4"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "at", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ment", 
					"size": "4"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ent", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ant", 
					"size": "3"
				}, 
				{
					"appendage": "b", 
					"continuation": false, 
					"intact": false, 
					"pattern": "ript", 
					"size": "2"
				}, 
				{
					"appendage": "b", 
					"continuation": false, 
					"intact": false, 
					"pattern": "orpt", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "duct", 
					"size": "1"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "sumpt", 
					"size": "2"
				}, 
				{
					"appendage": "i", 
					"continuation": false, 
					"intact": false, 
					"pattern": "cept", 
					"size": "2"
				}, 
				{
					"appendage": "v", 
					"continuation": false, 
					"intact": false, 
					"pattern": "olut", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "sist", 
					"size": "0"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ist", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "tt", 
					"size": "1"
				}
			], 
			"u": [
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "iqu", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ogu", 
					"size": "1"
				}
			], 
			"v": [
				{
					"appendage": "j", 
					"continuation": true, 
					"intact": false, 
					"pattern": "siv", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "eiv", 
					"size": "0"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "iv", 
					"size": "2"
				}
			], 
			"y": [
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "bly", 
					"size": "1"
				}, 
				{
					"appendage": "y", 
					"continuation": true, 
					"intact": false, 
					"pattern": "ily", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ply", 
					"size": "0"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ly", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ogy", 
					"size": "1"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "phy", 
					"size": "1"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "omy", 
					"size": "1"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "opy", 
					"size": "1"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ity", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ety", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "lty", 
					"size": "2"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "istry", 
					"size": "5"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ary", 
					"size": "3"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "ory", 
					"size": "3"
				}, 
				{
					"continuation": false, 
					"intact": false, 
					"pattern": "ify", 
					"size": "3"
				}, 
				{
					"appendage": "t", 
					"continuation": true, 
					"intact": false, 
					"pattern": "ncy", 
					"size": "2"
				}, 
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "acy", 
					"size": "3"
				}
			], 
			"z": [
				{
					"continuation": true, 
					"intact": false, 
					"pattern": "iz", 
					"size": "2"
				}, 
				{
					"appendage": "s", 
					"continuation": false, 
					"intact": false, 
					"pattern": "yz", 
					"size": "1"
				}
			]
		};
		
		return function(token) {
			
			return applyRules(token.toLowerCase(), true);
		}
		
	})();
	
	// TODO: remove these 
	
	Array.prototype._arrayContains = function (searchElement ) {
		return Array.prototype.indexOf(searchElement) > -1;
	} 
	String.prototype._endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

	/*
	 * From the PlingStemmer stemmer implementation included in the Java Tools package (see http://mpii.de/yago-naga/javatools).
	 */
	Stemmer.stem_Pling = (function() {
		
		/** Words that are both singular and plural */
		var categorySP = ["acoustics", "aestetics", "aquatics", "basics", "ceramics", "classics", "cosmetics", "dermatoglyphics", "dialectics", "deer", "dynamics", "esthetics", "ethics", "harmonics", "heroics", "isometrics", "mechanics", "metrics", "statistics", "optic", "people", "physics", "polemics", "propaedeutics", "pyrotechnics", "quadratics", "quarters", "statistics", "tactics", "tropics"];
	
		/** Words that end in "-se" in their plural forms (like "nurse" etc.) */
		var categorySE_SES = ["nurses", "cruises"];
	
		/** Words that do not have a distinct plural form (like "atlas" etc.) */
		var category00 = ["alias", "asbestos", "atlas", "barracks", "bathos", "bias", "breeches", "britches", "canvas", "chaos", "clippers", "contretemps", "corps", "cosmos", "crossroads", "diabetes", "ethos", "gallows", "gas", "graffiti", "headquarters", "herpes", "high-jinks", "innings", "jackanapes", "lens", "means", "measles", "mews", "mumps", "news", "pathos", "pincers", "pliers", "proceedings", "rabies", "rhinoceros", "sassafras", "scissors", "series", "shears", "species", "tuna"];
	
		/** Words that change from "-um" to "-a" (like "curriculum" etc.), listed in their plural forms */
		var categoryUM_A = ["addenda", "agenda", "aquaria", "bacteria", "candelabra", "compendia", "consortia", "crania", "curricula", "data", "desiderata", "dicta", "emporia", "enconia", "errata", "extrema", "gymnasia", "honoraria", "interregna", "lustra", "maxima", "media", "memoranda", "millenia", "minima", "momenta", "optima", "ova", "phyla", "quanta", "rostra", "spectra", "specula", "stadia", "strata", "symposia", "trapezia", "ultimata", "vacua", "vela"];
	
		/** Words that change from "-on" to "-a" (like "phenomenon" etc.), listed in their plural forms */
		var categoryON_A = ["aphelia", "asyndeta", "automata", "criteria", "hyperbata", "noumena", "organa", "perihelia", "phenomena", "prolegomena"];
	
		/** Words that change from "-o" to "-i" (like "libretto" etc.), listed in their plural forms */
		var categoryO_I = ["alti", "bassi", "canti", "contralti", "crescendi", "libretti", "soli", "soprani", "tempi", "virtuosi"];
	
		/**  Words that change from "-us" to "-i" (like "fungus" etc.), listed in their plural forms		 */
		var categoryUS_I = ["alumni", "bacilli", "cacti", "foci", "fungi", "genii", "hippopotami", "incubi", "nimbi", "nuclei", "nucleoli", "octopi", "radii", "stimuli", "styli", "succubi", "syllabi", "termini", "tori", "umbilici", "uteri"];
	
		/** Words that change from "-ix" to "-ices" (like "appendix" etc.), listed in their plural forms */
		var categoryIX_ICES = ["appendices", "cervices"];
	
		/** Words that change from "-is" to "-es" (like "axis" etc.), listed in their plural forms, plus everybody ending in theses */
		var categoryIS_ES = ["analyses", "axes", "bases", "crises", "diagnoses", "ellipses", "em_PHASEs", "neuroses", "oases", "paralyses", "synopses"];
	
		/** Words that change from "-oe" to "-oes" (like "toe" etc.), listed in their plural forms*/
		var categoryOE_OES = ["aloes", "backhoes", "beroes", "canoes", "chigoes", "cohoes", "does", "felloes", "floes", "foes", "gumshoes", "hammertoes", "hoes", "hoopoes", "horseshoes", "leucothoes", "mahoes", "mistletoes", "oboes", "overshoes", "pahoehoes", "pekoes", "roes", "shoes", "sloes", "snowshoes", "throes", "tic-tac-toes", "tick-tack-toes", "ticktacktoes", "tiptoes", "tit-tat-toes", "toes", "toetoes", "tuckahoes", "woes"];
	
		/** Words that change from "-ex" to "-ices" (like "index" etc.), listed in their plural forms*/
		var categoryEX_ICES = ["apices", "codices", "cortices", "indices", "latices", "murices", "pontifices", "silices", "simplices", "vertices", "vortices"];
	
		/** Words that change from "-u" to "-us" (like "emu" etc.), listed in their plural forms*/
		var categoryU_US = ["apercus", "barbus", "cornus", "ecrus", "emus", "fondus", "gnus", "iglus", "mus", "nandus", "napus", "poilus", "quipus", "snafus", "tabus", "tamandus", "tatus", "timucus", "tiramisus", "tofus", "tutus"];
	
		/** Words that change from "-sse" to "-sses" (like "finesse" etc.), listed in their plural forms,plus those ending in mousse*/
		var categorySSE_SSES = ["bouillabaisses", "coulisses", "crevasses", "crosses", "cuisses", "demitasses", "ecrevisses", "fesses", "finesses", "fosses", "impasses", "lacrosses", "largesses", "masses", "noblesses", "palliasses", "pelisses", "politesses", "posses", "tasses", "wrasses"];
	
		/** Words that change from "-che" to "-ches" (like "brioche" etc.), listed in their plural forms*/
		var categoryCHE_CHES = ["adrenarches", "attaches", "avalanches", "barouches", "brioches", "caches", "caleches", "caroches", "cartouches", "cliches", "cloches", "creches", "demarches", "douches", "gouaches", "guilloches", "headaches", "heartaches", "huaraches", "menarches", "microfiches", "moustaches", "mustaches", "niches", "panaches", "panoches", "pastiches", "penuches", "pinches", "postiches", "psyches", "quiches", "schottisches", "seiches", "soutaches", "synecdoches", "thelarches", "troches"];
	
		/** Words that end with "-ics" and do not exist as nouns without the 's' (like "aerobics" etc.)*/
		var categoryICS = ["aerobatics", "aerobics", "aerodynamics", "aeromechanics", "aeronautics", "alphanumerics", "animatronics", "apologetics", "architectonics", "astrodynamics", "astronautics", "astrophysics", "athletics", "atmospherics", "autogenics", "avionics", "ballistics", "bibliotics", "bioethics", "biometrics", "bionics", "bionomics", "biophysics", "biosystematics", "cacogenics", "calisthenics", "callisthenics", "catoptrics", "civics", "cladistics", "cryogenics", "cryonics", "cryptanalytics", "cybernetics", "cytoarchitectonics", "cytogenetics", "diagnostics", "dietetics", "dramatics", "dysgenics", "econometrics", "economics", "electromagnetics", "electronics", "electrostatics", "endodontics", "enterics", "ergonomics", "eugenics", "eurhythmics", "eurythmics", "exodontics", "fibreoptics", "futuristics", "genetics", "genomics", "geographics", "geophysics", "geopolitics", "geriatrics", "glyptics", "graphics", "gymnastics", "hermeneutics", "histrionics", "homiletics", "hydraulics", "hydrodynamics", "hydrokinetics", "hydroponics", "hydrostatics", "hygienics", "informatics", "kinematics", "kinesthetics", "kinetics", "lexicostatistics", "linguistics", "lithoglyptics", "liturgics", "logistics", "macrobiotics", "macroeconomics", "magnetics", "magnetohydrodynamics", "mathematics", "metamathematics", "metaphysics", "microeconomics", "microelectronics", "mnemonics", "morphophonemics", "neuroethics", "neurolinguistics", "nucleonics", "numismatics", "obstetrics", "onomastics", "orthodontics", "orthopaedics", "orthopedics", "orthoptics", "paediatrics", "patristics", "patristics", "pedagogics", "pediatrics", "periodontics", "pharmaceutics", "pharmacogenetics", "pharmacokinetics", "phonemics", "phonetics", "phonics", "photomechanics", "physiatrics", "pneumatics", "poetics", "politics", "pragmatics", "prosthetics", "prosthodontics", "proteomics", "proxemics", "psycholinguistics", "psychometrics", "psychonomics", "psychophysics", "psychotherapeutics", "robotics", "semantics", "semiotics", "semitropics", "sociolinguistics", "stemmatics", "strategics", "subtropics", "systematics", "tectonics", "telerobotics", "therapeutics", "thermionics", "thermodynamics", "thermostatics"];
	
		/** Words that change from "-ie" to "-ies" (like "auntie" etc.), listed in their plural forms*/
		var categoryIE_IES = ["aeries", "anomies", "aunties", "baddies", "beanies", "birdies", "boccies", "bogies", "bolshies", "bombies", "bonhomies", "bonxies", "booboisies", "boogies", "boogie-woogies", "bookies", "booties", "bosies", "bourgeoisies", "brasseries", "brassies", "brownies", "budgies", "byrnies", "caddies", "calories", "camaraderies", "capercaillies", "capercailzies", "cassies", "catties", "causeries", "charcuteries", "chinoiseries", "collies", "commies", "cookies", "coolies", "coonties", "cooties", "corries", "coteries", "cowpies", "cowries", "cozies", "crappies", "crossties", "curies", "dachsies", "darkies", "dassies", "dearies", "dickies", "dies", "dixies", "doggies", "dogies", "dominies", "dovekies", "eyries", "faeries", "falsies", "floozies", "folies", "foodies", "freebies", "gaucheries", "gendarmeries", "genies", "ghillies", "gillies", "goalies", "goonies", "grannies", "grotesqueries", "groupies", "hankies", "hippies", "hoagies", "honkies", "hymies", "indies", "junkies", "kelpies", "kilocalories", "knobkerries", "koppies", "kylies", "laddies", "lassies", "lies", "lingeries", "magpies", "magpies", "marqueteries", "mashies", "mealies", "meanies", "menageries", "millicuries", "mollies", "facts1", "moxies", "neckties", "newbies", "nighties", "nookies", "oldies", "organdies", "panties", "parqueteries", "passementeries", "patisseries", "pies", "pinkies", "pixies", "porkpies", "potpies", "prairies", "preemies", "premies", "punkies", "pyxies", "quickies", "ramies", "reveries", "rookies", "rotisseries", "scrapies", "sharpies", "smoothies", "softies", "stoolies", "stymies", "swaggies", "sweeties", "talkies", "techies", "ties", "tooshies", "toughies", "townies", "veggies", "walkie-talkies", "wedgies", "weenies", "weirdies", "yardies", "yuppies", "zombies"];
	
		/** Maps irregular Germanic English plural nouns to their singular form */
		var categoryIRR = ["beefs", "beef", "beeves", "beef", "brethren", "brother", "busses", "bus", "cattle", "cattlebeast", "children", "child", "corpora", "corpus", "ephemerides", "ephemeris", "firemen", "fireman", "genera", "genus", "genies", "genie", "genii", "genie", "kine", "cow", "lice", "louse", "men", "man", "mice", "mouse", "mongooses", "mongoose", "monies", "money", "mythoi", "mythos", "octopodes", "octopus", "octopuses", "octopus", "oxen", "ox", "people", "person", "soliloquies", "soliloquy", "throes", "throes", "trilbys", "trilby", "women", "woman"];
	
		/** Tells whether a noun is plural. */
		function isPlural(s) {
			return (!s === stem(s));
		}
	
		/** Tells whether a word form is singular. Note that a word can be both plural and singular */
		function isSingular(s) {
			return (categorySP._arrayContains(s.toLowerCase()) || !isPlural(s));
		}
	
		/**
		 * Tells whether a word form is the singular form of one word and at
		 * the same time the plural form of another.
		 */
		function isSingularAndPlural(s) {
			return (categorySP._arrayContains(s.toLowerCase()));
		}
	
		/** Cuts a suffix from a string (that is the number of chars given by the suffix) */
		function cut(s, suffix) {
			return (s.substring(0, s.length - suffix.length));
		}
	
		/** Returns true if a word is probably not Latin */
		function noLatin(s) {
			return (s.indexOf('h') > 0 || s.indexOf('j') > 0 || s.indexOf('k') > 0 || s.indexOf('w') > 0 || s.indexOf('y') > 0 || s.indexOf('z') > 0 || s.indexOf("ou") > 0 || s.indexOf("sh") > 0 || s.indexOf("ch") > 0 || s._endsWith("aus"));
		}
	
		/** Returns true if a word is probably Greek */
		function greek(s) {
			return (s.indexOf("ph") > 0 || s.indexOf('y') > 0 && s._endsWith("nges"));
		}
	
		/** Stems an english noun */
		function stem(s) {
			
			//log("PlingStem("+s+")");
			
			if (!strOk(s)) return E;
	
			// Handle irregular ones
			var irreg = categoryIRR[s];
			
			if (irreg) return (irreg);
	
			// -on to -a
			if (categoryON_A._arrayContains(s))
				return (cut(s, "a") + "on");
	
			// -um to -a
			if (categoryUM_A._arrayContains(s))
				return (cut(s, "a") + "um");
	
			// -x to -ices
			if (categoryIX_ICES._arrayContains(s))
				return (cut(s, "ices") + "ix");
	
			// -o to -i
			if (categoryO_I._arrayContains(s))
				return (cut(s, "i") + "o");
	
			// -se to ses
			if (categorySE_SES._arrayContains(s))
				return (cut(s, "s"));
	
			// -is to -es
			if (categoryIS_ES._arrayContains(s) || s._endsWith("theses"))
				return (cut(s, "es") + "is");
	
			// -us to -i
			if (categoryUS_I._arrayContains(s))
				return (cut(s, "i") + "us");
			//Wrong plural
			if (s._endsWith("uses") && (categoryUS_I._arrayContains(cut(s, "uses") + "i") || s === ("genuses") || s === ("corpuses")))
				return (cut(s, "es"));
	
			// -ex to -ices
			if (categoryEX_ICES._arrayContains(s))
				return (cut(s, "ices") + "ex");
	
			// Words that do not inflect in the plural
			if (s._endsWith("ois") || s._endsWith("itis") || category00._arrayContains(s) || categoryICS._arrayContains(s))
				return (s);
	
			// -en to -ina
			// No other common words end in -ina
			if (s._endsWith("ina"))
				return (cut(s, "en"));
	
			// -a to -ae
			// No other common words end in -ae
			if (s._endsWith("ae"))
				return (cut(s, "e"));
	
			// -a to -ata
			// No other common words end in -ata
			if (s._endsWith("ata"))
				return (cut(s, "ta"));
	
			// trix to -trices
			// No common word ends with -trice(s)
			if (s._endsWith("trices"))
				return (cut(s, "trices") + "trix");
	
			// -us to -us
			//No other common word ends in -us, except for false plurals of French words
			//Catch words that are not latin or known to end in -u
			if (s._endsWith("us") && !s._endsWith("eaus") && !s._endsWith("ieus") && !noLatin(s) && !categoryU_US._arrayContains(s))
				return (s);
	
			// -tooth to -teeth
			// -goose to -geese
			// -foot to -feet
			// -zoon to -zoa
			//No other common words end with the indicated suffixes
			if (s._endsWith("teeth"))
				return (cut(s, "teeth") + "tooth");
			if (s._endsWith("geese"))
				return (cut(s, "geese") + "goose");
			if (s._endsWith("feet"))
				return (cut(s, "feet") + "foot");
			if (s._endsWith("zoa"))
				return (cut(s, "zoa") + "zoon");
	
			// -eau to -eaux
			//No other common words end in eaux
			if (s._endsWith("eaux"))
				return (cut(s, "x"));
	
			// -ieu to -ieux
			//No other common words end in ieux
			if (s._endsWith("ieux"))
				return (cut(s, "x"));
	
			// -nx to -nges
			// Pay attention not to kill words ending in -nge with plural -nges
			// Take only Greek words (works fine, only a handfull of exceptions)
			if (s._endsWith("nges") && greek(s))
				return (cut(s, "nges") + "nx");
	
			// -[sc]h to -[sc]hes
			//No other common word ends with "shes", "ches" or "she(s)"
			//Quite a lot end with "che(s)", filter them out
			if (s._endsWith("shes") || s._endsWith("ches") && !categoryCHE_CHES._arrayContains(s))
				return (cut(s, "es"));
	
			// -ss to -sses
			// No other common singular word ends with "sses"
			// Filter out those ending in "sse(s)"
			if (s._endsWith("sses") && !categorySSE_SSES._arrayContains(s) && !s._endsWith("mousses"))
				return (cut(s, "es"));
	
			// -x to -xes
			// No other common word ends with "xe(s)" except for "axe"
			if (s._endsWith("xes") && !s === ("axes"))
				return (cut(s, "es"));
	
			// -[nlw]ife to -[nlw]ives
			//No other common word ends with "[nlw]ive(s)" except for olive
			if (s._endsWith("nives") || s._endsWith("lives") && !s._endsWith("olives") || s._endsWith("wives"))
				return (cut(s, "ves") + "fe");
	
			// -[aeo]lf to -ves  exceptions: valve, solve
			// -[^d]eaf to -ves  exceptions: heave, weave
			// -arf to -ves      no exception
			if (s._endsWith("alves") && !s._endsWith("valves") || s._endsWith("olves") && !s._endsWith("solves") || s._endsWith("eaves") && !s._endsWith("heaves") && !s._endsWith("weaves") || s._endsWith("arves"))
				return (cut(s, "ves") + "f");
	
			// -y to -ies
			// -ies is very uncommon as a singular suffix
			// but -ie is quite common, filter them out
			if (s._endsWith("ies") && !categoryIE_IES._arrayContains(s))
				return (cut(s, "ies") + "y");
	
			// -o to -oes
			// Some words end with -oe, so don't kill the "e"
			if (s._endsWith("oes") && !categoryOE_OES._arrayContains(s))
				return (cut(s, "es"));
	
			// -s to -ses
			// -z to -zes
			// no words end with "-ses" or "-zes" in singular
			if (s._endsWith("ses") || s._endsWith("zes"))
				return (cut(s, "es"));
	
			// - to -s
			if (s._endsWith("s") && !s._endsWith("ss") && !s._endsWith("is"))
				return (cut(s, "s"));
	
			return (s);
		}
	
		return function(token) {
	
			return stem(token.toLowerCase());
		}
		
	})();


	//////////////////////////////////////////////////////////////////
	//////// MinEditDist (singleton)
	////////////////////////////////////////////////////////////////

	/**
	 * Minimum-Edit-Distance (or Levenshtein distance) is a measure of the similarity 
	 * between two strings, the source string and the target string (t). The distance 
	 * is the number of deletions, insertions, or substitutions required to transform 
	 * the source into the target / avg_string_length<p> 
	 * 
	 * Adapted from Michael Gilleland's algorithm
	 * 
	 * @name MinEditDist
	 * @class
	 * @private
	 */
	var MinEditDist = {

		_min3 : function(a,b,c) { 

			var min = a;
			if (b < min) min = b;
			if (c < min) min = c;
			return min;
		},

		/**
		 * Computes min-edit-distance between 2 string arrays
		 * where each array element either matches or does not
		 */
		_computeRawArray : function(srcArr, trgArr) { // TODO: make private to class

			//log((srcArr)+" "+(trgArr));
			
			var matrix = []; // matrix
			var sI; // ith element of s
			var tJ; // jth element of t
			var cost; // cost

			// Step 1 ----------------------------------------------

			if (srcArr.length == 0) return trgArr.length;

			if (trgArr.length == 0) return srcArr.length;

			//matrix = new var[srcArr.length + 1][trgArr.length + 1];

			// Step 2 ----------------------------------------------

			for (var i = 0; i <= srcArr.length; i++) {
				matrix[i] = [];
				matrix[i][0] = i;
			}

			for (var j = 0; j <= trgArr.length; j++)    
				matrix[0][j] = j;

			// Step 3 ----------------------------------------------

			//String[] srcArr = RiFreeTTSEngine.cleanPhonemes(srcArr);    
			for (var i = 1; i <= srcArr.length; i++)
			{
				sI = srcArr[i - 1];

				// Step 4 --------------------------------------------

				for (var j = 1; j <= trgArr.length; j++)
				{
					tJ = trgArr[j - 1];

					// Step 5 ------------------------------------------

					cost = (sI === tJ) ? 0 : 1;

					// Step 6 ------------------------------------------
					matrix[i][j] = this._min3 (matrix[i - 1][j] + 1, 
						matrix[i][j - 1] + 1, 
						matrix[i - 1][j - 1] + cost);
				}
			}

			// Step 7 ----------------------------------------------

			return matrix[srcArr.length][trgArr.length];
		},

		
		/**
		 * Compute min-edit-distance between 2 strings
		 * @see MinEditDist#computeAdjusted(java.lang.String,java.lang.String)
		 */ 
		computeRaw : function(source, target) { 

			var st = Type.get(source), tt = Type.get(source);
			
			if (st!=tt) err('Unexpected args: '+source+"/"+target);

			if (tt===A) return this._computeRawArray(source, target);
			
			if (!source.length && !target.length) return 0;

			var matrix = []; // matrix
			var sI; // ith character of s
			var tJ; // jth character of t
			var cost; // cost

			// Step 1 ----------------------------------------------
			var sourceLength = source.length;
			var targetLength = target.length;

			if (sourceLength == 0) return targetLength;

			if (targetLength == 0) return sourceLength;

			//matrix = new int[sourceLength + 1][targetLength + 1];

			// Step 2 ----------------------------------------------

			for (var i = 0; i <= sourceLength; i++) {
				matrix[i] = [];
				matrix[i][0] = i;
			}

			for (var j = 0; j <= targetLength; j++)   
				matrix[0][j] = j;

			// Step 3 ----------------------------------------------

			for (var i = 1; i <= sourceLength; i++)
			{

				sI = source.charAt(i - 1);

				// Step 4 --------------------------------------------

				for (var j = 1; j <= targetLength; j++)
				{
					tJ = target.charAt(j - 1);

					// Step 5 ------------------------------------------

					cost = (sI == tJ) ? 0 : 1;

					// Step 6 ------------------------------------------
					matrix[i][j] = this._min3(matrix[i - 1][j] + 1, 
						matrix[i][j - 1] + 1, 
						matrix[i - 1][j - 1] + cost);
				}
			}

			// Step 7 ----------------------------------------------

			return matrix[sourceLength][targetLength];
			
		},

		/**
		 * Compute min-edit-distance between 2 strings (or 2 arrays of strings) 
		 * divided by their average length.
		 */ 
		computeAdjusted : function(source, target) {

			var st = Type.get(source), tt = Type.get(source);
			if (st===tt) {

				if (tt===S) {
					if (!source.length && !target.length) return 0;
					//log(this.computeRaw(source, target)+'/'+(source.length + target.length));
					return this.computeRaw(source, target) / (source.length + target.length);
				}
				else if (tt===A) {
					if (!source.length && !target.length) return 0;
					//log(_computeRawArray(source, target)+'/'+(source.length + target.length));
					return this._computeRawArray(source, target) / (source.length + target.length);
				}
			}
			err('Unexpected args: '+source+"/"+target);
			
		}
		
	}

	//////////////////////////////////////////////////////////////////
	//////// RE 
	////////////////////////////////////////////////////////////////

	/**
	* @name RE (RegEx)
	* @class
	* @private
	*/
	var RE = makeClass();

	RE.prototype = {
		
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
			
			return ((this.suffix != "") && endsWith(word, this.suffix)) ? true : false;
		},
		
		truncate : function(word) {

			return (this.offset == 0) ? word : word.substr(0, word.length - this.offset);
		}
	}
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////
	// adapted from: https://github.com/sole/tween.js
	//////////////////////////////////////////////////////////////////////////////////////    
	
	/**
	 * @private
	 */
	var TextBehavior = function (rt, object) {
	
		var _parent = rt;
		var _object = object || _parent;
		var _valuesStart = {};
		var _valuesEnd = {};
		var _duration = 1000;
		var _delayTime = 0;
		var _startTime = null;
		var _easingFunction = Easing.Linear.None;
		var _interpolationFunction = Interpolation.Linear;
		var _chainedTween = null;
		var _onUpdateCallback = null;
		var _onCompleteCallback = null;
	
		this.to = function ( properties, duration ) {
	
			if ( duration !== null ) {
	
				_duration = duration;
			}
	
			_valuesEnd = properties;
			
			return this;
		}
	
		this.start = function ( time ) {
	
			if (_parent) 
				_parent._addBehavior( this );
			else
				err('Unable to add tween');
	
			_startTime = time !== undefined ? time : Date.now();
			_startTime += _delayTime;
	
			for ( var property in _valuesEnd ) {
	
				// This prevents the engine from interpolating null values
				if ( _object[ property ] === null ) {
					console.error('null value in interpolater for: '+property);
					continue;
	
				}
	
				// check if an Array was provided as property value
				if ( _valuesEnd[ property ] instanceof Array ) {
	
					if ( _valuesEnd[ property ].length === 0 ) {
	
						continue;
					}
	
					// create a local copy of the Array with the start value at the front
					_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );
				}
	
				_valuesStart[ property ] = _object[ property ];
			}
	
			return this;
	
		}
	
		this.stop = function () {
	
			if (_parent) _parent.stopBehavior( this );
			return this;
	
		}
	
		this.delay = function ( amount ) {
	
			_delayTime = amount;
			return this;
	
		}
	
		this.easing = function ( easing ) {
	
			_easingFunction = easing;
			return this;
	
		}
	
		this.interpolation = function ( interpolation ) {
	
			_interpolationFunction = interpolation;
			return this;
	
		}
	
		this.chain = function ( chainedTween ) {
	
			_chainedTween = chainedTween;
			return this;
	
		}
	
		this.onUpdate = function ( onUpdateCallback ) {
	
			_onUpdateCallback = onUpdateCallback;
			return this;
	
		}
	
		this.onComplete = function ( onCompleteCallback ) {
	
			_onCompleteCallback = onCompleteCallback;
			return this;
	
		}
	
		this.update = function ( time ) {
	
			if ( time < _startTime ) return true;
	
			var elapsed = ( time - _startTime ) / _duration;
			elapsed = elapsed > 1 ? 1 : elapsed;
	
			var value = _easingFunction( elapsed );
	
			for ( var property in _valuesStart ) {
	
				var start = _valuesStart[ property ];
				var end = _valuesEnd[ property ];
	
				if ( end instanceof Array ) {
	
					_object[ property ] = _interpolationFunction( end, value );
	
				} else {
	
					_object[ property ] = start + ( end - start ) * value;
	
				}
			}
	
			if (_onUpdateCallback) {

				_onUpdateCallback.call( _object, value );
			}
	
			if ( elapsed == 1 ) {
	
				if ( _onCompleteCallback !== null ) {
	
					_onCompleteCallback.call( _object );
				}
	
				if ( _chainedTween !== null ) {
	
					_chainedTween.start();
				}
	
				return false;
	
			}
	
			return true;
		}
	
	}

	/**
	 * @name RiText_P5
	 * @class
	 * @private
	 */
	var RiText_P5 = makeClass();

	RiText_P5.prototype = {

		init : function(p, ctx) {
			
			this.p = p;
			if (!ctx) console.error("no canvas-context!");
			this.ctx = ctx;
			
		},
		
		_size : function() {
			
			return this.p.size.apply(this, arguments);
		},
		
		_getGraphics : function() {
			
			return this.p;
		},
		
		/*_pushState : function() {
 			
			this.p.pushStyle(); 
			this.p.pushMatrix();
			return this;
		 },
 		
		 _popState : function() {
 			
			this.p.popStyle();
			this.p.popMatrix();
			return this;
		 },*/
 		
		_pushState : function() {
			
			// TODO: what about the matrix?
			
			//this.p.pushStyle(); 
			this.ctx.save();
			
			//this.p.pushMatrix();
			return this;
		},
		
		_popState : function() {
			
			//this.p.popMatrix();
			
			this.ctx.restore();
			//this.p.popStyle();
			
			return this;
		},

		_textAlign : function(align) {
			
			this.p.textAlign.apply(this,arguments);
			return this;
		},
		
		_scale : function(sx, sy) {
			
			this.p.scale(sx, sy, 1);
		},
		
		_translate : function(tx, ty) {
			
			this.p.translate(tx, ty, 0);
		},
		
		_rotate : function(zRot) {
 
			this.p.rotate(zRot);
		},
		
		_text : function(str, x, y) {
			
			this.p.text.apply(this, arguments);
		},
		
		_fill : function(r,g,b,a) {
			
			this.p.fill.apply(this,arguments);
		},
		
		_stroke : function(r,g,b,a) {
			
			this.p.stroke.apply(this,arguments);
		},
		
		_background : function(r,g,b,a) {
			
			this.p.background.apply(this,arguments);
		},

		// actual creation: only called from RiText.createDefaultFont();!
		_createFont : function(fontName, fontSize) {
			
			//console.log("[P5] Creating font: "+fontName+"-"+fontSize+"/"+leading);
			var pfont = this.p.createFont(fontName, fontSize);                
			
			//pfont.leading = leading || RiText.defaults.fontLeading;

			//console.log(pfont);
			return pfont;
		},

		_rect : function(x,y,w,h) {
			
			this.p.rect.apply(this,arguments);
		},
		
		_line : function(x1,y1,x2,y2,lw) {
			
			if (lw) p.strokeWeight(lw);
			this.p.line.apply(this,arguments);
		},
		
		_textFont : function(fontObj) {
			
			if (!is(fontObj,O)) 
				err("_textFont takes object!");
			this.p.textFont(fontObj, fontObj.size);
		},
		
		_textWidth : function(fontObj, str) {
			
			//this.p.pushStyle(); ////////
			this.ctx.save();
			this.p.textFont(fontObj, fontObj.size); // was _textFont
			var tw = this.p.textWidth(str);
			//this.p.popStyle();
			this.ctx.restore();
			return tw;
		},
		
		_textHeight : function(rt) {
			this.ctx.save();
			var h = this._getBoundingBox(rt).height;
			this.ctx.restore();
			return h;
		},
		
		_textAscent : function(rt) {
			
			//this.p.pushStyle(); ////////
			this.ctx.save();
			this.p.textFont(rt._font, rt._font.size);
			var asc = this.p.textAscent();
			//this.p.popStyle();
			this.ctx.restore();

			return asc;
		},
		
		_textDescent : function(rt) {
			
			//this.p.pushStyle(); ////////
			this.ctx.save();
			this.p.textFont(rt._font, rt._font.size);
			var dsc = this.p.textDescent();
			//this.p.popStyle();
			this.ctx.restore();
			return dsc;
		},

		_width : function() {

			return this.p.width;
		},
		
		_height : function() {

			return this.p.height;
		},
		
		// TODO: what about scale?
		_getBoundingBox : function(rt) {
			
			//this.p.pushStyle(); ////////
			//this.ctx.save();

			this.ctx.save();
			this.p.textFont(rt._font, rt._font.size);
			
			var ascent  =   Math.round(this.p.textAscent()),
				descent =   Math.round(this.p.textDescent()),
				width   =   Math.round(this.p.textWidth(rt.text()));
			
			//this.p.popStyle(); ////////
			this.ctx.restore();

			return { x: 0, y: -ascent-1, width: width, height: (ascent+descent)+1 };
		},
		
		_type : function() {
			
			return "Processing";
		},
		
		toString : function() {
			
			return "RiText_"+this._type;
		}
	}
	
	////////////////////////////////// End Classes ///////////////////////////////////

	// TODO: clean this mess up... wrap in Constants, and EnglishConstants?
	
	var QUESTION_STARTS = ["Was", "What", "When", "Where", "How", "Which", "If", "Who", "Is", "Could", "Might", "Will", "Does", "Why", "Are" ];    
	
	var W_QUESTION_STARTS = ["Was", "What", "When", "Where", "How", "Which", "Why", "Who", "Will"];
	
	var PUNCTUATION_CLASS = /[`~\"\/'_\-[\]{}()*+!?%&.,\\^$|#@<>|+=;:]/g; // TODO: missing smart-quotes
	
	var ONLY_PUNCT = /^[^0-9A-Za-z\s]*$/, RiTextCallbacksDisabled = false;
	
	var ALL_PUNCT = /^[-[\]{}()*+!?%&.,\\^$|#@<>|+=;:]+$/g, DeLiM = ':DeLiM:', EA = new Array();
	
	var SP = ' ', E = '', N = Type.N, S = Type.S, O = Type.O, A = Type.A, B = Type.B, R = Type.R, F = Type.F;
	
	var DEFAULT_PLURAL_RULE = RE("^((\\w+)(-\\w+)*)(\\s((\\w+)(-\\w+)*))*$", 0, "s");
	
	var NULL_PLURALS = RE( // these don't change for plural/singular
		"^(bantu|bengalese|bengali|beninese|boche|bonsai|digitalis|mess|"
		+ "burmese|chinese|colossus|congolese|discus|emphasis|gabonese|guyanese|japanese|javanese|"
		+ "lebanese|maltese|olympics|portuguese|senegalese|siamese|singhalese|innings|"
		+ "sinhalese|sioux|sudanese|swiss|taiwanese|togolese|vietnamese|aircraft|"
		+ "anopheles|apparatus|asparagus|barracks|bellows|bison|bluefish|bob|bourgeois|"
		+ "bream|brill|butterfingers|cargo|carp|catfish|chassis|clothes|chub|cod|codfish|"
		+ "coley|contretemps|corps|crawfish|crayfish|crossroads|cuttlefish|dace|deer|dice|"
		+ "dogfish|doings|dory|downstairs|eldest|earnings|economics|electronics|finnan|"
		+ "firstborn|fish|flatfish|flounder|fowl|fry|fries|works|globefish|goldfish|golf|"
		+ "grand|grief|gudgeon|gulden|haddock|hake|halibut|headquarters|herring|hertz|horsepower|"
		+ "goods|hovercraft|hundredweight|ironworks|jackanapes|kilohertz|kurus|kwacha|ling|lungfish|"
		+ "mackerel|means|megahertz|moorfowl|moorgame|mullet|nepalese|offspring|pampas|parr|pants|"
		+ "patois|pekinese|penn'orth|perch|pickerel|pike|pince-nez|plaice|precis|quid|rand|"
		+ "rendezvous|revers|roach|roux|salmon|samurai|series|seychelles|seychellois|shad|"
		+ "sheep|shellfish|smelt|spacecraft|species|starfish|stockfish|sunfish|superficies|"
		+ "sweepstakes|swordfish|tench|tennis|[a-z]+osis|[a-z]+itis|[a-z]+ness|"
		+ "tobacco|tope|triceps|trout|tuna|tunafish|tunny|turbot|trousers|"
		+ "undersigned|veg|waterfowl|waterworks|waxworks|whiting|wildfowl|woodworm|"
		+ "yen|aries|pisces|forceps|lieder|jeans|physics|mathematics|news|odds|politics|remains|"
		+ "surroundings|thanks|statistics|goods|aids|wildlife)$", 0, E); 
		
	var SINGULAR_RULES = [
		  NULL_PLURALS,
		  RE("^(oxen|buses)$",2,E),
		  RE("^(toes|taxis)$",1,E),
		  RE("^series$",0,E),
		  RE("(men|women)$",2,"an"),
		  RE("^[lm]ice$",3,"ouse"),
		  RE("^children",3,E),
		  RE("^(appendices|indices|matrices)", 3, "x"),
		  RE("^(stimuli|alumni)$", 1, "us"),
		  RE("^(data)$", 1, "um"),
		  RE("^(memoranda|bacteria|curricula|minima|"
			  + "maxima|referenda|spectra|phenomena|criteria)$", 1, "um"),
		  RE("monies", 3, "ey"),
		  RE("people", 4, "rson"),
		  RE("^meninges|phalanges$", 3, "x"),
		  RE("schemata$", 2, "s"),
		  RE("^corpora$", 3, "us"),
		  RE("^(curi|formul|vertebr|larv|uln|alumn|signor|alg)ae$", 1, E),
		  RE("^apices|cortices$", 4, "ex"),
		  RE("^teeth$", 4, "ooth"),
		  RE("^feet$", 3, "oot"),
		  RE("femora", 3, "ur"),
		  RE("geese", 4, "oose"),
		  RE("crises", 2, "is"),
		  RE("(human|german|roman)$", 0, "s")
	];

	var PLURAL_RULES = [
		NULL_PLURALS,
		RE("^(piano|photo|solo|ego)$", 0, "s"),
		RE("[bcdfghjklmnpqrstvwxyz]o$", 0, "es"),
		RE("[bcdfghjklmnpqrstvwxyz]y$", 1, "ies"),
		RE("^ox$", 0, "en"),
		RE("([zsx]|ch|sh)$", 0, "es"),
		RE("[lraeiou]fe$", 2, "ves"),
		RE("[lraeiou]f$", 1, "ves"),
		RE("(eu|eau)$", 0, "x"),
		RE("(man|woman)$", 2, "en"),
		RE("money$", 2, "ies"),
		RE("person$", 4, "ople"),
		RE("motif$", 0, "s"),
		RE("^meninx|phalanx$", 1, "ges"),
		RE("(xis|sis)$", 2, "es"),
		RE("schema$", 0, "ta"),
		RE("^bus$", 0, "ses"),
		RE("child$", 0, "ren"),
		RE("^(curi|formul|vertebr|larv|uln|alumn|signor|alg)a$", 0, "e"),
		RE("^corpus$", 2, "ora"),
		RE("^(maharaj|raj|myn|mull)a$", 0, "hs"),
		RE("^aide-de-camp$", 8, "s-de-camp"),
		RE("^apex|cortex$", 2, "ices"),
		RE("^weltanschauung$", 0, "en"),
		RE("^lied$", 0, "er"),
		RE("^tooth$", 4, "eeth"),
		RE("^[lm]ouse$", 4, "ice"),
		RE("^foot$", 3, "eet"),
		RE("femur", 2, "ora"),
		RE("goose", 4, "eese"),
		RE("(human|german|roman)$", 0, "s"),
		RE("(crisis)$", 2, "es"),
		RE("^(monarch|loch|stomach)$", 0, "s"),
		RE("^(taxi|chief|proof|ref|relief|roof|belief)$", 0, "s"),
		RE("^(co|no)$", 0, "'s"),
		RE("^(memorandum|bacterium|curriculum|minimum|"
			+ "maximum|referendum|spectrum|phenomenon|criterion)$", 2, "a"),
		RE("^(appendix|index|matrix)", 2, "ices"),
		RE("^(stimulus|alumnus)$", 2, "i")
	],
		
	ANY_STEM = "^((\\w+)(-\\w+)*)(\\s((\\w+)(-\\w+)*))*$", CONS = "[bcdfghjklmnpqrstvwxyz]",
	VERBAL_PREFIX = "((be|with|pre|un|over|re|mis|under|out|up|fore|for|counter|co|sub)(-?))",
	AUXILIARIES = [ "do", "have", "be" ],
	MODALS = [ "shall", "would", "may", "might", "ought", "should" ],
	SYMBOLS = [ "!", "?", "$", "%", "*", "+", "-", "=" ],

	ING_FORM_RULES = [ 
		  RE(CONS + "ie$", 2, "ying", 1),
		  RE("[^ie]e$", 1, "ing", 1),
		  RE("^bog-down$", 5, "ging-down", 0),
		  RE("^chivy$", 1, "vying", 0),
		  RE("^trek$", 1, "cking", 0), 
		  RE("^bring$", 0, "ing", 0),
		  RE("^be$", 0, "ing", 0), 
		  RE("^age$", 1, "ing", 0), 
		  RE("(ibe)$", 1, "ing", 0) 
	],

	PAST_PARTICIPLE_RULES = [     
		
		RE(CONS + "y$", 1, "ied", 1),
		RE("^" + VERBAL_PREFIX + "?(bring)$", 3, "ought", 0),
		RE("^" + VERBAL_PREFIX + "?(take|rise|strew|blow|draw|drive|know|give|"
			+ "arise|gnaw|grave|grow|hew|know|mow|see|sew|throw|prove|saw|quartersaw|"
			+ "partake|sake|shake|shew|show|shrive|sightsee|strew|strive)$",
			0, "n", 0),
		RE("^" + VERBAL_PREFIX + "?[gd]o$", 0, "ne", 1),
		RE("^(beat|eat|be|fall)$", 0, "en", 0),
		RE("^(have)$", 2, "d", 0),
		RE("^" + VERBAL_PREFIX + "?bid$", 0, "den", 0),
		RE("^" + VERBAL_PREFIX + "?[lps]ay$", 1, "id", 1),
		RE("^behave$", 0, "d", 0),
		RE("^" + VERBAL_PREFIX + "?have$", 2, "d", 1),
		RE("(sink|slink|drink|shrink|stink)$", 3, "unk", 0),
		RE("(([sfc][twlp]?r?|w?r)ing|hang)$", 3, "ung", 0),
		RE("^" + VERBAL_PREFIX + "?(shear|swear|bear|wear|tear)$",3,"orn",0),
		RE("^" + VERBAL_PREFIX + "?(bend|spend|send|lend)$", 1, "t", 0),
		RE("^" + VERBAL_PREFIX + "?(weep|sleep|sweep|creep|keep$)$", 2,"pt", 0),
		RE("^" + VERBAL_PREFIX + "?(sell|tell)$", 3, "old", 0),
		RE("^(outfight|beseech)$", 4, "ought", 0),
		RE("^bethink$", 3, "ought", 0),
		RE("^buy$", 2, "ought", 0),
		RE("^aby$", 1, "ought", 0),
		RE("^tarmac", 0, "ked", 0),
		RE("^abide$", 3, "ode", 0),
		RE("^" + VERBAL_PREFIX + "?(speak|(a?)wake|break)$", 3, "oken", 0),
		RE("^backbite$", 1, "ten", 0),
		RE("^backslide$", 1, "den", 0),
		RE("^become$", 3, "ame", 0),
		RE("^begird$", 3, "irt", 0),
		RE("^outlie$", 2, "ay", 0),
		RE("^rebind$", 3, "ound", 0),
		RE("^relay$", 2, "aid", 0),
		RE("^shit$", 3, "hat", 0),
		RE("^bereave$", 4, "eft", 0),
		RE("^foreswear$", 3, "ore", 0),
		RE("^overfly$", 1, "own", 0),
		RE("^beget$", 2, "otten", 0),
		RE("^begin$", 3, "gun", 0),
		RE("^bestride$", 1, "den", 0),
		RE("^bite$", 1, "ten", 0),
		RE("^bleed$", 4, "led", 0),
		RE("^bog-down$", 5, "ged-down", 0),
		RE("^bind$", 3, "ound", 0),
		RE("^(.*)feed$", 4, "fed", 0),
		RE("^breed$", 4, "red", 0),
		RE("^brei", 0, "d", 0),
		RE("^bring$", 3, "ought", 0),
		RE("^build$", 1, "t", 0),
		RE("^come", 0, "", 0),
		RE("^catch$", 3, "ught", 0),
		RE("^chivy$", 1, "vied", 0),
		RE("^choose$", 3, "sen", 0),
		RE("^cleave$", 4, "oven", 0),
		RE("^crossbreed$", 4, "red", 0),
		RE("^deal", 0, "t", 0),
		RE("^dow$", 1, "ught", 0),
		RE("^dream", 0, "t", 0),
		RE("^dig$", 3, "dug", 0),
		RE("^dwell$", 2, "lt", 0),
		RE("^enwind$", 3, "ound", 0),
		RE("^feel$", 3, "elt", 0),
		RE("^flee$", 2, "ed", 0),
		RE("^floodlight$", 5, "lit", 0),
		RE("^fly$", 1, "own", 0),
		RE("^forbear$", 3, "orne", 0),
		RE("^forerun$", 3, "ran", 0),
		RE("^forget$", 2, "otten", 0),
		RE("^fight$", 4, "ought", 0),
		RE("^find$", 3, "ound", 0),
		RE("^freeze$", 4, "ozen", 0),
		RE("^gainsay$", 2, "aid", 0),
		RE("^gin$", 3, "gan", 0),
		RE("^gen-up$", 3, "ned-up", 0),
		RE("^ghostwrite$", 1, "ten", 0),
		RE("^get$", 2, "otten", 0),
		RE("^grind$", 3, "ound", 0),
		RE("^hacksaw", 0, "n", 0),
		RE("^hear", 0, "d", 0),
		RE("^hold$", 3, "eld", 0),
		RE("^hide$", 1, "den", 0),
		RE("^honey$", 2, "ied", 0),
		RE("^inbreed$", 4, "red", 0),
		RE("^indwell$", 3, "elt", 0),
		RE("^interbreed$", 4, "red", 0),
		RE("^interweave$", 4, "oven", 0),
		RE("^inweave$", 4, "oven", 0),
		RE("^ken$", 2, "ent", 0),
		RE("^kneel$", 3, "elt", 0),
		RE("^lie$", 2, "ain", 0),
		RE("^leap$", 0, "t", 0),
		RE("^learn$", 0, "t", 0),
		RE("^lead$", 4, "led", 0),
		RE("^leave$", 4, "eft", 0),
		RE("^light$", 5, "lit", 0),
		RE("^lose$", 3, "ost", 0),
		RE("^make$", 3, "ade", 0),
		RE("^mean", 0, "t", 0),
		RE("^meet$", 4, "met", 0),
		RE("^misbecome$", 3, "ame", 0),
		RE("^misdeal$", 2, "alt", 0),
		RE("^mishear$", 1, "d", 0),
		RE("^mislead$", 4, "led", 0),
		RE("^misunderstand$", 3, "ood", 0),
		RE("^outbreed$", 4, "red", 0),
		RE("^outrun$", 3, "ran", 0),
		RE("^outride$", 1, "den", 0),
		RE("^outshine$", 3, "one", 0),
		RE("^outshoot$", 4, "hot", 0),
		RE("^outstand$", 3, "ood", 0),
		RE("^outthink$", 3, "ought", 0),
		RE("^outgo$", 2, "went", 0),
		RE("^overbear$", 3, "orne", 0),
		RE("^overbuild$", 3, "ilt", 0),
		RE("^overcome$", 3, "ame", 0),
		RE("^overfly$", 2, "lew", 0),
		RE("^overhear$", 2, "ard", 0),
		RE("^overlie$", 2, "ain", 0),
		RE("^overrun$", 3, "ran", 0),
		RE("^override$", 1, "den", 0),
		RE("^overshoot$", 4, "hot", 0),
		RE("^overwind$", 3, "ound", 0),
		RE("^overwrite$", 1, "ten", 0),
		RE("^plead$", 2, "d", 0),
		//RE("^run$", 3, "ran", 0), //DH
		//RE("^rerun$", 3, "run", 0),
		RE("^rebuild$", 3, "ilt", 0),
		RE("^red$", 3, "red", 0),
		RE("^redo$", 1, "one", 0),
		RE("^remake$", 3, "ade", 0),
		RE("^resit$", 3, "sat", 0),
		RE("^rethink$", 3, "ought", 0),
		RE("^rewind$", 3, "ound", 0),
		RE("^rewrite$", 1, "ten", 0),
		RE("^ride$", 1, "den", 0),
		RE("^reeve$", 4, "ove", 0),
		RE("^sit$", 3, "sat", 0),
		RE("^shoe$", 3, "hod", 0),
		RE("^shine$", 3, "one", 0),
		RE("^shoot$", 4, "hot", 0),
		RE("^ski$", 1, "i'd", 0),
		RE("^slide$", 1, "den", 0),
		RE("^smite$", 1, "ten", 0),
		RE("^seek$", 3, "ought", 0),
		RE("^spit$", 3, "pat", 0),
		RE("^speed$", 4, "ped", 0),
		RE("^spellbind$", 3, "ound", 0),
		RE("^spoil$", 2, "ilt", 0),
		RE("^spotlight$", 5, "lit", 0),
		RE("^spin$", 3, "pun", 0),
		RE("^steal$", 3, "olen", 0),
		RE("^stand$", 3, "ood", 0),
		RE("^stave$", 3, "ove", 0),
		RE("^stride$", 1, "den", 0),
		RE("^strike$", 3, "uck", 0),
		RE("^stick$", 3, "uck", 0),
		RE("^swell$", 3, "ollen", 0),
		RE("^swim$", 3, "wum", 0),
		RE("^teach$", 4, "aught", 0),
		RE("^think$", 3, "ought", 0),
		RE("^tread$", 3, "odden", 0),
		RE("^typewrite$", 1, "ten", 0),
		RE("^unbind$", 3, "ound", 0),
		RE("^underbuy$", 2, "ought", 0),
		RE("^undergird$", 3, "irt", 0),
		RE("^undergo$", 1, "one", 0),
		RE("^underlie$", 2, "ain", 0),
		RE("^undershoot$", 4, "hot", 0),
		RE("^understand$", 3, "ood", 0),
		RE("^unfreeze$", 4, "ozen", 0),
		RE("^unlearn", 0, "t", 0),
		RE("^unmake$", 3, "ade", 0),
		RE("^unreeve$", 4, "ove", 0),
		RE("^unstick$", 3, "uck", 0),
		RE("^unteach$", 4, "aught", 0),
		RE("^unthink$", 3, "ought", 0),
		RE("^untread$", 3, "odden", 0),
		RE("^unwind$", 3, "ound", 0),
		RE("^upbuild$", 1, "t", 0),
		RE("^uphold$", 3, "eld", 0),
		RE("^upheave$", 4, "ove", 0),
		RE("^waylay$", 2, "ain", 0),
		RE("^whipsaw$", 2, "awn", 0),
		RE("^withhold$", 3, "eld", 0),
		RE("^withstand$", 3, "ood", 0),
		RE("^win$", 3, "won", 0),
		RE("^wind$", 3, "ound", 0),
		RE("^weave$", 4, "oven", 0),
		RE("^write$", 1, "ten", 0),
		RE("^trek$", 1, "cked", 0),
		RE("^ko$", 1, "o'd", 0),
		RE("^win$", 2, "on", 0),
		
		RE("e$", 0, "d", 1),
		
		// Null past forms
		RE("^" + VERBAL_PREFIX
		+ "?(cast|thrust|typeset|cut|bid|upset|wet|bet|cut|hit|hurt|inset|let|cost|burst|beat|beset|set|upset|hit|offset|put|quit|"
		+ "wed|typeset|wed|spread|split|slit|read|run|rerun|shut|shed)$", 0, E, 0)

		],
			
		PAST_TENSE_RULES = [
							RE("^(reduce)$", 0, "d", 0),
			RE("e$", 0, "d", 1),
			RE("^" + VERBAL_PREFIX + "?[pls]ay$", 1, "id", 1),
			RE(CONS + "y$", 1, "ied", 1),
			RE("^(fling|cling|hang)$", 3, "ung", 0),
			RE("(([sfc][twlp]?r?|w?r)ing)$", 3, "ang", 1),
			RE("^" + VERBAL_PREFIX + "?(bend|spend|send|lend|spend)$", 1, "t", 0),
			RE("^" + VERBAL_PREFIX + "?lie$", 2, "ay", 0),
			RE("^" + VERBAL_PREFIX + "?(weep|sleep|sweep|creep|keep)$", 2, "pt",
			0),
			RE("^" + VERBAL_PREFIX + "?(sell|tell)$", 3, "old", 0),
			RE("^" + VERBAL_PREFIX + "?do$", 1, "id", 0),
			RE("^" + VERBAL_PREFIX + "?dig$", 2, "ug", 0),
			RE("^behave$", 0, "d", 0),
			RE("^(have)$", 2, "d", 0),
			RE("(sink|drink)$", 3, "ank", 0),
			RE("^swing$", 3, "ung", 0),
			RE("^be$", 2, "was", 0),
			RE("^outfight$", 4, "ought", 0),
			RE("^tarmac", 0, "ked", 0),
			RE("^abide$", 3, "ode", 0),
			RE("^aby$", 1, "ought", 0),
			RE("^become$", 3, "ame", 0),
			RE("^begird$", 3, "irt", 0),
			RE("^outlie$", 2, "ay", 0),
			RE("^rebind$", 3, "ound", 0),
			RE("^shit$", 3, "hat", 0),
			RE("^bereave$", 4, "eft", 0),
			RE("^foreswear$", 3, "ore", 0),
			RE("^bename$", 3, "empt", 0),
			RE("^beseech$", 4, "ought", 0),
			RE("^bethink$", 3, "ought", 0),
			RE("^bleed$", 4, "led", 0),
			RE("^bog-down$", 5, "ged-down", 0),
			RE("^buy$", 2, "ought", 0),
			RE("^bind$", 3, "ound", 0),
			RE("^(.*)feed$", 4, "fed", 0),
			RE("^breed$", 4, "red", 0),
			RE("^brei$", 2, "eid", 0),
			RE("^bring$", 3, "ought", 0),
			RE("^build$", 3, "ilt", 0),
			RE("^come$", 3, "ame", 0),
			RE("^catch$", 3, "ught", 0),
			RE("^clothe$", 5, "lad", 0),
			RE("^crossbreed$", 4, "red", 0),
			RE("^deal$", 2, "alt", 0),
			RE("^dow$", 1, "ught", 0),
			RE("^dream$", 2, "amt", 0),
			RE("^dwell$", 3, "elt", 0),
			RE("^enwind$", 3, "ound", 0),
			RE("^feel$", 3, "elt", 0),
			RE("^flee$", 3, "led", 0),
			RE("^floodlight$", 5, "lit", 0),
			RE("^arise$", 3, "ose", 0),
			RE("^eat$", 3, "ate", 0),
			RE("^backbite$", 4, "bit", 0),
			RE("^backslide$", 4, "lid", 0),
			RE("^befall$", 3, "ell", 0),
			RE("^begin$", 3, "gan", 0),
			RE("^beget$", 3, "got", 0),
			RE("^behold$", 3, "eld", 0),
			RE("^bespeak$", 3, "oke", 0),
			RE("^bestride$", 3, "ode", 0),
			RE("^betake$", 3, "ook", 0),
			RE("^bite$", 4, "bit", 0),
			RE("^blow$", 3, "lew", 0),
			RE("^bear$", 3, "ore", 0),
			RE("^break$", 3, "oke", 0),
			RE("^choose$", 4, "ose", 0),
			RE("^cleave$", 4, "ove", 0),
			RE("^countersink$", 3, "ank", 0),
			RE("^drink$", 3, "ank", 0),
			RE("^draw$", 3, "rew", 0),
			RE("^drive$", 3, "ove", 0),
			RE("^fall$", 3, "ell", 0),
			RE("^fly$", 2, "lew", 0),
			RE("^flyblow$", 3, "lew", 0),
			RE("^forbid$", 2, "ade", 0),
			RE("^forbear$", 3, "ore", 0),
			RE("^foreknow$", 3, "new", 0),
			RE("^foresee$", 3, "saw", 0),
			RE("^forespeak$", 3, "oke", 0),
			RE("^forego$", 2, "went", 0),
			RE("^forgive$", 3, "ave", 0),
			RE("^forget$", 3, "got", 0),
			RE("^forsake$", 3, "ook", 0),
			RE("^forspeak$", 3, "oke", 0),
			RE("^forswear$", 3, "ore", 0),
			RE("^forgo$", 2, "went", 0),
			RE("^fight$", 4, "ought", 0),
			RE("^find$", 3, "ound", 0),
			RE("^freeze$", 4, "oze", 0),
			RE("^give$", 3, "ave", 0),
			RE("^geld$", 3, "elt", 0),
			RE("^gen-up$", 3, "ned-up", 0),
			RE("^ghostwrite$", 3, "ote", 0),
			RE("^get$", 3, "got", 0),
			RE("^grow$", 3, "rew", 0),
			RE("^grind$", 3, "ound", 0),
			RE("^hear$", 2, "ard", 0),
			RE("^hold$", 3, "eld", 0),
			RE("^hide$", 4, "hid", 0),
			RE("^honey$", 2, "ied", 0),
			RE("^inbreed$", 4, "red", 0),
			RE("^indwell$", 3, "elt", 0),
			RE("^interbreed$", 4, "red", 0),
			RE("^interweave$", 4, "ove", 0),
			RE("^inweave$", 4, "ove", 0),
			RE("^ken$", 2, "ent", 0),
			RE("^kneel$", 3, "elt", 0),
			RE("^^know$$", 3, "new", 0),
			RE("^leap$", 2, "apt", 0),
			RE("^learn$", 2, "rnt", 0),
			RE("^lead$", 4, "led", 0),
			RE("^leave$", 4, "eft", 0),
			RE("^light$", 5, "lit", 0),
			RE("^lose$", 3, "ost", 0),
			RE("^make$", 3, "ade", 0),
			RE("^mean$", 2, "ant", 0),
			RE("^meet$", 4, "met", 0),
			RE("^misbecome$", 3, "ame", 0),
			RE("^misdeal$", 2, "alt", 0),
			RE("^misgive$", 3, "ave", 0),
			RE("^mishear$", 2, "ard", 0),
			RE("^mislead$", 4, "led", 0),
			RE("^mistake$", 3, "ook", 0),
			RE("^misunderstand$", 3, "ood", 0),
			RE("^outbreed$", 4, "red", 0),
			RE("^outgrow$", 3, "rew", 0),
			RE("^outride$", 3, "ode", 0),
			RE("^outshine$", 3, "one", 0),
			RE("^outshoot$", 4, "hot", 0),
			RE("^outstand$", 3, "ood", 0),
			RE("^outthink$", 3, "ought", 0),
			RE("^outgo$", 2, "went", 0),
			RE("^outwear$", 3, "ore", 0),
			RE("^overblow$", 3, "lew", 0),
			RE("^overbear$", 3, "ore", 0),
			RE("^overbuild$", 3, "ilt", 0),
			RE("^overcome$", 3, "ame", 0),
			RE("^overdraw$", 3, "rew", 0),
			RE("^overdrive$", 3, "ove", 0),
			RE("^overfly$", 2, "lew", 0),
			RE("^overgrow$", 3, "rew", 0),
			RE("^overhear$", 2, "ard", 0),
			RE("^overpass$", 3, "ast", 0),
			RE("^override$", 3, "ode", 0),
			RE("^oversee$", 3, "saw", 0),
			RE("^overshoot$", 4, "hot", 0),
			RE("^overthrow$", 3, "rew", 0),
			RE("^overtake$", 3, "ook", 0),
			RE("^overwind$", 3, "ound", 0),
			RE("^overwrite$", 3, "ote", 0),
			RE("^partake$", 3, "ook", 0),
			RE("^" + VERBAL_PREFIX + "?run$", 2, "an", 0),
			RE("^ring$", 3, "ang", 0),
			RE("^rebuild$", 3, "ilt", 0),
			RE("^red", 0, "", 0),
			RE("^reave$", 4, "eft", 0),
			RE("^remake$", 3, "ade", 0),
			RE("^resit$", 3, "sat", 0),
			RE("^rethink$", 3, "ought", 0),
			RE("^retake$", 3, "ook", 0),
			RE("^rewind$", 3, "ound", 0),
			RE("^rewrite$", 3, "ote", 0),
			RE("^ride$", 3, "ode", 0),
			RE("^rise$", 3, "ose", 0),
			RE("^reeve$", 4, "ove", 0),
			RE("^sing$", 3, "ang", 0),
			RE("^sink$", 3, "ank", 0),
			RE("^sit$", 3, "sat", 0),
			RE("^see$", 3, "saw", 0),
			RE("^shoe$", 3, "hod", 0),
			RE("^shine$", 3, "one", 0),
			RE("^shake$", 3, "ook", 0),
			RE("^shoot$", 4, "hot", 0),
			RE("^shrink$", 3, "ank", 0),
			RE("^shrive$", 3, "ove", 0),
			RE("^sightsee$", 3, "saw", 0),
			RE("^ski$", 1, "i'd", 0),
			RE("^skydive$", 3, "ove", 0),
			RE("^slay$", 3, "lew", 0),
			RE("^slide$", 4, "lid", 0),
			RE("^slink$", 3, "unk", 0),
			RE("^smite$", 4, "mit", 0),
			RE("^seek$", 3, "ought", 0),
			RE("^spit$", 3, "pat", 0),
			RE("^speed$", 4, "ped", 0),
			RE("^spellbind$", 3, "ound", 0),
			RE("^spoil$", 2, "ilt", 0),
			RE("^speak$", 3, "oke", 0),
			RE("^spotlight$", 5, "lit", 0),
			RE("^spring$", 3, "ang", 0),
			RE("^spin$", 3, "pun", 0),
			RE("^stink$", 3, "ank", 0),
			RE("^steal$", 3, "ole", 0),
			RE("^stand$", 3, "ood", 0),
			RE("^stave$", 3, "ove", 0),
			RE("^stride$", 3, "ode", 0),
			RE("^strive$", 3, "ove", 0),
			RE("^strike$", 3, "uck", 0),
			RE("^stick$", 3, "uck", 0),
			RE("^swim$", 3, "wam", 0),
			RE("^swear$", 3, "ore", 0),
			RE("^teach$", 4, "aught", 0),
			RE("^think$", 3, "ought", 0),
			RE("^throw$", 3, "rew", 0),
			RE("^take$", 3, "ook", 0),
			RE("^tear$", 3, "ore", 0),
			RE("^transship$", 4, "hip", 0),
			RE("^tread$", 4, "rod", 0),
			RE("^typewrite$", 3, "ote", 0),
			RE("^unbind$", 3, "ound", 0),
			RE("^unclothe$", 5, "lad", 0),
			RE("^underbuy$", 2, "ought", 0),
			RE("^undergird$", 3, "irt", 0),
			RE("^undershoot$", 4, "hot", 0),
			RE("^understand$", 3, "ood", 0),
			RE("^undertake$", 3, "ook", 0),
			RE("^undergo$", 2, "went", 0),
			RE("^underwrite$", 3, "ote", 0),
			RE("^unfreeze$", 4, "oze", 0),
			RE("^unlearn$", 2, "rnt", 0),
			RE("^unmake$", 3, "ade", 0),
			RE("^unreeve$", 4, "ove", 0),
			RE("^unspeak$", 3, "oke", 0),
			RE("^unstick$", 3, "uck", 0),
			RE("^unswear$", 3, "ore", 0),
			RE("^unteach$", 4, "aught", 0),
			RE("^unthink$", 3, "ought", 0),
			RE("^untread$", 4, "rod", 0),
			RE("^unwind$", 3, "ound", 0),
			RE("^upbuild$", 3, "ilt", 0),
			RE("^uphold$", 3, "eld", 0),
			RE("^upheave$", 4, "ove", 0),
			RE("^uprise$", 3, "ose", 0),
			RE("^upspring$", 3, "ang", 0),
			RE("^go$", 2, "went", 0),
			RE("^wiredraw$", 3, "rew", 0),
			RE("^withdraw$", 3, "rew", 0),
			RE("^withhold$", 3, "eld", 0),
			RE("^withstand$", 3, "ood", 0),
			RE("^wake$", 3, "oke", 0),
			RE("^win$", 3, "won", 0),
			RE("^wear$", 3, "ore", 0),
			RE("^wind$", 3, "ound", 0),
			RE("^weave$", 4, "ove", 0),
			RE("^write$", 3, "ote", 0),
			RE("^trek$", 1, "cked", 0),
			RE("^ko$", 1, "o'd", 0),
			RE("^bid", 2, "ade", 0),
			RE("^win$", 2, "on", 0),
			RE("^swim", 2, "am", 0),
			
			// Null past forms
			RE("^" + VERBAL_PREFIX
				+ "?(cast|thrust|typeset|cut|bid|upset|wet|bet|cut|hit|hurt|inset|"
				+ "let|cost|burst|beat|beset|set|upset|offset|put|quit|wed|typeset|"
				+ "wed|spread|split|slit|read|run|shut|shed|lay)$", 0, "", 0) ],

		PRESENT_TENSE_RULES = [ 
			RE("^aby$", 0, "es", 0),
			RE("^bog-down$", 5, "s-down", 0),
			RE("^chivy$", 1, "vies", 0),
			RE("^gen-up$", 3, "s-up", 0),
			RE("^prologue$", 3, "gs", 0),
			RE("^picknic$", 0, "ks", 0),
			//RE("^swim$", 0, "s", 0), 
			RE("^ko$", 0, "'s", 0),
			RE("[osz]$", 0, "es", 1), 
			RE("^have$", 2, "s", 0),
			RE(CONS + "y$", 1, "ies", 1), 
			RE("^be$", 2, "is"),
			RE("([zsx]|ch|sh)$", 0, "es", 1) 
		],

		VERB_CONS_DOUBLING = [ "abat", "abet", "abhor", "abut", "accur", "acquit", "adlib",
		   "admit", "aerobat", "aerosol", "agendaset", "allot", "alot", "anagram",
		   "annul", "appal", "apparel", "armbar", "aver", "babysit", "airdrop", "appal",
		   "blackleg", "bobsled", "bur", "chum", "confab", "counterplot", "curet", "dib",
		   "backdrop", "backfil", "backflip", "backlog", "backpedal", "backslap",
		   "backstab", "bag", "balfun", "ballot", "ban", "bar", "barbel", "bareleg",
		   "barrel", "bat", "bayonet", "becom", "bed", "bedevil", "bedwet", "beenhop",
		   "befit", "befog", "beg", "beget", "begin", "bejewel", "bemedal", "benefit",
		   "benum", "beset", "besot", "bestir", "bet", "betassel", "bevel", "bewig",
		   "bib", "bid", "billet", "bin", "bip", "bit", "bitmap", "blab", "blag", "blam",
		   "blan", "blat", "bles", "blim", "blip", "blob", "bloodlet", "blot", "blub",
		   "blur", "bob", "bodypop", "bog", "booby-trap", "boobytrap", "booksel",
		   "bootleg", "bop", "bot", "bowel", "bracket", "brag", "brig", "brim", "bud",
		   "buffet", "bug", "bullshit", "bum", "bun", "bus", "but", "cab", "cabal", "cam",
		   "can", "cancel", "cap", "caracol", "caravan", "carburet", "carnap", "carol",
		   "carpetbag", "castanet", "cat", "catcal", "catnap", "cavil", "chan", "chanel",
		   "channel", "chap", "char", "chargecap", "chat", "chin", "chip", "chir",
		   "chirrup", "chisel", "chop", "chug", "chur", "clam", "clap", "clearcut",
		   "clip", "clodhop", "clog", "clop", "closet", "clot", "club", "co-occur",
		   "co-program", "co-refer", "co-run", "co-star", "cob", "cobweb", "cod", "coif",
		   "com", "combat", "comit", "commit", "compel", "con", "concur", "confer",
		   "confiscat", "control", "cop", "coquet", "coral", "corbel", "corral", "cosset",
		   "cotransmit", "councel", "council", "counsel", "court-martial", "crab", "cram",
		   "crap", "crib", "crop", "crossleg", "cub", "cudgel", "cum", "cun", "cup",
		   "cut", "dab", "dag", "dam", "dan", "dap", "daysit", "de-control", "de-gazet",
		   "de-hul", "de-instal", "de-mob", "de-program", "de-rig", "de-skil", "deadpan",
		   "debag", "debar", "log", "decommit", "decontrol", "defer", "defog", "deg",
		   "degas", "deinstal", "demit", "demob", "demur", "den", "denet", "depig",
		   "depip", "depit", "der", "deskil", "deter", "devil", "diagram", "dial", "dig",
		   "dim", "din", "dip", "disbar", "disbud", "discomfit", "disembed", "disembowel",
		   "dishevel", "disinter", "dispel", "disprefer", "distil", "dog", "dognap",
		   "don", "doorstep", "dot", "dowel", "drag", "drat", "driftnet", "distil",
		   "egotrip", "enrol", "enthral", "extol", "fulfil", "gaffe", "golliwog", "idyl",
		   "inspan", "drip", "drivel", "drop", "drub", "drug", "drum", "dub", "duel",
		   "dun", "dybbuk", "earwig", "eavesdrop", "ecolabel", "eitherspigot",
		   "electroblot", "embed", "emit", "empanel", "enamel", "endlabel", "endtrim",
		   "enrol", "enthral", "entrammel", "entrap", "enwrap", "equal", "equip", "estop",
		   "exaggerat", "excel", "expel", "extol", "fag", "fan", "farewel", "fat",
		   "featherbed", "feget", "fet", "fib", "fig", "fin", "fingerspel", "fingertip",
		   "fit", "flab", "flag", "flap", "flip", "flit", "flog", "flop", "fob", "focus",
		   "fog", "footbal", "footslog", "fop", "forbid", "forget", "format",
		   "fortunetel", "fot", "foxtrot", "frag", "freefal", "fret", "frig", "frip",
		   "frog", "frug", "fuel", "fufil", "fulfil", "fullyfit", "fun", "funnel", "fur",
		   "furpul", "gab", "gad", "gag", "gam", "gambol", "gap", "garot", "garrot",
		   "gas", "gat", "gel", "gen", "get", "giftwrap", "gig", "gimbal", "gin", "glam",
		   "glenden", "glendin", "globetrot", "glug", "glut", "gob", "goldpan", "goostep",
		   "gossip", "grab", "gravel", "grid", "grin", "grip", "grit", "groundhop",
		   "grovel", "grub", "gum", "gun", "gunrun", "gut", "gyp", "haircut", "ham",
		   "han", "handbag", "handicap", "handknit", "handset", "hap", "hareleg", "hat",
		   "headbut", "hedgehop", "hem", "hen", "hiccup", "highwal", "hip", "hit",
		   "hobnob", "hog", "hop", "horsewhip", "hostel", "hot", "hotdog", "hovel", "hug",
		   "hum", "humbug", "hup", "hushkit", "hut", "illfit", "imbed", "immunblot",
		   "immunoblot", "impannel", "impel", "imperil", "incur", "infer", "infil",
		   "inflam", "initial", "input", "inset", "instil", "inter", "interbed",
		   "intercrop", "intercut", "interfer", "instal", "instil", "intermit", "japan",
		   "jug", "kris", "manumit", "mishit", "mousse", "mud", "interwar", "jab", "jag",
		   "jam", "jar", "jawdrop", "jet", "jetlag", "jewel", "jib", "jig", "jitterbug",
		   "job", "jog", "jog-trot", "jot", "jut", "ken", "kennel", "kid", "kidnap",
		   "kip", "kissogram", "kit", "knap", "kneecap", "knit", "knob", "knot", "kor",
		   "label", "lag", "lam", "lap", "lavel", "leafcut", "leapfrog", "leg", "lem",
		   "lep", "let", "level", "libel", "lid", "lig", "lip", "lob", "log", "lok",
		   "lollop", "longleg", "lop", "lowbal", "lug", "mackerel", "mahom", "man", "map",
		   "mar", "marshal", "marvel", "mat", "matchwin", "metal", "micro-program",
		   "microplan", "microprogram", "milksop", "mis-cal", "mis-club", "mis-spel",
		   "miscal", "mishit", "mislabel", "mit", "mob", "mod", "model", "mohmam",
		   "monogram", "mop", "mothbal", "mug", "multilevel", "mum", "nab", "nag", "nan",
		   "nap", "net", "nightclub", "nightsit", "nip", "nod", "nonplus", "norkop",
		   "nostril", "not", "nut", "nutmeg", "occur", "ocur", "offput", "offset", "omit",
		   "ommit", "onlap", "out-general", "out-gun", "out-jab", "out-plan", "out-pol",
		   "out-pul", "out-put", "out-run", "out-sel", "outbid", "outcrop", "outfit",
		   "outgas", "outgun", "outhit", "outjab", "outpol", "output", "outrun",
		   "outship", "outshop", "outsin", "outstrip", "outswel", "outspan", "overcrop",
		   "pettifog", "photostat", "pouf", "preset", "prim", "pug", "ret", "rosin",
		   "outwit", "over-commit", "over-control", "over-fil", "over-fit", "over-lap",
		   "over-model", "over-pedal", "over-pet", "over-run", "over-sel", "over-step",
		   "over-tip", "over-top", "overbid", "overcal", "overcommit", "overcontrol",
		   "overcrap", "overdub", "overfil", "overhat", "overhit", "overlap", "overman",
		   "overplot", "overrun", "overshop", "overstep", "overtip", "overtop", "overwet",
		   "overwil", "pad", "paintbal", "pan", "panel", "paperclip", "par", "parallel",
		   "parcel", "partiescal", "pat", "patrol", "pedal", "peewit", "peg", "pen",
		   "pencil", "pep", "permit", "pet", "petal", "photoset", "phototypeset", "phut",
		   "picket", "pig", "pilot", "pin", "pinbal", "pip", "pipefit", "pipet", "pit",
		   "plan", "plit", "plod", "plop", "plot", "plug", "plumet", "plummet", "pod",
		   "policyset", "polyfil", "ponytrek", "pop", "pot", "pram", "prebag",
		   "predistil", "predril", "prefer", "prefil", "preinstal", "prep", "preplan",
		   "preprogram", "prizewin", "prod", "profer", "prog", "program", "prop",
		   "propel", "pub", "pummel", "pun", "pup", "pushfit", "put", "quarel", "quarrel",
		   "quickskim", "quickstep", "quickwit", "quip", "quit", "quivertip", "quiz",
		   "rabbit", "rabit", "radiolabel", "rag", "ram", "ramrod", "rap", "rat",
		   "ratecap", "ravel", "re-admit", "re-cal", "re-cap", "re-channel", "re-dig",
		   "re-dril", "re-emit", "re-fil", "re-fit", "re-flag", "re-format", "re-fret",
		   "re-hab", "re-instal", "re-inter", "re-lap", "re-let", "re-map", "re-metal",
		   "re-model", "re-pastel", "re-plan", "re-plot", "re-plug", "re-pot",
		   "re-program", "re-refer", "re-rig", "re-rol", "re-run", "re-sel", "re-set",
		   "re-skin", "re-stal", "re-submit", "re-tel", "re-top", "re-transmit",
		   "re-trim", "re-wrap", "readmit", "reallot", "rebel", "rebid", "rebin", "rebut",
		   "recap", "rechannel", "recommit", "recrop", "recur", "recut", "red", "redril",
		   "refer", "refit", "reformat", "refret", "refuel", "reget", "regret", "reinter",
		   "rejig", "rekit", "reknot", "relabel", "relet", "rem", "remap", "remetal",
		   "remit", "remodel", "reoccur", "rep", "repel", "repin", "replan", "replot",
		   "repol", "repot", "reprogram", "rerun", "reset", "resignal", "resit", "reskil",
		   "resubmit", "retransfer", "retransmit", "retro-fit", "retrofit", "rev",
		   "revel", "revet", "rewrap", "rib", "richochet", "ricochet", "rid", "rig",
		   "rim", "ringlet", "rip", "rit", "rival", "rivet", "roadrun", "rob", "rocket",
		   "rod", "roset", "rot", "rowel", "rub", "run", "runnel", "rut", "sab", "sad",
		   "sag", "sandbag", "sap", "scab", "scalpel", "scam", "scan", "scar", "scat",
		   "schlep", "scrag", "scram", "shall", "sled", "smut", "stet", "sulfuret",
		   "trepan", "unrip", "unstop", "whir", "whop", "wig", "scrap", "scrat", "scrub",
		   "scrum", "scud", "scum", "scur", "semi-control", "semi-skil", "semi-skim",
		   "semiskil", "sentinel", "set", "shag", "sham", "shed", "shim", "shin", "ship",
		   "shir", "shit", "shlap", "shop", "shopfit", "shortfal", "shot", "shovel",
		   "shred", "shrinkwrap", "shrivel", "shrug", "shun", "shut", "side-step",
		   "sideslip", "sidestep", "signal", "sin", "sinbin", "sip", "sit", "skid",
		   "skim", "skin", "skip", "skir", "skrag", "slab", "slag", "slam", "slap",
		   "slim", "slip", "slit", "slob", "slog", "slop", "slot", "slowclap", "slug",
		   "slum", "slur", "smit", "snag", "snap", "snip", "snivel", "snog", "snorkel",
		   "snowcem", "snub", "snug", "sob", "sod", "softpedal", "son", "sop", "spam",
		   "span", "spar", "spat", "spiderweb", "spin", "spiral", "spit", "splat",
		   "split", "spot", "sprag", "spraygun", "sprig", "springtip", "spud", "spur",
		   "squat", "squirrel", "stab", "stag", "star", "stem", "sten", "stencil", "step",
		   "stir", "stop", "storytel", "strap", "strim", "strip", "strop", "strug",
		   "strum", "strut", "stub", "stud", "stun", "sub", "subcrop", "sublet", "submit",
		   "subset", "suedetrim", "sum", "summit", "sun", "suntan", "sup", "super-chil",
		   "superad", "swab", "swag", "swan", "swap", "swat", "swig", "swim", "swivel",
		   "swot", "tab", "tag", "tan", "tansfer", "tap", "tar", "tassel", "tat", "tefer",
		   "teleshop", "tendril", "terschel", "th'strip", "thermal", "thermostat", "thin",
		   "throb", "thrum", "thud", "thug", "tightlip", "tin", "tinsel", "tip", "tittup",
		   "toecap", "tog", "tom", "tomorrow", "top", "tot", "total", "towel", "traget",
		   "trainspot", "tram", "trammel", "transfer", "tranship", "transit", "transmit",
		   "transship", "trap", "travel", "trek", "trendset", "trim", "trip", "tripod",
		   "trod", "trog", "trot", "trousseaushop", "trowel", "trup", "tub", "tug",
		   "tunnel", "tup", "tut", "twat", "twig", "twin", "twit", "typeset", "tyset",
		   "un-man", "unban", "unbar", "unbob", "uncap", "unclip", "uncompel", "undam",
		   "under-bil", "under-cut", "under-fit", "under-pin", "under-skil", "underbid",
		   "undercut", "underlet", "underman", "underpin", "unfit", "unfulfil", "unknot",
		   "unlip", "unlywil", "unman", "unpad", "unpeg", "unpin", "unplug", "unravel",
		   "unrol", "unscrol", "unsnap", "unstal", "unstep", "unstir", "untap", "unwrap",
		   "unzip", "up", "upset", "upskil", "upwel", "ven", "verbal", "vet", "victual",
		   "vignet", "wad", "wag", "wainscot", "wan", "war", "water-log", "waterfal",
		   "waterfil", "waterlog", "weasel", "web", "wed", "wet", "wham", "whet", "whip",
		   "whir", "whiteskin", "whiz", "whup", "wildcat", "win", "windmil", "wit",
		   "woodchop", "woodcut", "wor", "worship", "wrap", "wiretap", "yen", "yak",
		   "yap", "yarnspin", "yip", "yodel", "zag", "zap", "zig", "zig-zag", "zigzag",
		   "zip", "ztrip", "hand-bag", "hocus", "hocus-pocus" ],

	PAST_PARTICIPLE_RULESET = {
		name : "PAST_PARTICIPLE",
		defaultRule : RE(ANY_STEM, 0, "ed", 2),
		rules : PAST_PARTICIPLE_RULES,
		doubling : true
	},

	PRESENT_PARTICIPLE_RULESET = {
		name : "ING_FORM",
		defaultRule : RE(ANY_STEM, 0, "ing", 2),
		rules : ING_FORM_RULES,
		doubling : true
	},

	PAST_TENSE_RULESET = {
		name : "PAST_TENSE",
		defaultRule : RE(ANY_STEM, 0, "ed", 2),
		rules : PAST_TENSE_RULES,
		doubling : true
	},

	PRESENT_TENSE_RULESET = {
		name : "PRESENT_TENSE",
		defaultRule : RE(ANY_STEM, 0, "s", 2),
		rules : PRESENT_TENSE_RULES,
		doubling : false
	};

	//////// Utility functions ///////////////////////////////////////////////////////
		
	function isNum(n) {
		
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	function okeys(obj) {
	
		
		var keys = [];  // replaces Object.keys();
		for(var k in obj) keys.push(k);
		return keys;
	}

   
	function dump(obj) {

		var properties = "";
		for ( var propertyName in obj) {

			properties += propertyName + ": ";

			// Check if its NOT a function
			if (!(obj[propertyName] instanceof Function)) {
				properties += obj.propertyName;
			} else {
				properties += "function()";
			}
			properties += ", ";
		}
		return properties;
	}
	
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

	function undef(obj) {
		
		return (typeof obj === 'undefined' || obj === null);
	}

	function err(msg) {
		
		//console.log("err(msg) :: "+RiTa.SILENT);
		(!RiTa.SILENT) && console && console.trace(this);
		
		throw Error("[RiTa] " + msg);
	}
	
	function warn() {
		
		if (RiTa.SILENT || !console) return;
		
		for ( var i = 0; i < arguments.length; i++) 
			console.warn(arguments[i]);
	}
 
	function log() {
	
		if (RiTa.SILENT || !console) return;        
		
		for ( var i = 0; i < arguments.length; i++) 
			console.log(arguments[i]);
	}

	function strOk(str) {
		
		return (typeof str === S && str.length > 0);
	}

	function trim(str) {
		
		// faster version from: http://blog.stevenlevithan.com/archives/faster-trim-javascript
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
		//return str.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
	}

	function last(word) { // last char of string
		
		if (!word || !word.length) return E;
		return word.charAt(word.length-1);
	}

	function extend(l1,l2) { // python extend
		
		for (var i = 0; i < l2.length; i++) {
		 
			l1.push(l2[i]);
		}
	}

// remove!
	function replaceAll(theText, replace, withThis) {
		
		return theText && is(replace, S) ?  
			theText.replace(new RegExp(replace, 'g'), withThis) : theText;
	}

	// TODO: replace w regex?
	function endsWith(str, ending) { 
		
		if (!is(str,S)) return false;
		return str.slice(-ending.length) == ending;
	}
	
	// TODO: replace w regex?	
	function startsWith(text, substr) {

		if (!is(text,S)) return false;
		return text.slice(0, substr.length) == substr;
	}
	
	function err(msg) {
		throw Error("[RiTa] "+msg);
	}
	
	function equalsIgnoreCase(str1, str2) {
		
		return (is(str1,S) && is(str2,S)) ?
			(str1.toLowerCase() === str2.toLowerCase()) : false;
	}

	function makeClass() { // By John Resig (MIT Licensed)

		return function(args) {
			
			if (this instanceof arguments.callee) {

				if (typeof this.init == "function") {
					
					this.init.apply(this, args && args.callee ? args : arguments);
				}
			} 
			else {
				return new arguments.callee(arguments);
			}
		};
	}
	
	function parseColor() {
   
		var a = arguments, len = a.length;
		
		var color = { r: 0, g: 0, b: 0, a: 255 };

		if (!len) return color;

		if (len == 1 && is(a[0],A)) {
			return parseColor.apply(this, a[0]);
		}
	
		if (len >= 3) {
			color.r = a[0];
			color.g = a[1];
			color.b = a[2];
		}
		if (len == 4) {
			color.a = a[3];
		}
		if (len <= 2) {
			color.r = a[0];
			color.g = a[0];
			color.b = a[0];
		}
		if (len == 2) {
			color.a = a[1];
		}

		return color;
	}
	
	function addSpaces(str, num) {
		
		for ( var i = 0; i < num; i++)
			str += " ";
		return str;
	}

	// Arrays ////////////////////////////////////////////////////////////////////////
	
	function shuffle(oldArray) {
		var newArray = oldArray.slice();
		var len = newArray.length;
		var i = len;
		 while (i--) {
			var p = parseInt(Math.random()*len);
			var t = newArray[i];
			newArray[i] = newArray[p];
			newArray[p] = t;
		}
		return newArray; 
	}
	
	// Array Remove - from John Resig (MIT Licensed)
	function remove(array, from, to) {
		
	  // remove? only used once
	  var rest = array.slice((to || from) + 1 || array.length);
	  array.length = from < 0 ? array.length + from : from;
	  return array.push.apply(array, rest);
	}
 
	function insert(array, item, idx) {
		
	  array.slice(idx,0,item);
	  return array;
	}
	
	function removeFromArray(items, element) {
		
		while (items.indexOf(element) !== -1) {
			items.splice(items.indexOf(element), 1);
		}
	}
	
	function inArray(array, val) {
		if (!array) return false;
		return array.indexOf(val)>-1;
	}

	// ///////////////////////////// End Functions ////////////////////////////////////

	var context2d, hasProcessing = (typeof Processing !== 'undefined');
	//console.log('hasProcessing='+hasProcessing);
	
	if (hasProcessing) {

		Processing.registerLibrary("RiTa", {
			
			//log("Processing.registerLibrary()");
			p : null, 
			
			init : function(obj) {
			  //log("Processing.registerLibrary.init: ");
			},
		
			attach : function(p5) {
				p = p5;
				//log("Processing.registerLibrary.attach");log(p.externals);log(p.externals['canvas']);
				var context2d = p.externals['canvas'].getContext("2d");
				//log("p5:");log(context2d);
				RiText.renderer = new RiText_P5(p5, context2d);
			},
			
			detach : function(p5) {
				//log("Processing.registerLibrary.detach");
			}
			
			//exports : [] // export global function names?
		})
	}
	else {
		
		if (typeof document !== 'undefined') {
			var cnv = document.getElementsByTagName("canvas")[0];
			try {
				var context2d = cnv.getContext("2d");
				RiText.renderer = new RiText_Canvas(context2d);
			}
			catch(e) {
				console.warn("[RiTa] No object w' name='canvas' in DOM, renderer will be unavailable");
			}
		}
	}
	
	if (!RiTa.SILENT)
		console && console.log("[INFO] RiTaJS.version ["+RiTa.VERSION+RiTa._PHASE+"]");
	
	/////////////////////////////////////////////////////////////////////////////////////////
	// Core RiTa objects (in global namespace)
	/////////////////////////////////////////////////////////////////////////////////////////

	RiTa._eval = eval;

	if (window) { // for browser
		
		window['RiText'] = RiText;
		window['RiString'] = RiString;
		window['RiLexicon'] = RiLexicon;
		window['RiGrammar'] = RiGrammar;
		window['RiMarkov'] = RiMarkov;
		window['RiTaEvent'] = RiTaEvent;
		window['RiTa'] = RiTa;
	}
	
	if (typeof module != 'undefined' && module.exports) { // for node
		
		module.exports['RiString'] = RiString;
		module.exports['RiLexicon'] = RiLexicon;
		module.exports['RiGrammar'] = RiGrammar;
		module.exports['RiMarkov'] = RiMarkov;
		module.exports['RiTaEvent'] = RiTaEvent;
		module.exports['RiTa'] = RiTa;

		module.vm = require("vm"); // TODO: reconsider, use deps?
		module.vm && (RiTa._eval = module.vm.runInThisContext);
	}
	

	RiTa.p5Compatible(false);

})(typeof window !== 'undefined' ? window : null);

