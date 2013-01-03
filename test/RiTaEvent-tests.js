
var runtests = function() {
	
    QUnit.module("RiTaEvent", {
	    setup: function () {},
	    teardown: function () {}
	});
	
    var functions = [ "getSource", "getType", "toString" ];

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
                }
                catch (e) {
                    throw e;
                }
                RiTa.SILENT = 0;
            }, BAD[i]);
        }

    });

	
    test("RiTaEvent.getSource()", function() {

    	ok(!"Need to use real source types (like RiTaJS))");
        ok(RiTaEvent(this).getSource());
        ok(new RiTaEvent(this).getSource());
        ok(RiTaEvent(this, "test").getSource());
        ok(new RiTaEvent(this, "test").getSource());
    });

    test("RiTaEvent.getType()", function() {

    	ok(!"Need to use real event types (like RiTaJS))");

        ok(RiTaEvent(this).getType());
        ok(new RiTaEvent(this).getType());
        ok(RiTaEvent(this, "test").getType());
        ok(new RiTaEvent(this, "test").getType());
    });

    test("RiTaEvent.toString()", function() {
    	ok(!"Need to verify text-string describing even type (like RiTaJS))");
	});
}

if (typeof exports != 'undefined') exports.unwrap = runtests;