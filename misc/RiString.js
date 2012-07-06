RiString.prototype = {

  /**
   * Tests if this string ends with the specified suffix.
   *
   * @param suffix - the suffix.
   * @return boolean true if the character sequence represented by the argument is a suffix of the 
   * character sequence represented by this object; false otherwise. Note that the result will be 
   * true if the argument is the empty string or is equal to this RiString object as determined by 
   * the equals(Object) method.
   * 
   */
  endsWith: function(substr) {
  	return endsWith(this.text, substr);
  },

  /**
   * Compares this RiString to the specified object. The result is true if and only if the argument 
   * is not null and is a RiString object that represents the same sequence of characters as this 
   * object.
   * 
   * @param anObject - the object to compare this RiString against.
   * @return boolean true if the RiString are equal; false otherwise.
   * @see compareTo(java.lang.String), equalsIgnoreCase(java.lang.String)
   */
  equals: function(riString) {
  	riString.text === this.text;
  },

  /**
   * Compares this RiString to another RiString, ignoring case considerations. 
   * @param riString object to compare this RiString against.
   * @return boolean true if the argument is not null and the Strings are equal, ignoring case; 
   * false otherwise.
   */
  equalsIgnoreCase: function(str) {
  	return str.toLowercase() === this.text.toLowercase();
  },

  /**
   * Sets the text contained by this object
   * @param string the text
   * @return this RiString
   */
  setText: function(text) {
  	this.text = text;
  	return this;
  },

  /**
   * Returns an array of part-of-speech tags, one per word, using RiTa.tokenize() and RiTa.posTag().
   * @return array of (pos) strings, one per word
   */
  getPos: function() {
  	var words = RiTa.tokenize(trim(this.text)); // was getPlaintext()
  	var tags = PosTagger.tag(words); // should this be RiTa.posTag() ??
  	for (var i = 0, l = tags.length; i < l; i++) {
  		if (!okStr(tags[i])) error("RiString: can't parse pos for:" + words[i]);
  	}
  	return tags;
  },

  /**
   * Returns the part-of-speech tags for the word, using RiTa.tokenize() and RiTa.posTag().
   * @param int the word index
   * @return string the pos
   */
  getPosAt: function(index) {
  	var tags = getPos();
  	if (isNull(tags) || tags.length == 0 || index >= tags.length) return [];
  	return pos[index];
  },

  /**
   *  Returns the string contained by this RiString
   *  @return string the text
   */
  getText: function() {
  	return this.text;
  },

  /**
   * Returns the word at 'index', according to RiTa.tokenize()
   * @param int the word index
   * @return string the word
   */
  getWordAt: function(index) {
  	var words = RiTa.tokenize(trim(this.text));
  	if (isNull(words) || words.length == 0 || index >= words.length) return EA;
  	return words[index];
  },

  /**
   * Returns the # of words in the object, according to RiTa.tokenize().
   * @return int
   */
  getWordCount: function() {
  	return this.getWords().length;
  },

  /**
   *  Returns the array of words in the object, via a call to RiTa.tokenize().
   *  @return array of strings, one per word
   */
  getWords: function() {
  	return RiTa.tokenize(this.text);
  },

  /**
   * Returns the index within this string of the first occurrence of the specified character.
   * @param string (Required) The string to search for
   * @param int (Optional) The start position in the string to start the search. If omitted, the search starts from position 0
   * @return int the first index of the matching pattern or -1 if none are found
   */
  indexOf: function(searchstring, start) {
  	return this.text.indexOf(searchstring, start);
  },

  /**
   * Inserts 'newWord' at 'wordIdx'
   * and shifts each subsequent word accordingly.
   * @return this RiString
   */
  insertWordAt: function(newWord, wordIdx) {

  	var words = getWords();
  	if (wordIdx < 0 || wordIdx >= words.length) return false;

  	words[wordIdx] = newWord;

  	setText(join(words, SP));

  	return true;
  },

  /**
   * Returns the index within this string of the last occurrence of the specified character.
   * @param string (Required) The string to search for
   * @param int (Optional) The start position in the string to start the search. If omitted, the search starts from position 0
   * @return int the last index of the matching pattern or -1 if none are found
   */
  lastIndexOf: function(searchstring, start) {
  	return this.text.lastIndexOf(searchstring, start);
  },

  /**
   * Returns the length of this string.
   * @return int the length 
   */
  length: function() {
  	return this.text.length();
  },

  /**
   * Searches for a match between a substring (or regular expression) and the contained string,
   * and replaces the matched substring with a new substring
   * @return this RiString
   */
  replace: function(substr) {
  	this.text = this.text.replace(substr);
  	return this;
  },

  /**
   * Searches for a match between a substring (or regular expression) and the contained string,
   * and returns the matches
   * @return array of string matches or empty array if none are found
   */
  match: function(substr) {
  	return this.text.match(substr);
  },

  /**
   * Extracts a part of a string from this RiString 
   * @param int (Required) The index where to begin the extraction. First character is at index 0
   * @param int (Optional) Where to end the extraction. If omitted, slice() selects all characters from the begin position to the end of the string
   * @return this RiString
   */
  slice: function(begin, end) {
  	this.text = this.text.slice(begin, end);
  	return this;
  },

  /**
   * Replaces each substring of this string that matches the given regular expression with the given replacement.
   * @param string or RegExp object, the pattern to be matched
   * @param string the replacement sequence of char values
   * @return this RiString
   */
  replaceAll: function(pattern, replacement) {
  	this.text = replaceAll(this.text, pattern, replacement);
  	return this;
  },

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
  replaceCharAt: function(idx, replaceWith) {
  	if (idx < 0 || idx >= this.length()) return false;

  	var s = getText();
  	var beg = s.substring(0, idx);
  	var end = s.substring(idx + 1);
  	var s2 = null;
  	if (!isNull(replaceWith)) s2 = beg + replaceWith + end;
  	else s2 = beg + end;

  	setText(s2);

  	return this;
  },

  /**
   * Replaces the first instance of 'regex' with 'replaceWith'
   * @param regex the pattern
   * @param strng the replacement
   * @return this RiString
   */
  replaceFirst: function(regex, replaceWith) {
  	setText(this.text.replaceFirst(regex, replaceWith));
  	return this;
  },

  /**
   * Replaces the word at 'wordIdx' with 'newWord'.
   * @param int the index
   * @param string the word replacement
   * @return this RiString
   */
  replaceWordAt: function(wordIdx, newWord) {
  	var words = getWords();
  	if (wordIdx >= 0 && wordIdx < words.length) {
  		words[wordIdx] = newWord;
  		setText(join(words, SP));
  	}
  	return this;
  },

  /**
   * The split() method is used to split a RiString into an array of sub-RiStrings strings, and returns the new array.
   *
   * @param string (Optional) Specifies the character to use for splitting the string. If omitted, the entire string will be returned
   * @param int (Optional) An integer that specifies the number of splits
   *
   * @return array of RiStrings
   */
  split: function(separator, limit) {
  	var parts = this.text.split(from, to);
  	var rs = [];
  	for (var i = 0; i < parts.length; i++) {
  		if (!isNull(parts[i])) rs.push(parts[i]);
  	}
  	return rs;
  },

  /**
   * Tests if this string starts with the specified prefix.
   * @param (Required) string the prefix 
   * @return boolean true if the character sequence represented by the argument is a prefix of the 
   * character sequence represented by this string; false otherwise. 
   * Note also that true will be returned if the argument is an empty string or is equal to this 
   * RiString object as determined by the equals() method.
   */
  startsWith: function(substr) {
  	return this.indexOf(substr) == 0;
  },

  /**
   * Extracts the characters from this objects contained string, beginning at 'start' and continuing
   *  through the specified number of characters, and sets the current text to be that string.
   *
   * @param int (required) The index where to start the extraction. First character is at index 0
   * @param int (optional) The index where to stop the extraction. If omitted, it extracts the rest of the string
   *
   * @return this RiString
   */
  substr: function(start, length) {
  	this.text = this.text.substr(start, length);
  	return this;
  },

  /**
   * Extracts the characters from a string, between two specified indices, and sets the current text to be that string
   * @param int (required) The index where to start the extraction. First character is at index 0
   * @param int (optional) The index where to stop the extraction. If omitted, it extracts the rest of the string
   * @return this RiString
   */
  substring: function(from, to) {
  	this.text = this.text.substring(from, to);
  	return this;
  },

  /**
   * Converts this object to an array of RiString objects, one per character
   * @return an array of RiStrings with each letter as its own RiString element
   */
  toCharArray: function() {
  	var parts = this.text.split(".");
  	var rs = [];
  	for (var i = 0; i < parts.length; i++) {
  		if (!isNull(parts[i])) rs.push(parts[i]);
  	}
  	return rs;
  },

  /**
   * Converts all of the characters in this RiString to lower case 
   * @return this RiString
   */
  toLowerCase: function() {
  	this.text = this.text.toLowercase();
  	return this;
  },

  /**
   * Returns the contained native string object
   * @return string 
   */
  toString: function() {
  	return this.text;
  },

  /**          
   * Returns true if and only if this string contains the specified sequence of char values.
   * @param string text to be checked
   * @return boolean
   */
  contains: function(string) {
  	return this.indexOf(string) > - 1;
  },

  /**
   * Converts all of the characters in this RiString to upper case 
   * @return this RiString
   */
  toUpperCase: function() {
  	this.text = this.text.toUppercase();
  	return this;
  },

  /**
   * Returns a copy of the string, with leading and trailing whitespace omitted.
   * @return this RiString
   */
  trim: function() {
  	this.text = trim(this.text);
  	return this;
  },

  /**
   * The RiString constructor function
   * @param string the text it will contain
   */
  init: function(text) {
  	this.text = text;
  },

  // should this return a RiString instead?
  /**
   * Returns the character at the given 'index', or empty string if none is found
   * @param int index of the character
   * @return string the character
   */
  charAt: function(index) {
  	return this.text.charAt(index);
  },

  /**
   * Concatenates the text from another RiString at the end of this one
   * @return this RiString
   */
  concat: function(riString) {
  	this.text = this.text.concat(riString.getText());
  	return this;
  }

};

