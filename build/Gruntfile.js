/*global module:false process*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    distDir: "../dist",
    srcDir: "../src",
    testPort: "7002",
    pkg: '<json:../src/package.json>',

    jshint: {
      build: [
        "./grunt.js",
        "./casperjs/*.js",
        "./tasks/*.js"
      ],
      site: [
        "<%= srcDir %>/public/js/*.js",
        "<%= srcDir %>/app/**/*.js"
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        globals: {
          jQuery: false,
          $: false,
          _: true,
          Class: false,
          define: false,
          io: true
        }
      }
    },

    ghost: {
      test: {
        filesSrc: ['test/casperjs/frontend.js'],
        options: {
          direct: true,
          printCommand: true,
          args: {
            port: 7002
          }
        }
      }
    },

    clean : {
      src: ["<%= distDir %>"],
      options: {
        force: true
      }
    },

    rsync : {
      dist: {
        src: "<%= srcDir %>/",
        dest: "<%= distDir %>",
        recursive: true,
        args: ['--copy-links'],
        exclude: [
            "scss",
            ".DS_Store",
            ".idea",
            ".git",
            ".gitignore"
        ]
      },
      deploy: {
        src: "<%= distDir %>/",
        dest: "/var/node/noise-box/app",
        recursive: true,
        syncDest: true,
        host: "wintermute",
        exclude: [
          "node_modules"
        ]
      }
    },

    requirejs: {
      frontend: {
        options: {
          baseUrl: "<%= distDir %>/public/js",
          mainConfigFile: "<%= distDir %>/public/js/main.js",
          out: "<%= distDir %>/public/js/main.js",
          name: "main",
          optimize: "uglify",
          removeCombined: false
        }
      }
    },

    cssmin: {
      compress: {
        files: {
          "<%= distDir %>/public/css/style.css": ["<%= distDir %>/public/css/style.css"]
        }
      }
    },

    shell: {
      npmInstall: {
        command: "ssh wintermute 'cd /var/node/noise-box/app; npm install --production;'",
        stdout: true
      },
      monitRestart: {
        command: "ssh wintermute 'sudo monit restart noise-box'",
        stdout: true
      }
    },

    watch: {
      less: {
        files: '<%= srcDir %>/public/less/*.less',
        tasks: 'less:development'
      }
    },

    less: {
      development: {
        files: {
          "<%= srcDir %>/public/css/style.css": "<%= srcDir %>/public/less/style.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ghost');
  grunt.loadNpmTasks("grunt-rsync");
  grunt.loadNpmTasks("grunt-shell");

  grunt.registerTask('spawn', 'Start app in the background', function () {
    var fs = require('fs'),
       spawn = require('child_process').spawn,
       out = fs.openSync('./out.log', 'a'),
       err = fs.openSync('./out.log', 'a'),
       env = process.env;

    env.NODE_ENV = 'testing';
    env.PORT = 7002;

    grunt.log.writeln('Starting app in the background');
    grunt.log.writeln('stdout and stderr will be logged to out.log');

    var child = spawn('node', ['../src/server.js'], {
     detached: true,
     stdio: [ 'ignore', out, err ],
     env: env
    });

    child.unref();
  });

  grunt.registerTask('default', ['quick-test']);
  grunt.registerTask('quick-test', 'Linting JS files', ['less:development', 'jshint:site', 'jshint:build']);
  grunt.registerTask('test', 'Running in-browser tests', ['quick-test', 'spawn' /*, 'ghost' */]);
  grunt.registerTask('dist', 'Concat and minify into dist folder', ['clean', 'rsync:dist', 'requirejs:frontend', 'cssmin']);
  grunt.registerTask('deploy', 'Deploying site', ['test', 'dist', 'rsync:deploy', 'shell:npmInstall', 'shell:monitRestart']);
};
