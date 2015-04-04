
var runtests = function() {
	
    QUnit.module("RiWordNet", {
	    setup: function () {},
	    teardown: function () {}
	});
	
    test("RiWordNet()", function() {

        throws(function() {
			RiTa.SILENT = 1;
            try {
                var rw = RiWordNet();
                console.log(rw);
                fail("no exception");
            }
            catch (e) {
            	ok(e.message === 'RiWordNet is not yet implemented in JavaScript!');
                throw e;
            }
            RiTa.SILENT = 0;
        });
    });
};

if (typeof exports != 'undefined') runtests();
