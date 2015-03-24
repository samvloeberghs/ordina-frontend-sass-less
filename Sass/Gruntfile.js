'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    dist: 'dist',

    sass: {
      dist: {
        options: {
          outputStyle: 'extended'
        },
        files: {
          '<%= app %>/css/app.css': '<%= app %>/scss/app.scss'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= app %>/js/**/*.js'
      ]
    },

    clean: {
      dist: {
        src: ['<%= dist %>/*']
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app %>/',
          src: [
            'fonts/**', '**/*.html',
            '!**/*.scss',
            '!bower_components/**'
          ],
          dest: '<%= dist %>/'
        }]
      }
    },

    imagemin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= app %>/images/',
          src: ['**/*.{jpg,gif,svg,jpeg,png}'],
          dest: '<%= dist %>/images/'
        }]
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: false
      }
    },

    useminPrepare: {
      html: [
        '<%= app %>/index.html'
      ],
      options: {
        dest: '<%= dist %>'
      }
    },

    usemin: {
      html: [
        '<%= dist %>/**/*.html',
        '!<%= app %>/bower_components/**'
      ],
      css: [
        '<%= dist %>/css/**/*.css'
      ],
      options: {
        dirs: [
          '<%= dist %>'
        ]
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['sass']
      },
      sass: {
        files: '<%= app %>/scss/**/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: [
          '<%= app %>/**/*.html',
          '<%= app %>/js/**/*.js',
          '<%= app %>/css/**/*.css',
          '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}',
          '!<%= app %>/bower_components/**'
        ],
        options: {
          livereload: 11001
        }
      }
    },

    connect: {
      app: {
        options: {
          port: 10000,
          base: '<%= app %>/',
          open: true,
          livereload: 11001,
          hostname: '127.0.0.1'
        }
      },
      dist: {
        options: {
          port: 10001,
          base: '<%= dist %>/',
          open: true,
          keepalive: true,
          livereload: false,
          hostname: '127.0.0.1'
        }
      }
    }

  });

  grunt.registerTask('compile-sass', ['sass']);
  grunt.registerTask('validate-js', ['jshint']);
  grunt.registerTask('server-dist', ['connect:dist']);

  grunt.registerTask('default', [
    'compile-sass',
    'connect:app',
    'watch'
  ]);

  grunt.registerTask('publish', [
    'compile-sass',
    'clean:dist',
    'validate-js',
    'useminPrepare',
    'copy:dist',
    'newer:imagemin',
    'concat',
    'cssmin',
    'uglify',
    'usemin'
  ]);

};
