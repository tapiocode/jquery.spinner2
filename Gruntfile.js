/* global module:false */
/* global require */
module.exports = function(grunt) {

  grunt.initConfig({
    devDir: 'dev',    // Development files
    distDir: 'dist',  // Distribution files
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      // By default, opens a server on http://localhost:8000
      server: {}
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= devDir %>',
          cssDir: '<%= devDir %>',
          imagesDir: '<%= devDir %>',
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
        src: ['<%= devDir %>/<%= pkg.name %>.js']
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= distDir %>/<%= pkg.name %>.min.js': '<%= devDir %>/<%= pkg.name %>.js'
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= distDir %>/<%= pkg.name %>.min.css': '<%= devDir %>/<%= pkg.name %>.css'
        }
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: '<%= devDir %>',
        src: '*.png',
        dest: '<%= distDir %>'
      }
    },
    watch: {
      options: {
        // Using Chrome LiveReload extension 
        livereload: true
      },
      sass: {
        files: ['**/*.scss'],
        tasks: ['compass', 'cssmin']
      },
      js: {
        files: [
          '<%= devDir %>/**.js',
          '!<%= devDir %>/**.min.js'
        ],
        tasks: ['jshint', 'uglify']
      },
      html: {
        files: ['index.html']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['connect', 'watch']);

  grunt.registerTask('build', ['jshint', 'uglify', 'compass', 'cssmin', 'copy']);

};
