// Configuration options
var testDir = './test/', 
    buildDir = 'dist',
    ritaDir = '../',
    tmpDir = '/tmp';
 
///////////////////////////////////////////////////////

// Load package.json & plugins
var pjson = require('./package.json'), 
	
    gulp = require('gulp'),
    scp = require('gulp-scp')
    exec = require('child_process').exec,
    tasks = require('gulp-task-listing'),
    gutil = require('gulp-util'),
    qunit = require('gulp-qunit'), 	
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    argv = require('yargs').argv,
    sym = require('gulp-symlink'),
    version = pjson.version;

var full = pjson.name+'-'+version+'.js';
	min = pjson.name+'-'+version+'.min.js';
	micro = pjson.name+'-'+version+'.micro.js';
	microp5 = pjson.name+'-'+version+'.microp5.js';

// Display gulp task
gulp.task('help', tasks);

///////////////////////////////////////////////////////

// Clean the build dir
gulp.task('clean', function () {  

	return gulp.src(buildDir, { read: false })
          .pipe(clean());
});

// Create links to each 'latest'
gulp.task('symlink', function () {  

	gulp.src(buildDir + '/' + full)
		.pipe(sym(buildDir + '/' + full.replace(version, 'latest')));
	gulp.src(buildDir + '/' + min)
		.pipe(sym(buildDir + '/' + min.replace(version, 'latest')));
	gulp.src(buildDir + '/' + micro)
		.pipe(sym(buildDir + '/' + micro.replace(version, 'latest')));
	gulp.src(buildDir + '/' + microp5)
		.pipe(sym(buildDir + '/' + microp5.replace(version, 'latest'))); 
});

/*
 * publish js to host (rednoise-or-local)
 * link js on host
 * update index.html on host
 * update node
 * update bower
 */
gulp.task('update', function() { // DO WE WANT THIS?

	return;
	
	var host =  argv.host ? argv.host : 'localhost';
	var port = host === 'localhost' ? 22022 : 22;
	
    console.log('Publishing to '+host);

	// publish (4) js files to www/rita/download
	gulp.src(buildDir+'/rita-'+version+'*.js')
		.pipe(scp({
            host: host,
            path: '~/www/rita/download',	
            user: process.env.USER,
            port: port
		}));
    
	// publish new www/rita/download/index.html with version#	
	gulp.src(ritaDir+'/www/download/index.html')
		.pipe(replace('##version##', version))
		.pipe(gulp.dest(tmpDir))
		.pipe(scp({
            host: host,
            path: '~/www/rita/download',	
            user: process.env.USER,
            port: port
		}));
});

gulp.task('pub.node', function(cb) {
	
	var tgz = buildDir + '/rita-'+version+'.tgz';
	console.log('npm publish '+tgz);
	
	exec('npm publish '+tgz, function (err, stdout, stderr) {
		
	    console.log(stdout);
        console.log(stderr);
        cb(err);
	});

});

// Concatenate & minify RiTaJS (4)
gulp.task('build.js', ['clean'], function() {

    // create micro version (only rita.js minified)
    var tmp = gulp.src('src/rita.js')
    	.pipe(replace('##version##', version))
        .pipe(concat(pjson.name+'-'+version+'.micro.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir));
        
    // create micro-render version (rita.js + ritext.js minified)
    tmp = gulp.src(['src/rita.js','src/ritext.js'])
    	.pipe(replace('##version##', version))
        .pipe(concat(pjson.name+'-'+version+'.microp5.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir));

    // create 2 regular versions (all src, & all src minified)
    return tmp && gulp.src('src/*.js')
    	.pipe(replace('##version##', version))
        .pipe(concat(pjson.name+'-'+version+'.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(rename(pjson.name+'-'+version+'.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir))
});

// Concatenate & minify RiTaJS, no renderer
gulp.task('build.node', ['clean'], function(cb) {

	// copy in the node readme
    gulp.src('./README.node.md')
    	.pipe(rename('README.md'))
        .pipe(gulp.dest(buildDir+'/node/rita'));
        
     
     // copy in other loose files
    gulp.src(['./AUTHORS', './package.json', './gulpfile.js'])
        .pipe(gulp.dest(buildDir+'/node/rita'));
    
    // copy in the tests    
	gulp.src([testDir+'LibStructure*.*',  testDir+'/Ri*.*', testDir+'/qunit*'])
		//.pipe(gulpIgnore.exclude("KnownIssues*"))
        .pipe(gulp.dest(buildDir+'/node/rita/test'));
    
    // copy in the docs
    gulp.src(ritaDir+'/www/reference/**/*')
    	.pipe(gulp.dest(buildDir+'/node/rita/doc'));
    	
    // copy in rita.js (min)
    gulp.src('src/ri*.js') // remove ritext.js when renderers are sorted 
    	.pipe(replace('##version##', version))
        .pipe(concat(pjson.name+'-'+version+'-node.js'))
        .pipe(rename(pjson.name+'.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir+'/node/rita/lib'));
  
  /* FAILING (tgz is incomplete)
   * 
   
  	// call npm pack & move the .tgz to build
	exec("npm pack build/node/rita", function (err, stdout, stderr) {
		
        console.log(stdout);
//         
        // gulp.src('./rita-'+version+'.tgz')
			// .pipe(gulp.dest(buildDir));
// 		
		// gulp.src('./rita-'+version+'.tgz')
			// .pipe(clean());
// 			
        console.log(stderr);
        cb(err);
	});
*/
});


// Watch Files For Changes
gulp.task('watch-src', function() {

    gulp.watch('src/*.js', ['lint', 'build', 'build-node']);
});


// Lint Task
gulp.task('lint', function() {

    var opts = { asi: 1, expr: 1, laxbreak: 1 };
    return gulp.src('src/*.js')
        .pipe(jshint(opts))
        .pipe(jshint.reporter('default'));
});


// Test(node): gulp test.node (all) || gulp test.node --name RiString
gulp.task('test.node', function(cb) {

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

gulp.task('test.node.pkg', function(cb) { // for testing an npm install ('npm rita test')

    var tests = ['LibStructure','RiString','RiTa',
            'RiGrammar', 'RiLexicon','RiMarkov','RiTaEvent'],
        cmd =  './node_modules/.bin/qunit -l "{ globalSummary: '+
            'true, errors: true }" -c lib/rita.js -t "test/qunit-helpers.js" '; 

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

    if (argv.name)  {

        tests = testDir + argv.name+'-tests.html';

        if (!require('fs').existsSync(tests))
            throw Error('Unable to load: '+tests);

        console.log('Running '+tests);
    }

    return gulp.src(tests).pipe(qunit());
});

    
//gulp.task('node', [ 'clean','test.node','build.node','copy-node' ]);

gulp.task('build', [ 'build.js', 'build.node' ]);
gulp.task('default', [ 'help' ]);

