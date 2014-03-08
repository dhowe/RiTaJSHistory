//console.log(module.paths);

var qunit = require('qunit');
require('request');
require('fs');

var args = process.argv.splice(2);
var testDir = '../test/';
var codeDir = '../src/';

// No RiText*
var testFiles = [

    'RiGrammar',
    'RiLexicon',
    'RiString',
    'RiTa',
    'RiTaEvent',
    'LibraryStructure',
    'RiMarkov'
];

var theTests = [];
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

    // add the paths
    for (var i=0, len=testFiles.length; i < len; i++){
        theTests.push(testDir + testFiles[i]+'-tests.js');    
    }
}

console.log('\nLoading tests from:');
console.log(theTests+"\n");

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
    deps: [ codeDir+'rita_dict.js', codeDir+'rita_lts.js' ],
    code: codeDir+'rita.js',
    testNum: testNum, // added DCH
    tests: theTests

}, function() { console.log("Done"); });

