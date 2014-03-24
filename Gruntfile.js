/* global module:false */
/* global require */
module.exports = function(grunt) {

  grunt.initConfig({
    loc: {
      dev: 'dev',
      prod: 'dist'
    },
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      // By default, opens a server on http://localhost:8000
      server: {}
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= loc.dev %>',
          cssDir: '<%= loc.prod %>',
          imagesDir: '<%= loc.dev %>',
          httpImagesPath: '<%= loc.prod %>',
          httpGeneratedImagesPath: '/<%= loc.prod %>',
          outputStyle: 'compressed',
          force: true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dev: {
        src: [ '<%= loc.dev %>/<%= pkg.name %>.js' ]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= loc.prod %>/<%= pkg.name %>.min.js': '<%= loc.dev %>/<%= pkg.name %>.js'
        }
      }
    },
    watch: {
      options: {
        // Using Chrome LiveReload extension 
        livereload: true
      },
      sass: {
        files: ['**/*.scss'],
        tasks: ['compass']
      },
      js: {
        files: ['<%= loc.dev %>/**.js'],
        tasks: ['jshint', 'uglify']
      },
      html: {
        files: ['index.html']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['connect', 'watch']);

};
