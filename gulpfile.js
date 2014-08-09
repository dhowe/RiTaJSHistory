// NEXT: need to replace ##VERSION## in files in build-dir

/*
var replace = require('gulp-replace');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(replace(/foo(.{3})/g, '$1foo'))
    .pipe(gulp.dest('build/file.txt'));
});

*/

// Configuration options
var testDir = './test/', 
    buildDir = 'build',
    ritaDir = '../';

///////////////////////////////////////////////////////

// Load package.json & plugins
var pjson = require('./package.json'), 
    gulp = require('gulp'),
    exec = require('child_process').exec,
    tasks = require('gulp-task-listing'),
    gutil = require('gulp-util'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    argv = require('yargs').argv,
    symlink = require('gulp-symlink'),
    version = pjson.version;

// Display gulp task
gulp.task('help', tasks);

///////////////////////////////////////////////////////

// Clean the build dir
gulp.task('clean', function () {  

      return gulp.src(buildDir, {read: false})
          .pipe(clean());
});

// Concatenate & minify RiTaJS (4)
gulp.task('build', function() {

    // create micro version (only rita.js minified)
    var tmp = gulp.src('src/rita.js')
        .pipe(concat(pjson.name+'-'+version+'.micro.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir));
        
    // create micro-render version (rita.js + ritext.js minified)
    tmp = gulp.src(['src/rita.js','src/ritext.js'])
        .pipe(concat(pjson.name+'-'+version+'.microp5.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir));

    // create 2 regular versions (all src, & all src minified)
    return tmp && gulp.src('src/*.js')
        .pipe(concat(pjson.name+'-'+version+'.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(rename(pjson.name+'-'+version+'.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir))
});

// Concatenate & minify RiTaJS, no renderer
gulp.task('build.node', function() {

    // TODO: add docs

    gulp.src('README.md')
        .pipe(gulp.dest(buildDir+'/node'));
    gulp.src('AUTHORS')
        .pipe(gulp.dest(buildDir+'/node'));
    gulp.src('package.json')
        .pipe(gulp.dest(buildDir+'/node'));

    return gulp.src('src/rita*.js') // no ritext.js
        .pipe(concat(pjson.name+'-'+version+'-node.js'))
        .pipe(rename(pjson.name+'.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir+'/node/lib'));
});


// Watch Files For Changes
gulp.task('watch', function() {

    gulp.watch('src/*.js', ['lint', 'build', 'build-node']);
});


// Lint Task
gulp.task('lint', function() {

    var opts = { asi: 1, expr: 1, laxbreak: 1, evil: 1 };
    return gulp.src('src/*.js')
        .pipe(jshint(opts))
        .pipe(jshint.reporter('default'));
});


// Test(node): gulp test.node (all) || gulp test.node --name RiString
gulp.task('test.node', function (cb) {

    var tests = ['LibStructure','RiString','RiTa',
            'RiGrammar', 'RiLexicon','RiMarkov','RiTaEvent'],
        cmd =  './node_modules/.bin/qunit -l "{ globalSummary: '+
            'true, errors: true }" -c src/rita.js -d src/rita_lts.js '+
            'src/rita_dict.js -t "test/qunit-helpers.js" '; 

    if (argv.name)  {

        tests = [ argv.name ];

        console.log('Running '+tests[0]);
    }

    for (var i=0,j=tests.length; i<j; i++) {

        var file = testDir + tests[i] + '-tests.js';

        if (!require('fs').existsSync(file))
            throw Error('Unable to load: '+file);

        cmd += file + ' ';
    }

    exec(cmd, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
  });
})


// Test(phantom): gulp test (all) || gulp test --name RiString
gulp.task('test', function() {

    var tests = [ testDir+'LibStructure-tests.html',  testDir+'/Ri*.html']; 
        //'test/UrlLoading-tests.html',

    if (argv.name)  {

        tests = testDir + argv.name+'-tests.html';

        if (!require('fs').existsSync(tests))
            throw Error('Unable to load: '+tests);

        console.log('Running '+tests);
    }

    return gulp.src(tests).pipe(qunit());
});

    
gulp.task('node', ['clean','test.node','build.node','copy-node']);

gulp.task('default', ['help' ]);

