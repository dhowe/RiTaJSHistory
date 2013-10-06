//console.log(module.paths);

// TODO: need to fail when test-files are not found
var qunit = require('qunit'), fs = require('fs');

var args = process.argv.splice(2);
var testDir = '../test/';
var codeDir = '../lib/';

// No RiText*

var testFiles = [
    'RiMarkov',
    'RiGrammar',
    'RiLexicon',
    'RiString',
    'RiTa',
    'RiTaEvent',
    'LibraryStructure',
];

var theTests = [];
if (args.length && testFiles.indexOf(args[0]) > -1) {

    var testNum = 0;
    if (args.length >= 2)  {

        try {
            testNum = parseInt(args[1]);
        }
        catch(e) {
            console.err('Ignoring non-numeric arg: '+arg[1]);
        }
    }
    var theTest = testDir + args[0] + '-tests.js';    
    //if (testNum) theTest += '&testNumber='+testNum;
    theTests.push(theTest);
}
else {
    for(var i=0, len=testFiles.length; i < len; i++){
        theTests.push(testDir + testFiles[i]+'-tests.js');    
    }
}


console.log('\nLoading tests:');
for(var i=0, len=theTests.length; i < len; i++) {
   if (!fs.existsSync(theTests[i]))
       throw Error("Test not found: "+theTests[i]);
    console.log(theTests[i]);
}
console.log('\n');

qunit.setup({
    log: { 
        assertions: false,
        errors: true,
        tests: false,
        summary: false,
        globalSummary: true
    }
});

qunit.run({
    //deps: [ codeDir+'rita_dict.js', codeDir+'rita_lts.js' ],
    code: codeDir+'rita.js',
    testNum: testNum, // added DCH
    tests: theTests

}, function() {});

