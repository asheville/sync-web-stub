module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    concurrent: {
      build: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    clean: {
      build: ['build']
    },
    copy: {
      build: {
        expand: true,
        cwd: 'app/',
        src: '**',
        dest: 'build/'
      }
    },
    replace: {
      build: {
        options: {
          patterns: [{
            match: 'SYNC_WEB_SERVER_HOST',
            replacement: process.env.SYNC_WEB_STUB_SERVER_HOST
          }]
        },
        files: [{
          src: 'build/assets/scripts.js',
          dest: 'build/assets/scripts.js'
        }]
      }
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    watch: {
      build: {
        files: ['app/*'],
        tasks: ['build']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Build app from source files
  grunt.registerTask('build', [
    'clean:build',
    'copy:build',
    'replace:build'
  ]);

  // Build app and run local web server for development
  grunt.registerTask('dev', [
    'build',
    'concurrent:build'
  ]);
};