module.exports = function(grunt) {

	grunt.initConfig({
		
		pkg : grunt.file.readJSON('package.json'), // the package file to use

		qunit : {
			all : ['../../test/*.html']
		}
	});

	// load up your plugins
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// register tasks (you should ALWAYS have a "default" task list)
	grunt.registerTask('default', ['qunit']);
}

