
var runtests = function() {
	
    QUnit.module("RiTaEvent", {
	    setup: function () {},
	    teardown: function () {}
	});
	
    var functions = [ "source", "type", "isType", "data", "toString" ];

    test("RiTaEvent-functions", function() {

        var rm = new RiTaEvent(this);
        for ( var i = 0; i < functions.length; i++) {
            equal(typeof rm[functions[i]], 'function', functions[i]);
        }

    });

    test("RiTaEvent()", function() {
        
        ok(RiTaEvent(this));
        ok(new RiTaEvent(this));
        ok(RiTaEvent(this, "test"));
        ok(new RiTaEvent(this, "test"));

        throws(function() {
			RiTa.SILENT = 1;
            try {
            	
                new RiTaEvent();
                fail("no exception");
            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT = 0;
        });

        throws(function() {
			RiTa.SILENT = 1;
            try {
                RiTaEvent();
                fail("no exception");
            }
            catch (e) {
                throw e;
            }
            RiTa.SILENT = 0;
        });

        var BAD = [ null, undefined ];

        for ( var i = 0; i < BAD.length; i++) {
            throws(function() {
				RiTa.SILENT = 1;
                try {
                    new RiTaEvent(BAD[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
                RiTa.SILENT = 0;
            }, BAD[i]);
            
            throws(function() {
				RiTa.SILENT = 1;
                try {
                    RiTaEvent(BAD[i]);
                    fail("no exception");
                }
                catch (e) {
                    throw e;
                }
                RiTa.SILENT = 0;
            }, BAD[i]);
        }

    });

    test("RiTaEvent.source()", function() {

        equal(RiTaEvent(this).source(),this);
        equal(new RiTaEvent(this,RiTa.TEXT_TO).source(),this);
        equal(RiTaEvent(this, RiTa.COLOR_TO).source(),this);
        equal(new RiTaEvent(this, RiTa.FADE_OUT).source(),this);
    });
    
    test("RiTaEvent.data()", function() {

		equal(RiTaEvent(this).data(), null);
		equal(RiTaEvent(this,RiTa.TEXT_TO).data(), null);
        equal(RiTaEvent(this,null,this).data(), this);
        equal(new RiTaEvent(this,RiTa.TEXT_TO,this).data(),this);
        equal(RiTaEvent(this, RiTa.COLOR_TO,this).data(),this);
        equal(new RiTaEvent(this, RiTa.FADE_OUT,this).data(),this);
    });

    test("RiTaEvent.type()", function() {

        equal(RiTaEvent(this).type(), RiTa.UNKNOWN);
        equal(new RiTaEvent(this, RiTa.TEXT_TO).type(), RiTa.TEXT_TO);
        equal(RiTaEvent(this, RiTa.COLOR_TO).type(),RiTa.COLOR_TO);
        equal(new RiTaEvent(this, RiTa.FADE_OUT).type(),RiTa.FADE_OUT );
    });
    
    test("RiTaEvent.isType()", function() {

        equal(RiTaEvent(this).isType(RiTa.UNKNOWN), true);
        equal(new RiTaEvent(this, RiTa.TEXT_TO).isType(RiTa.TEXT_TO), true);
        equal(RiTaEvent(this, RiTa.COLOR_TO).isType(RiTa.COLOR_TO), true);
        equal(new RiTaEvent(this, RiTa.FADE_OUT).isType(RiTa.COLOR_TO), false);
    });

    test("RiTaEvent.toString()", function() {
    	
    	ok(RiTaEvent(this).toString()); //TODO: compare to RiTa
	});
}

if (typeof exports != 'undefined') runtests();
