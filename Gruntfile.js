require('./lib/env');

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
    },
    rsync: {
      options: {
        args: ['--rsync-path="mkdir -p ' + process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + ' && rsync"'],
        host: process.env.SYNC_WEB_STUB_DEPLOY_HOST_USERNAME + '@' + process.env.SYNC_WEB_STUB_DEPLOY_HOST,
        recursive: true
      },
      app: {
        options: {
          exclude: [
            '.DS_Store',
            '.git',
            'node_modules',
            '*.sublime*',
            '.certs*',
            '.env*',
            'build'
          ],
          src: './',
          dest: process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR
        }
      },
      certs: {
        options: {
          src: process.env.SYNC_WEB_STUB_DEPLOY_CERTS_DIR + '/',
          dest: process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + '/.certs/'
        }
      },
      env: {
        options: {
          src: '.env-deploy',
          dest: process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + '/.env'
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
        command: 'cd ' + process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + ' && npm install'
      },
      build: {
        command: 'cd ' + process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + ' && grunt build'
      },
      forever: {
        command: 'cd ' + process.env.SYNC_WEB_STUB_DEPLOY_HOST_DIR + ' && forever restart server.js || forever start server.js'
      },
      systemd: {
        command: 'systemctl restart syncwebstub || systemctl start syncwebstub'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', 'Build app from source files', [
    'clean:build',
    'copy:build',
    'replace:build'
  ]);

  grunt.registerTask('dev', 'Build app and run local web server for development', [
    'build',
    'concurrent:build'
  ]);

  grunt.registerTask('deploy', 'Run tests and deploy', [
    'deploy-dependencies',
    'deploy-app'
  ]);

  grunt.registerTask('deploy-dependencies', 'Deploy environment config files and certificate files', [
    'rsync:certs',
    'rsync:env'
  ]);

  grunt.registerTask('deploy-app', 'Deploy app to host', [
    'rsync:app',
    'sshexec:npmInstall',
    'sshexec:build'
  ]);

  grunt.registerTask('deploy-forever', 'Deploy app, install modules and start/restart with forever', [
    'deploy',
    'sshexec:forever'
  ]);

  grunt.registerTask('deploy-systemd', 'Deploy app, install modules and start/restart with systemd', [
    'deploy',
    'sshexec:systemd'
  ]);
};