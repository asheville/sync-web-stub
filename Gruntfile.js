require('dotenv').config();

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
      buildDev: {
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
      },
      buildProd: {
        options: {
          patterns: [{
            match: 'SYNC_WEB_SERVER_HOST',
            replacement: process.env.SYNC_WEB_STUB_DEPLOY_SERVER_HOST
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
    },
    rsync: {
      deploy: {
        options: {
          exclude: [
            '.DS_Store',
            '.git',
            'node_modules',
            '*.sublime*',
            '*.env'
          ],
          recursive: true,
          src: './',
          dest: process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR,
          host: process.env.SYNC_WEB_STUB_DEPLOY_HOST_USERNAME + '@' + process.env.SYNC_WEB_STUB_DEPLOY_HOST
        }
      }
    },
    sshexec: {
      options: {
        host: process.env.SYNC_WEB_STUB_DEPLOY_HOST,
        port: 22,
        username: process.env.SYNC_WEB_STUB_DEPLOY_HOST_USERNAME,
        agent: process.env.SSH_AUTH_SOCK
      },
      npmInstall: {
        command: 'cd ' + process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + ' && npm install --production'
      },
      foreverRestartAll: {
        command: 'cd ' + process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + ' && forever restart server.js'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Build app from source files for dev environment
  grunt.registerTask('buildDev', [
    'clean:build',
    'copy:build',
    'replace:buildDev'
  ]);

  // Build app from source files for production environment
  grunt.registerTask('buildProd', [
    'clean:build',
    'copy:build',
    'replace:buildProd'
  ]);

  // Build app and run local web server for development
  grunt.registerTask('dev', [
    'buildDev',
    'concurrent:build'
  ]);

  // Deploy to host
  grunt.registerTask('deploy', [
    'buildProd',
    'rsync:deploy',
    'sshexec:npmInstall',
    'sshexec:foreverRestartAll'
  ]);
};