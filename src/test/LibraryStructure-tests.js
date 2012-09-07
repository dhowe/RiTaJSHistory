var runtests = function() {
    
    RiTa.SILENT = 1;
    
    // NOTE: Instances of RiLexicon & RiText are not available on this page

    test("Public Objects", function() {

        ok(RiTa.VERSION > 0);
        ok(typeof RiTa != 'undefined');
        ok(typeof RiString != 'undefined');
        ok(typeof RiLexicon != 'undefined');
        ok(typeof RiGrammar != 'undefined');
        ok(typeof RiMarkov != 'undefined');
        ok(typeof RiTaEvent != 'undefined');
        if (typeof window != 'undefined') {
            ok(typeof RiText != 'undefined');
        }
    });

    test("Private Statics", function() {

        if (typeof window != 'undefined') {
            equal(typeof RiText._handleLeading, 'function');
            equal(typeof RiText._disposeOne, 'function');
        }
        equal(typeof _wordOffsetFor, 'undefined');
        equal(typeof _handleLeading, 'undefined');
        equal(typeof _disposeOne, 'undefined');

    });

    test("Member Functions", function() {

        var rx = new RiString("hello");
        equal(typeof rx.charAt, 'function');
        var rs = RiString("hello");
        equal(typeof rs.charAt, 'function');
        var rg = RiMarkov(3);
        equal(typeof rg.loadTokens, 'function');
        var rg = new RiMarkov(2);
        equal(typeof rg.loadTokens, 'function');
    });

    test("Member Variables", function() {

        ok(RiString("x").text);
        ok(new RiString("x").text);
        ok(RiGrammar()._rules);
        ok(new RiGrammar()._rules);
    });

    test("Public Statics", function() {

        equal(typeof RiTa.splitSentences, 'function');
        equal(typeof RiTa.getPhonemes, 'function');
        equal(typeof RiTa.timer, 'function');
        equal(typeof RiTa.random, 'function');

        if (typeof window != 'undefined') {
            
            equal(typeof RiText.random, 'function');
            equal(typeof RiText.timer, 'function');
        }
    });

    test("Public Constants", function() {

        ok(RiTa.VERSION);
        ok(RiTa.PRESENT_TENSE);
        ok(RiTa.SECOND_PERSON);
        ok(RiGrammar.START_RULE);
    });

    test("Internal Classes", function() {

        equal(typeof Type, 'undefined', 'Type');
        equal(typeof Conjugator, 'undefined', 'Conjugator');
        equal(typeof MinEditDist, 'undefined', 'MinEditDist');
        equal(typeof PosTagger, 'undefined', 'PosTagger');
        equal(typeof RegexRule, 'undefined', 'RegexRule');
        equal(typeof Easing, 'undefined', 'Easing');
        equal(typeof Interpolation, 'undefined', 'Interpolation');
        equal(typeof TextBehavior, 'undefined', 'TextBehavior');
        equal(typeof RiText_Canvas, 'undefined', 'RiText_Canvas');
        equal(typeof RiText_P5, 'undefined', 'RiText_P5');
    });

    test("Private Constants", function() {

        equal(typeof SP, 'undefined');
        equal(typeof A, 'undefined');
        equal(typeof SECOND_PERSON, 'undefined');
        equal(typeof PLURAL_RULES, 'undefined');
        equal(typeof PAST_PARTICIPLE_RULESET, 'undefined');
    });

    test("Constructors", function() {

        equal(typeof RiString, 'function'); // pub
        equal(typeof RiGrammar, 'function');
        equal(typeof RiLexicon, 'function');
        
        notEqual(typeof RiTa, 'function'); // prv

        var rx = new RiString("hello");
        equal(typeof rx, 'object');

        var rs = RiString("hello");
        equal(typeof rx, 'object');

        var lr = RiGrammar();
        equal(typeof lr, 'object'); 

        var lg = new RiGrammar();
        equal(typeof lg, 'object');
        
        if (typeof window != 'undefined') {
            
            equal(typeof RiText, 'function');

        }

        throws(function() {

            try {
                new RiTa();
            }
            catch (e) {
                throw Error("no constructor");
            }
        });

        throws(function() {

            try {
                RiTa();
            }
            catch (e) {
                throw Error("no constructor");
            }
        });
    });

    test("Private Functions", function() {

        equal(typeof startsWith, 'undefined');
        equal(typeof isNull, 'undefined');
        equal(typeof makeClass, 'undefined');
        equal(typeof handleLeading, 'undefined');
        equal(typeof disposeOne, 'undefined');
    });

}

if (typeof exports != 'undefined') exports.unwrap = runtests;