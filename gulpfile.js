/*jslint node: true*/

// Configuration options
var testDir = './test/',
    buildDir = 'dist',
    ritaDir = '../RiTa',
    tmpDir = '/tmp';

///////////////////////////////////////////////////////

// Load package.json & plugins
var pjson = require('./package.json'),
    gulp = require('gulp'),
    scp = require('gulp-scp'),
    exec = require('child_process').exec,
    tasks = require('gulp-task-listing'),
    gutil = require('gulp-util'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    argv = require('yargs').argv,
    sym = require('gulp-symlink'),
    del = require('del'),
    version = pjson.version;

var bower = 'rita.min.js',
    full = pjson.name + '-' + version + '.js',
    min = pjson.name + '-' + version + '.min.js',
    micro = pjson.name + '-' + version + '.micro.js',
    ritext = 'ritext' + '-' + version + '.js';
    //microp5 = pjson.name + '-' + version + '.microp5.js';

// Display gulp task
gulp.task('help', tasks);

///////////////////////////////////////////////////////

// Clean the build dir
gulp.task('clean', function(f) {

        del(buildDir, f);
    });

// Create links to each 'latest'
gulp.task('symlink', function() {

    return;

        gulp.src(buildDir + '/' + full)
            .pipe(sym(buildDir + '/' + full.replace(version, 'latest')));
        gulp.src(buildDir + '/' + min)
            .pipe(sym(buildDir + '/' + min.replace(version, 'latest')));
        gulp.src(buildDir + '/' + micro)
            .pipe(sym(buildDir + '/' + micro.replace(version, 'latest')));
        //gulp.src(buildDir + '/' + microp5)
         //   .pipe(sym(buildDir + '/' + microp5.replace(version, 'latest')));
    });

/*
 * publish js to host (red-or-local)
 * link js on host
 * update index.html on host
 * update node
 */
gulp.task('update', function() { // NEEDED?

        return;

        var host = argv.host ? argv.host : 'localhost';
        var port = host === 'localhost' ? 22022 : 22;

        console.log('Publishing to ' + host);

        // publish (4) js files to www/rita/download
        gulp.src(buildDir + '/rita-' + version + '*.js')
            .pipe(scp({
                    host: host,
                    path: '~/www/rita/download',
                    user: process.env.USER,
                    port: port
                }));

        // publish new www/rita/download/index.html with version#	
        gulp.src(ritaDir + '/www/download/index.html')
            .pipe(replace('##version##', version))
            .pipe(gulp.dest(tmpDir))
            .pipe(scp({
                    host: host,
                    path: '~/www/rita/download',
                    user: process.env.USER,
                    port: port
                }));
    });

gulp.task('pub.npm', ['build.node'], function(cb) {

        console.log('gulp: npm publish ');

        var tgz = buildDir + '/rita-' + version + '.tgz';
        console.log('npm publish ' + tgz);
return;
        exec('npm publish ' + tgz, function(err, stdout, stderr) {

                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
    });

// Concatenate & minify RiTaJS (3) into dist
gulp.task('build.bower', ['clean'], function() {

        var tmp = gulp.src('src/rita*.js')
            .pipe(replace('##version##', version))
            .pipe(concat(bower))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir))

        // update version # in bower.json
        return tmp && gulp.src(['bower.tmpl'])
            .pipe(replace('##version##', version))
            .pipe(concat('bower.json'))
            .pipe(gulp.dest('.'));
    });

// Concatenate & minify RiTaJS (3) into dist
gulp.task('build.js', ['build.bower'], function() {

        // create micro version (only rita.js minified)
        var tmp = gulp.src('src/rita.js')
            .pipe(replace('##version##', version))
            .pipe(concat(micro))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir));

        // create ritext version 
        tmp = tmp && gulp.src('src/ritext.js')
            .pipe(concat(ritext))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir));

        // create 3 regular versions -- full, min & bower(a copy of min)
        if (tmp) return gulp.src('src/rita*.js')
            .pipe(replace('##version##', version))
            .pipe(concat(full))
            .pipe(gulp.dest(buildDir))
            .pipe(rename(min))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir))
    });

// Concatenate & minify RiTaJS + node pkg resources, into dist
gulp.task('build.node', ['clean'], function(cb) {

        // copy in the node readme
        gulp.src('./README.node.md')
            .pipe(rename('README.md'))
            .pipe(gulp.dest(buildDir + '/node/rita'));

        // copy in other loose files
        gulp.src(['./AUTHORS', './LICENSE', './package.json', './gulpfile.js'])
            .pipe(gulp.dest(buildDir + '/node/rita'));

        // copy in the tests    
        gulp.src([testDir + 'LibStructure*.*', testDir + '/Ri*.*', testDir + '/qunit*'])
        //.pipe(gulpIgnore.exclude("KnownIssues*"))
        .pipe(gulp.dest(buildDir + '/node/rita/test'));

        // copy in the docs
        //gulp.src(ritaDir + '/www/reference/**/*')
            //.pipe(gulp.dest(buildDir + '/node/rita/doc'));

        // copy in rita.js (min)
        gulp.src('src/rita*.js')
            .pipe(replace('##version##', version))
            .pipe(concat(pjson.name + '-' + version + '-node.js'))
            .pipe(rename(pjson.name + '.js'))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir + '/node/rita/lib'));

        /* FAILING (tgz is incomplete) */
   
      	// call npm pack & move the .tgz to build
    	/*exec("cd build/node/rita; npm pack", function (err, stdout, stderr) {
    		
            console.log(stdout);
            gulp.src('./rita-'+version+'.tgz')
                .pipe(clean());
            gulp.src('./rita-'+version+'.tgz')
                .pipe(gulp.dest(buildDir));
            console.log(stderr);
            cb(err);
        });*/
    });


// Watch Files For Changes
gulp.task('watch-src', function() {

        gulp.watch('src/*.js', ['lint', 'build', 'build-node']);
    });


// Lint Task
gulp.task('lint', function() {

        var opts = {
            asi: 1,
            expr: 1,
            laxbreak: 1
        };
        return gulp.src('src/*.js')
            .pipe(jshint(opts))
            .pipe(jshint.reporter('default'));
    });

// Test(node): gulp test.node (all) || gulp test.node --name RiString
gulp.task('test.node.pkg', function(cb) {

        var testrunner = require("qunit");

        var tests = [
            'test/LibStructure-tests',
            'test/RiTaEvent-tests',
            'test/RiString-tests',
            'test/RiTa-tests',
            //'test/RiGrammar-tests',
            // TODO: figure out why this one test fails
            'test/RiMarkov-tests',
            'test/RiLexicon-tests'
        ];

        if (argv.name) {

            tests = [ testDir + argv.name + '-tests'];
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
                code: "lib/rita.js",
                deps: [
                    "test/qunit-helpers.js"
                ],
                tests: tests
            }, function(err, report) {
                if (err) console.error(err);
            });
    });

// Test(node): gulp test.node (all) || gulp test.node --name RiString
gulp.task('test.node', function(cb) {

        var testrunner = require("qunit");

        var tests = [
            'test/LibStructure-tests',
            'test/RiTaEvent-tests',
            'test/RiString-tests',
            'test/RiTa-tests',
            'test/RiGrammar-tests',
            'test/RiMarkov-tests',
            'test/RiLexicon-tests'
        ];

        if (argv.name) {

            tests = [ testDir + argv.name + '-tests'];
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
            }, function(err, report) {
                if (err) console.error(err);
            });
    });


// Test(phantom): gulp test (all) || gulp test --name RiString
gulp.task('test', function() {

        var tests = [ testDir + 'LibStructure-tests.html', testDir + '/Ri*.html' ];

        if (argv.name) {

            tests = testDir + argv.name + '-tests.html';

            if (!require('fs').existsSync(tests))
                throw Error('Unable to load: ' + tests);

            console.log('Running ' + tests);
        }
    
        return gulp.src(tests).pipe(qunit({ timeout: 20 }));
    });


//gulp.task('node', [ 'clean','test.node','build.node','copy-node' ]);

gulp.task('build', ['build.js']); // 'build.node' ]);
gulp.task('default', ['help']);
