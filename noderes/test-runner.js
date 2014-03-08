console.log("module.paths="+module.paths);
console.log("process.cwd="+process.cwd());

var qunit = require('qunit'), args = process.argv.splice(2), testDir = 'test/', codeDir = 'lib/';

// No RiText*
var theTests = [], testFiles = [
    'RiMarkov',
    'RiGrammar',
    'RiLexicon',
    'RiString',
    'RiTa',
    'RiTaEvent',
    'LibraryStructure',
];

if (args.length && testFiles.indexOf(args[0]) > -1) {

    var testNum = 0;
    if (args.length >= 2)  {

        try {
            testNum = parseInt(args[1]);
            console.log("Test # "+testNum);
        }
        catch(e) {
            console.err('Ignoring non-numeric arg: '+arg[1]);
        }
    }
    var theTest = testDir + args[0] + '-tests.js';    
    theTests.push(theTest);
}
else {

    for (var i=0, len=testFiles.length; i < len; i++){
        theTests.push(testDir + testFiles[i]+'-tests.js');    
    }
}

console.log('\nLoading tests from:');
console.log(theTests);
console.log('\n');

qunit.setup({
    log: { 
        assertions: false,
        errors: true,
        tests: true,
        summary: false,
        globalSummary: true
    }
});

qunit.run({
    code: codeDir+'rita.js',
    testNum: testNum, // added DCH
    tests: theTests

}, function() { console.log("ok"); });

