module.exports = function(grunt) {

	// Config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		coffee: {
			compile: {
				options: {
					bare: false
				},
				files: {
					'dist/lc-touch.js': 'src/lc-touch.coffee'
				}
			}
		},

		uglify: {
			options: {
				banner: [
					"/*! ",
					" <%= pkg.name %> v<%= pkg.version %> ",
					" Author: <%= pkg.author %> ",
					" <%= grunt.template.today('yyyy-mm-dd') %> ",
					" */",
					""
				].join(require('os').EOL)
			},

			normal: {
				options: {
					mangle: false,
					beautify: true,
					compress: false,
					wrap: false,
					preserveComments: true
				},

				files: {
					'dist/lc-touch.js': 'dist/lc-touch.js'
				}
			},

			min: {
				options: {
					mangle: false,
					compress: true,
					wrap: true,
					preserveComments: false
				},

				files: {
					'dist/lc-touch.min.js': 'dist/lc-touch.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('build', ['coffee','uglify:normal','uglify:min']);
}
