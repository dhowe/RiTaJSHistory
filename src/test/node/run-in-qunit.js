//console.log(module.paths);

var qunit = require('qunit');

var args = process.argv.splice(2);
var testDir = '../../../src/test/';
var codeDir = '../../../src/';

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

    theTests.push(testDir + args[0] + '-tests.js');    
}
else {
    for(var i=0, len=testFiles.length; i < len; i++){
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
        tests: false,
        summary: false,
        globalSummary: true
    }
});

qunit.run({

    deps: [ codeDir+'rita_dict.js', codeDir+'rita_lts.js' ],
    code: codeDir+'rita.js',
    tests: theTests

}, function() {});

