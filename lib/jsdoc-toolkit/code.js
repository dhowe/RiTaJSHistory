/**
 * Pluralizes a word according to pluralization rules (see regexs)
 */
var RiTa = function(str)  {
    this.x = 100;
    this.y = 100;
    this.text = str;
}

            /**
             * Pluralizes a word according to pluralization rules (see regexs)
             * @param string the verb to be pluralized
             */
RiTa.prototype.pluralize = function(word) {

                if (isNull(word) || !word.length) return E;

                var i, rule, result, rules = RC.PLURAL_RULES;

                if (inArray(RC.MODALS, word.toLowerCase())) {
                    return word;
                }

                i = rules.length;
                while (i--) {
                    rule = rules[i];
                    if (rule.applies(word.toLowerCase())) {
                        return rule.fire(word);
                    }
                }

                return RC.DEFAULT_PLURAL_RULE.fire(word);
            };
            
            /**
             * Removes blank space from either side of 'str'
             * @param string to be trimmed
             */ 
RiTa.prototype.trim = function(str) {
                if (isNull(str)) return "";
                return trim(str); // delegate to private
            };

            /**
             * Tokenizes the string according to Penn Treebank conventions
             * @param string (consisting of multiple words) to be tokenized
             */
RiTa.prototype.tokenize = function(words) {
                
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

                if (RC.SPLIT_CONTRACTIONS) {
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
            }
};
