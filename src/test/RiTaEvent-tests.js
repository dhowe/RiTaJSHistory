
var runtests = function() {
    
    RiTa.SILENT = 1;
    
    var functions = [ "getSource", "getType" ];

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

            try {
                new RiTaEvent();
            }
            catch (e) {
                throw e;
            }
        });

        throws(function() {

            try {
                RiTaEvent();
            }
            catch (e) {
                throw e;
            }
        });

        var BAD = [ null, undefined ];

        for ( var i = 0; i < BAD.length; i++) {
            throws(function() {

                try {
                    new RiTaEvent(BAD[i]);
                }
                catch (e) {
                    throw e;
                }
            }, BAD[i]);
            throws(function() {

                try {
                    RiTaEvent(BAD[i]);
                }
                catch (e) {
                    throw e;
                }
            }, BAD[i]);
        }

    });

    test("RiTaEvent.getSource()", function() {

        ok(RiTaEvent(this).getSource());
        ok(new RiTaEvent(this).getSource());
        ok(RiTaEvent(this, "test").getSource());
        ok(new RiTaEvent(this, "test").getSource());
    });

    test("RiTaEvent.getType()", function() {

        ok(RiTaEvent(this).getType());
        ok(new RiTaEvent(this).getType());
        ok(RiTaEvent(this, "test").getType());
        ok(new RiTaEvent(this, "test").getType());
    });

}

if (typeof exports != 'undefined') exports.unwrap = runtests;