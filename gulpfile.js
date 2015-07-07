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
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    exec = require('child_process').exec,
    tasks = require('gulp-task-listing'),
    gutil = require('gulp-util'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    argv = require('yargs').argv,
    uglify = require('gulp-uglify'),
    sym = require('gulp-symlink'),
    del = require('del'),
    version = pjson.version;

var bower = 'rita.min.js',
    full = pjson.name + '-' + version + '.js',
    min = pjson.name + '-' + version + '.min.js',
    micro = pjson.name + '-' + version + '.micro.js',
    mbify = pjson.name + '.micro.browserified.js',
    bify = pjson.name + '.browserified.js',
    ritext = 'ritext' + '-' + version + '.js';
    //microp5 = pjson.name + '-' + version + '.microp5.js';

// Display gulp tasks
gulp.task('help', tasks);

///////////////////////////////////////////////////////

// Clean the build dir
gulp.task('clean', function(f) {

        del(buildDir, f);
    });

// create 2 browserify bundles (micro and regular)
gulp.task('build-browserify', ['build.js'], function() {

    var tmp, b = browserify();
    b.transform(reactify);
    b.add(['./dist/rita.micro.js']);
    
    tmp =  b.bundle()
        .pipe(source('rita.micro.js'))
        .pipe(rename(mbify))
        .pipe(gulp.dest('./dist/'));
    
    b = browserify();
    b.transform(reactify);
    b.add(['./dist/rita.min.js']);
    
    return tmp && b.bundle()
        .pipe(source('rita.min.js'))
        .pipe(rename(bify))
        .pipe(gulp.dest('./dist/'));
});



/*
 * publish js to host (red-or-local)
 * link js on host
 * update index.html on host
 * update node

gulp.task('update', function() { // NEEDED?

        if (1) return;

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
    }); */

gulp.task('pub-npm', ['build.node'], function(cb) { // not-ready

        console.log('gulp: npm publish ');

        var tgz = buildDir + '/rita-' + version + '.tgz';
        console.log('npm publish ' + tgz);

        if (1) return;


        exec('npm publish ' + tgz, function(err, stdout, stderr) {

                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
    });

// Concatenate & minify RiTaJS (3) into dist
gulp.task('bower-update', ['clean' ], function() {

        // update version # in bower.json
        return gulp.src(['bower.tmpl'])
            .pipe(replace('##version##', version))
            .pipe(concat('bower.json'))
            .pipe(gulp.dest('.'));
    });

//gulp.task('build.js', gsync.sync(['build.js-pre', 'symlink-min']));

// Concatenate & minify RiTaJS (3) into dist
gulp.task('build-pre.js', [ 'bower-update' ], function() {

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

        // create 2 regular versions -- full, min 
        return tmp && gulp.src('src/rita*.js')
                .pipe(replace('##version##', version))
                .pipe(concat(full))
                .pipe(gulp.dest(buildDir))
                .pipe(rename(min))
                .pipe(uglify())
                .pipe(gulp.dest(buildDir));
    });

gulp.task('build.js', ['build-pre.js'], function() {

        var tmp = gulp.src(buildDir + '/' + micro)
            .pipe(sym(buildDir + '/' + micro.replace('-'+version, '')));
            
        return tmp && gulp.src(buildDir + '/' + min)
            .pipe(sym(buildDir + '/' + min.replace('-'+version, '')));
});

gulp.task('handle-error', ['clean'], function(cb) {

    var combiner = require('stream-combiner2');
    
    var combined = combiner.obj( [
        gulp.src('src/rita*.js'),
            uglify(),
            gulp.dest(buildDir + '/node/rita/lib')
    ] );
    combined.on('error', console.error.bind(console));

    return combined;
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
gulp.task('test', function(cb) {

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
            }, function(err, report) {
                if (err) console.error(err);
            });
    });


// Test(phantom): gulp test (all) || gulp test --name RiString
gulp.task('test.phantom', function() {

        var tests = [testDir + 'LibStructure-tests.html', testDir + '/Ri*.html'];

        if (argv.name) {

            tests = testDir + argv.name + '-tests.html';

            if (!require('fs').existsSync(tests))
                throw Error('Unable to load: ' + tests);

            console.log('Running ' + tests);
        }

        return gulp.src(tests).pipe(qunit({
                    timeout: 20
                }));
    });


//gulp.task('node', [ 'clean','test','build.node','copy-node' ]);

gulp.task('build', ['build.js']); // 'build.node' ]);
gulp.task('default', ['help']);
