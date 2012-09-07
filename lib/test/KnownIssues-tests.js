var runtests = function () {
   
    RiTa.SILENT = 1;
    
    test("RiString.stripPunctuation(unicode)", function () { 
    
        var res = RiTa.stripPunctuation("����������`',;:!?)He,;:!?)([].#l\"\\!@$%&}<>|+$%&}<>|+=-_\\o}<>|+=-_\\/*{^");
        equal(res, "Hello");

    });

    test("RiString.replaceWordAt()", function () { 
    
        var rs = new RiString("Who are you?");
        rs.replaceWordAt(2,"");    // nice! this too...
        //equal(rs.text(), "Who are?"); // strange case, not sure
        equal(rs.text(), "Who are ?");
    });
    
    test("RiText.replaceWordAt()", function () { 
        
        var rs = new RiText("Who are you?");
        rs.replaceWordAt(2,"");    // nice! this too...
        //equal(rs.text(), "Who are?"); // strange case, not sure
        equal(rs.text(), "Who are ?");
    });
   
    test("RiTa.timer()", function () { //TODO: no tests
        
        equal("", RiTa.timer("need tests"));
    });
        
    test("RiTa.p5Compatible()", function () { //TODO: no tests
        
        equal(RiTa.p5Compatible(1), "need more detailed test");
        equal(RiTa.p5Compatible(0), "need more detailed test");
    });
    
    test("RiGrammar.expandWith()", function () { //TODO: fix impl.
        
        equal("fix impl.");
    });
    
     
}

if (typeof exports != 'undefined') exports.unwrap = runtests;