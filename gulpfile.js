var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;


gulp.task('js', function() {
  return browserify('./src/index.js')
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist/'));
});

// Test(node): gulp test.node (all) || gulp test.node --name RiString
gulp.task('test', function(cb) {

  var testrunner = require("qunit");

  var tests = [
    'test/LibStructure-tests',
    //'test/RiTaEvent-tests',
    //'test/RiString-tests',
    'test/RiTa-tests',
  //  'test/RiGrammar-tests',
    //'test/RiMarkov-tests',
  //  'test/RiLexicon-tests',
  //  'test/UrlLoading-tests'
  ];

  if (argv.name) {

    tests = [testDir + argv.name + '-tests'];
    console.log('[INFO] Testing ' + tests[0]);
  }

  testrunner.setup({
    maxBlockDuration: 20000,
    log: {
      globalSummary: true,
      errors: true
    }
  });

  testrunner.run({
    code: "src/rita.js",
    deps: [
      "src/rita_lts.js",
      "src/rita_dict.js",
      "test/qunit-helpers.js"
    ],
    tests: tests
  },
  function(err, report) {
    if (err) console.error(err);
  });
});
