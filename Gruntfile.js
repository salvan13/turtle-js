module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        browser: true
      },
      all: ['src/*.js']
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:8001/test/index.html']
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8001,
          base: '.'
        }
      }
    },
    uglify: {
      minify: {
        files: {
          'build/turtle.min.js': ['build/turtle.js']
        }        
      },
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\nhttps://github.com/salvan13/turtle-js */\n'
      }
    },
    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: ['src/requestAnimFrame.js', 'src/engine.js','src/*.js'],
        dest: 'build/turtle.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'connect', 'qunit']);

};
